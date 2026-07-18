import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Upload, X } from "lucide-react";
import { certifications, uploadMedia, deleteMediaByUrl } from "../../lib/db";
import type { CertificationRow } from "../../lib/dbTypes";
import { Button, Input, Label, SectionCard } from "../ui";

const BLANK: Omit<CertificationRow, "id"> = {
  title: "",
  issuer: "",
  url: "",
  image_url: null,
  sort_order: 0,
};

export default function CertificationsSection() {
  const [rows, setRows] = useState<CertificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => certifications.list().then(setRows).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, patch: Partial<CertificationRow>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const handleSave = async (row: CertificationRow) => {
    const { id, ...values } = row;
    await certifications.update(id, values);
  };

  const handleAdd = async () => {
    const created = await certifications.create({ ...BLANK, sort_order: rows.length });
    setRows((r) => [...r, created as CertificationRow]);
  };

  const handleDelete = async (id: string) => {
    await certifications.remove(id);
    setRows((r) => r.filter((row) => row.id !== id));
  };

  const handleUploadPhoto = async (row: CertificationRow, file: File) => {
    setUploadingId(row.id);
    setError(null);
    try {
      const previous = row.image_url;
      const url = await uploadMedia(file, "certifications");
      updateLocal(row.id, { image_url: url });
      await certifications.update(row.id, { image_url: url });
      if (previous) await deleteMediaByUrl(previous);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemovePhoto = async (row: CertificationRow) => {
    updateLocal(row.id, { image_url: null });
    await certifications.update(row.id, { image_url: null });
    if (row.image_url) await deleteMediaByUrl(row.image_url);
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard
      title="Certifications"
      description="Add a photo of the certificate to make it viewable on click, and/or a verification URL. If both are set, the photo takes priority when clicked."
    >
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-black/8 dark:border-white/8 p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Title</Label>
                <Input value={row.title} onChange={(e) => updateLocal(row.id, { title: e.target.value })} />
              </div>
              <div>
                <Label>Issuer</Label>
                <Input value={row.issuer} onChange={(e) => updateLocal(row.id, { issuer: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Verification URL (optional)</Label>
                <Input value={row.url ?? ""} onChange={(e) => updateLocal(row.id, { url: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Certificate photo (optional)</Label>
              {row.image_url ? (
                <div className="flex items-center gap-3">
                  <img
                    src={row.image_url}
                    alt=""
                    className="h-20 w-28 object-cover rounded-lg border border-black/8 dark:border-white/8"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-medium hover:bg-paper-dim dark:hover:bg-white/5 transition-colors">
                        <Upload size={12} />
                        Replace
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUploadPhoto(row, e.target.files[0])}
                      />
                    </label>
                    <button
                      onClick={() => handleRemovePhoto(row)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700"
                    >
                      <X size={12} />
                      Remove photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer inline-block">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-3.5 py-2 text-sm font-medium hover:bg-paper-dim dark:hover:bg-white/5 transition-colors">
                    <Upload size={14} />
                    {uploadingId === row.id ? "Uploading…" : "Upload photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUploadPhoto(row, e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="ghost" onClick={() => handleSave(row)}>
                <Save size={14} />
                Save
              </Button>
              <Button variant="danger" onClick={() => handleDelete(row.id)} className="ml-auto">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button variant="ghost" onClick={handleAdd}>
          <Plus size={14} />
          Add certification
        </Button>
      </div>
    </SectionCard>
  );
}