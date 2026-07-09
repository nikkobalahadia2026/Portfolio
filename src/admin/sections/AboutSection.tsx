import { useEffect, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
import { about } from "../../lib/db";
import type { AboutParagraphRow } from "../../lib/dbTypes";
import { Button, SectionCard, Textarea } from "../ui";

export default function AboutSection() {
  const [rows, setRows] = useState<AboutParagraphRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const load = () => about.list().then(setRows).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, content: string) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, content } : row)));

  const handleSave = async (row: AboutParagraphRow) => {
    await about.update(row.id, row.content);
    setStatus("Saved.");
  };

  const handleAdd = async () => {
    const created = await about.create("New paragraph…", rows.length);
    setRows((r) => [...r, created as AboutParagraphRow]);
  };

  const handleDelete = async (id: string) => {
    await about.remove(id);
    setRows((r) => r.filter((row) => row.id !== id));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...rows];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    await about.reorder(next.map((r) => r.id));
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard title="About" description="Each paragraph is shown in order in the About card.">
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-xl border border-black/8 dark:border-white/8 p-3">
            <Textarea
              rows={3}
              value={row.content}
              onChange={(e) => updateLocal(row.id, e.target.value)}
            />
            <div className="mt-2 flex items-center gap-1.5">
              <Button variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                <ArrowUp size={14} />
              </Button>
              <Button variant="ghost" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                <ArrowDown size={14} />
              </Button>
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
          Add paragraph
        </Button>

        {status && <p className="text-sm text-ink-500 dark:text-neutral-400">{status}</p>}
      </div>
    </SectionCard>
  );
}
