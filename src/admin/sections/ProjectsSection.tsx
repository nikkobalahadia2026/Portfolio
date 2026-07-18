import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { projects } from "../../lib/db";
import type { ProjectRow } from "../../lib/dbTypes";
import { Button, Input, Label, SectionCard, Textarea } from "../ui";

const BLANK: Omit<ProjectRow, "id"> = {
  title: "",
  description: "",
  link: "",
  link_label: "",
  has_story: false,
  story: "",
  sort_order: 0,
};

export default function ProjectsSection() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => projects.list().then(setRows).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, patch: Partial<ProjectRow>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const handleSave = async (row: ProjectRow) => {
    const { id, ...values } = row;
    await projects.update(id, values);
  };

  const handleAdd = async () => {
    const created = await projects.create({ ...BLANK, sort_order: rows.length });
    setRows((r) => [...r, created as ProjectRow]);
  };

  const handleDelete = async (id: string) => {
    await projects.remove(id);
    setRows((r) => r.filter((row) => row.id !== id));
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard title="Recent Projects">
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-black/8 dark:border-white/8 p-4 space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={row.title} onChange={(e) => updateLocal(row.id, { title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={row.description}
                onChange={(e) => updateLocal(row.id, { description: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Link (e.g. yoursite.com)</Label>
                <Input
                  value={row.link ?? ""}
                  onChange={(e) => updateLocal(row.id, { link: e.target.value })}
                />
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={row.has_story}
                    onChange={(e) => updateLocal(row.id, { has_story: e.target.checked })}
                  />
                  Show "Read the story"
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
          Add project
        </Button>
      </div>
    </SectionCard>
  );
}
