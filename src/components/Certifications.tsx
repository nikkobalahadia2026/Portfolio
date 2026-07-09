import { ExternalLink } from "lucide-react";
import type { Certification } from "../types";

export default function Certifications({ items }: { items: Certification[] }) {
  return (
    <div className="card p-6 sm:p-7">
      <h2 className="font-display text-lg font-semibold">Recent Certifications</h2>
      <div className="mt-4 space-y-2">
        {items.map((cert) => (
          <a
            key={cert.title}
            href={cert.url ?? "#"}
            className="flex items-center justify-between gap-3 rounded-xl border border-black/8 dark:border-white/8 px-4 py-3 hover:bg-paper-dim dark:hover:bg-white/5 transition-colors"
          >
            <div>
              <h3 className="text-sm font-semibold">{cert.title}</h3>
              <p className="text-[13px] text-ink-500 dark:text-neutral-400">{cert.issuer}</p>
            </div>
            <ExternalLink size={15} className="text-ink-500 dark:text-neutral-500 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
