import type { ExperienceItem } from "../types";

export default function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-semibold">Experience</h2>
      <ol className="mt-5 relative border-l border-black/10 dark:border-white/10 space-y-6 pl-5">
        {items.map((item, i) => (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full ${
                item.current
                  ? "bg-maroon-700 ring-4 ring-maroon-700/15"
                  : "bg-ink-300 dark:bg-neutral-600"
              }`}
            />
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
              <span className="text-xs text-ink-500 dark:text-neutral-500 shrink-0">
                {item.period}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-ink-500 dark:text-neutral-400 leading-snug">
              {item.org}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
