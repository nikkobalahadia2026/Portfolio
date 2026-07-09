import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { gallery, uploadMedia } from "../../lib/db";
import type { GalleryImageRow } from "../../lib/dbTypes";
import { SectionCard } from "../ui";

export default function GallerySection() {
  const [rows, setRows] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => gallery.list().then(setRows).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadMedia(file, "gallery");
        const created = await gallery.create(url, "", rows.length);
        setRows((r) => [...r, created as GalleryImageRow]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    await gallery.remove(id);
    setRows((r) => r.filter((row) => row.id !== id));
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard title="Gallery" description="Photos shown in the scrolling gallery strip.">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {rows.map((row) => (
          <div key={row.id} className="relative group rounded-xl overflow-hidden border border-black/8 dark:border-white/8 aspect-video">
            <img src={row.image_url} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => handleDelete(row.id)}
              aria-label="Delete photo"
              className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <label className="aspect-video rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 flex flex-col items-center justify-center gap-1.5 text-ink-500 dark:text-neutral-400 cursor-pointer hover:border-maroon-600/50 transition-colors">
          <Upload size={18} />
          <span className="text-xs">{uploading ? "Uploading…" : "Add photos"}</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-xs text-ink-500 dark:text-neutral-500">
        Photos are stored in your Supabase <code>portfolio-media</code> storage bucket.
      </p>
    </SectionCard>
  );
}
