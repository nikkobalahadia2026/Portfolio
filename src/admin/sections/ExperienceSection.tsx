import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { experience } from "../../lib/db";
import type { ExperienceRow } from "../../lib/dbTypes";
import { Button, Input, Label, SectionCard } from "../ui";

const BLANK: Omit<ExperienceRow, "id"> = {
  title: "",
  org: "",
  period: "",
  is_current: false,
  sort_order: 0,
};

export default function ExperienceSection() {
  const [rows, setRows] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => experience.list().then(setRows).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, patch: Partial<ExperienceRow>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const handleSave = async (row: ExperienceRow) => {
    const { id, ...values } = row;
    await experience.update(id, values);
  };

  const handleAdd = async () => {
    const created = await experience.create({ ...BLANK, sort_order: rows.length });
    setRows((r) => [...r, created as ExperienceRow]);
  };

  const handleDelete = async (id: string) => {
    await experience.remove(id);
    setRows((r) => r.filter((row) => row.id !== id));
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard title="Experience" description="Shown as a timeline in the sidebar.">
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-black/8 dark:border-white/8 p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Title</Label>
                <Input value={row.title} onChange={(e) => updateLocal(row.id, { title: e.target.value })} />
              </div>
              <div>
                <Label>Organization</Label>
                <Input value={row.org} onChange={(e) => updateLocal(row.id, { org: e.target.value })} />
              </div>
              <div>
                <Label>Period (e.g. 2025 – Present)</Label>
                <Input
                  value={row.period}
                  onChange={(e) => updateLocal(row.id, { period: e.target.value })}
                />
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={row.is_current}
                    onChange={(e) => updateLocal(row.id, { is_current: e.target.checked })}
                  />
                  Mark as current
                </label>
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
          Add entry
        </Button>
      </div>
    </SectionCard>
  );
}
