import { useState } from "react";
import { ExternalLink, Eye } from "lucide-react";
import type { Certification } from "../types";
import Lightbox from "./Lightbox";

export default function Certifications({ items }: { items: Certification[] }) {
  const [viewingCert, setViewingCert] = useState<Certification | null>(null);

  return (
    <div className="card p-6 sm:p-7">
      <h2 className="font-display text-lg font-semibold">Recent Certifications</h2>
      <div className="mt-4 space-y-2">
        {items.map((cert) => {
          if (cert.imageUrl) {
            return (
              <button
                key={cert.title}
                onClick={() => setViewingCert(cert)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-black/8 dark:border-white/8 px-4 py-3 hover:bg-paper-dim dark:hover:bg-white/5 transition-colors text-left"
              >
                <div>
                  <h3 className="text-sm font-semibold">{cert.title}</h3>
                  <p className="text-[13px] text-ink-500 dark:text-neutral-400">{cert.issuer}</p>
                </div>
                <Eye size={15} className="text-ink-500 dark:text-neutral-500 shrink-0" />
              </button>
            );
          }

          if (cert.url) {
            return (
              <a
                key={cert.title}
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-black/8 dark:border-white/8 px-4 py-3 hover:bg-paper-dim dark:hover:bg-white/5 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-semibold">{cert.title}</h3>
                  <p className="text-[13px] text-ink-500 dark:text-neutral-400">{cert.issuer}</p>
                </div>
                <ExternalLink size={15} className="text-ink-500 dark:text-neutral-500 shrink-0" />
              </a>
            );
          }

          return (
            <div
              key={cert.title}
              className="flex items-center justify-between gap-3 rounded-xl border border-black/8 dark:border-white/8 px-4 py-3"
            >
              <div>
                <h3 className="text-sm font-semibold">{cert.title}</h3>
                <p className="text-[13px] text-ink-500 dark:text-neutral-400">{cert.issuer}</p>
              </div>
            </div>
          );
        })}
      </div>

      {viewingCert?.imageUrl && (
        <Lightbox
          images={[{ url: viewingCert.imageUrl, caption: viewingCert.title }]}
          index={0}
          onClose={() => setViewingCert(null)}
          onNavigate={() => {}}
        />
      )}
    </div>
  );
}