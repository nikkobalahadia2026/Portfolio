import { useEffect, useState } from "react";
import { Trash2, Upload, Crop } from "lucide-react";
import { gallery, uploadMediaBlob, deleteMediaByUrl } from "../../lib/db";
import type { GalleryImageRow } from "../../lib/dbTypes";
import { Input, SectionCard } from "../ui";
import CropModal from "../CropModal";

// The aspect ratio used everywhere the gallery renders (Gallery.tsx cards
// are h-40 w-52, i.e. roughly 4:3). Keep in sync if you change that layout.
const GALLERY_ASPECT = 4 / 3;

export default function GallerySection() {
  const [rows, setRows] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pending crop session: either a brand-new upload, or a re-crop of an
  // existing gallery row (identified by `replacingId`).
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const load = () => gallery.list().then(setRows).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  // ---- start a crop session from a freshly picked file ----
  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePickNewFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setReplacingId(null);
    setPendingImageSrc(await readFileAsDataUrl(file));
  };

  const handlePickReplacementFile = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setReplacingId(id);
    setPendingImageSrc(await readFileAsDataUrl(file));
  };

  // ---- re-crop an existing photo without picking a new file ----
  const handleRecropExisting = (row: GalleryImageRow) => {
    setError(null);
    setReplacingId(row.id);
    setPendingImageSrc(row.image_url);
  };

  // ---- finish a crop session: upload the cropped blob, save to DB ----
  const handleCropConfirm = async (blob: Blob) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadMediaBlob(blob, "gallery");

      if (replacingId) {
        const existing = rows.find((r) => r.id === replacingId);
        const updated = await gallery.update(replacingId, { image_url: url });
        setRows((r) => r.map((row) => (row.id === replacingId ? (updated as GalleryImageRow) : row)));
        if (existing) await deleteMediaByUrl(existing.image_url);
      } else {
        const created = await gallery.create(url, "", rows.length);
        setRows((r) => [...r, created as GalleryImageRow]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setPendingImageSrc(null);
      setReplacingId(null);
    }
  };

  const handleDelete = async (row: GalleryImageRow) => {
    await gallery.remove(row.id);
    setRows((r) => r.filter((item) => item.id !== row.id));
    await deleteMediaByUrl(row.image_url);
  };

  const updateCaptionLocal = (id: string, caption: string) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, caption } : row)));

  const saveCaption = (row: GalleryImageRow) => gallery.update(row.id, { caption: row.caption });

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard
      title="Gallery"
      description="Photos shown in the scrolling gallery strip on the live site. Click any photo there to open it full-size."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {rows.map((row) => (
          <div key={row.id} className="space-y-1.5">
            <div className="relative group rounded-xl overflow-hidden border border-black/8 dark:border-white/8 aspect-[4/3]">
              <img src={row.image_url} alt={row.caption ?? ""} className="h-full w-full object-cover" />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />

              <div className="absolute top-1.5 right-1.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRecropExisting(row)}
                  aria-label="Adjust crop"
                  title="Adjust crop"
                  className="h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                >
                  <Crop size={13} />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  aria-label="Delete photo"
                  title="Delete photo"
                  className="h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <Input
              placeholder="Caption (optional)"
              value={row.caption ?? ""}
              onChange={(e) => updateCaptionLocal(row.id, e.target.value)}
              onBlur={() => saveCaption(row)}
              className="text-xs"
            />

            <label className="block text-center">
              <span className="text-[11px] text-ink-500 dark:text-neutral-500 hover:text-maroon-600 cursor-pointer transition-colors">
                Replace photo
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePickReplacementFile(e, row.id)}
              />
            </label>
          </div>
        ))}

        <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 flex flex-col items-center justify-center gap-1.5 text-ink-500 dark:text-neutral-400 cursor-pointer hover:border-maroon-600/50 transition-colors">
          <Upload size={18} />
          <span className="text-xs">{uploading ? "Uploading…" : "Add photo"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handlePickNewFile} />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-xs text-ink-500 dark:text-neutral-500">
        Every photo is cropped to a consistent 4:3 frame before upload. Photos are stored in your
        Supabase <code>portfolio-media</code> storage bucket.
      </p>

      {pendingImageSrc && (
        <CropModal
          imageSrc={pendingImageSrc}
          aspect={GALLERY_ASPECT}
          onCancel={() => {
            setPendingImageSrc(null);
            setReplacingId(null);
          }}
          onConfirm={handleCropConfirm}
        />
      )}
    </SectionCard>
  );
}
