import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { certifications } from "../../lib/db";
import type { CertificationRow } from "../../lib/dbTypes";
import { Button, Input, Label, SectionCard } from "../ui";

const BLANK: Omit<CertificationRow, "id"> = {
  title: "",
  issuer: "",
  url: "",
  sort_order: 0,
};

export default function CertificationsSection() {
  const [rows, setRows] = useState<CertificationRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard title="Certifications">
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

        <Button variant="ghost" onClick={handleAdd}>
          <Plus size={14} />
          Add certification
        </Button>
      </div>
    </SectionCard>
  );
}
