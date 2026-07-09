import type { TechCategory } from "../types";

export default function TechStack({ categories }: { categories: TechCategory[] }) {
  return (
    <div className="card p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Tech Stack</h2>
      </div>

      <div className="mt-5 space-y-5">
        {categories.map((cat) => (
          <div key={cat.label}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-neutral-400">
              {cat.label}
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
