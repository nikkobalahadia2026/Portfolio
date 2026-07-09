import { Calendar, Mail, MapPin, Moon, Sun, BadgeCheck } from "lucide-react";
import type { ProfileData } from "../types";

interface Props {
  profile: ProfileData;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function ProfileHeader({ profile, isDark, onToggleTheme }: Props) {
  return (
    <div className="card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-6 relative">
      <button
        onClick={onToggleTheme}
        aria-label="Toggle dark mode"
        className="absolute top-5 right-5 h-9 w-9 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 text-ink-700 dark:text-neutral-300 hover:bg-paper-dim dark:hover:bg-white/5 transition-colors"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden shrink-0 border border-black/10 dark:border-white/10 bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-3xl font-semibold text-white">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-10">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-display text-2xl sm:text-[1.75rem] font-semibold tracking-tight">
            {profile.name}
          </h1>
          <BadgeCheck size={20} className="text-maroon-600 dark:text-maroon-500 shrink-0" />
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500 dark:text-neutral-400">
          <MapPin size={14} />
          <span>{profile.location}</span>
        </div>

        <p className="mt-2 text-[15px] text-ink-700 dark:text-neutral-300">{profile.title}</p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-sm font-medium px-4 py-2.5 transition-colors"
          >
            <Calendar size={15} />
            Schedule a Call
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-paper-dim dark:hover:bg-white/5 text-sm font-medium px-4 py-2.5 transition-colors"
          >
            <Mail size={15} />
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}
