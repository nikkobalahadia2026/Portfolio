import { Link2, Briefcase, Mail, Calendar, ChevronRight, ExternalLink } from "lucide-react";
import type { ProfileData } from "../types";
import EmailButton from "./EmailButton";

const ICONS: Record<string, typeof Link2> = {
  GitHub: Link2,
  LinkedIn: Briefcase,
};

export default function Footer({ profile }: { profile: ProfileData }) {
  return (
    <div id="contact" className="card p-6 sm:p-7">
      <div className="grid sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-neutral-400">
            A member of
          </h3>
          <div className="mt-3 space-y-2">
            {profile.memberOf.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between gap-2 rounded-xl border border-black/8 dark:border-white/8 px-3.5 py-2.5 text-sm"
              >
                <span>{m.label}</span>
                <ExternalLink size={14} className="text-ink-500 dark:text-neutral-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-neutral-400">
            Social Links
          </h3>
          <div className="mt-3 space-y-2">
            {profile.social.map((s) => {
              const Icon = ICONS[s.label] ?? ExternalLink;
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-black/8 dark:border-white/8 px-3.5 py-2.5 text-sm hover:bg-paper-dim dark:hover:bg-white/5 transition-colors"
                >
                  <Icon size={15} />
                  {s.label}
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-neutral-400">
            Email
          </h3>
          <EmailButton
            email={profile.email}
            className="mt-3 flex items-center gap-2 text-sm hover:text-maroon-600 transition-colors"
          >
            <Mail size={15} />
            {profile.email}
          </EmailButton>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-neutral-400">
            Let's Talk
          </h3>
          <a
            href={profile.schedulingUrl || "#contact"}
            target={profile.schedulingUrl ? "_blank" : undefined}
            rel={profile.schedulingUrl ? "noreferrer" : undefined}
            className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white px-3.5 py-2.5 text-sm font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calendar size={15} />
              Schedule a Call
            </span>
            <ChevronRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}