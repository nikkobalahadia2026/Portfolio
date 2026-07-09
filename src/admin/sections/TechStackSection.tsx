import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { techCategories, techItems } from "../../lib/db";
import type { TechCategoryRow, TechItemRow } from "../../lib/dbTypes";
import { Button, Input, SectionCard } from "../ui";

export default function TechStackSection() {
  const [categories, setCategories] = useState<TechCategoryRow[]>([]);
  const [items, setItems] = useState<TechItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState<Record<string, string>>({});
  const [newCategoryLabel, setNewCategoryLabel] = useState("");

  const load = async () => {
    const [cats, its] = await Promise.all([techCategories.list(), techItems.list()]);
    setCategories(cats);
    setItems(its);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryLabel.trim()) return;
    const created = await techCategories.create(newCategoryLabel.trim(), categories.length);
    setCategories((c) => [...c, created as TechCategoryRow]);
    setNewCategoryLabel("");
  };

  const handleRenameCategory = async (id: string, label: string) => {
    setCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, label } : cat)));
    await techCategories.update(id, label);
  };

  const handleDeleteCategory = async (id: string) => {
    await techCategories.remove(id);
    setCategories((c) => c.filter((cat) => cat.id !== id));
    setItems((i) => i.filter((item) => item.category_id !== id));
  };

  const handleAddItem = async (categoryId: string) => {
    const label = newItemLabel[categoryId]?.trim();
    if (!label) return;
    const count = items.filter((i) => i.category_id === categoryId).length;
    const created = await techItems.create(categoryId, label, count);
    setItems((i) => [...i, created as TechItemRow]);
    setNewItemLabel((s) => ({ ...s, [categoryId]: "" }));
  };

  const handleDeleteItem = async (id: string) => {
    await techItems.remove(id);
    setItems((i) => i.filter((item) => item.id !== id));
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <SectionCard title="Tech Stack" description="Group your tools into categories, e.g. Frontend, Backend.">
      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-black/8 dark:border-white/8 p-4">
            <div className="flex items-center gap-2">
              <Input
                value={cat.label}
                onChange={(e) => handleRenameCategory(cat.id, e.target.value)}
                className="font-semibold"
              />
              <Button variant="danger" onClick={() => handleDeleteCategory(cat.id)}>
                <Trash2 size={14} />
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {items
                .filter((i) => i.category_id === cat.id)
                .map((item) => (
                  <span key={item.id} className="chip flex items-center gap-1.5">
                    {item.label}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`Remove ${item.label}`}
                      className="hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add a technology…"
                value={newItemLabel[cat.id] ?? ""}
                onChange={(e) => setNewItemLabel((s) => ({ ...s, [cat.id]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem(cat.id)}
              />
              <Button variant="ghost" onClick={() => handleAddItem(cat.id)}>
                <Plus size={14} />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="New category name…"
            value={newCategoryLabel}
            onChange={(e) => setNewCategoryLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <Button onClick={handleAddCategory}>
            <Plus size={14} />
            Add category
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
