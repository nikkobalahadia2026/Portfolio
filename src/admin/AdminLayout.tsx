import { NavLink, Outlet } from "react-router-dom";
import {
  User,
  AlignLeft,
  Code2,
  Briefcase,
  Clock,
  Award,
  Images,
  Link as LinkIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "../lib/auth";

const NAV = [
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/about", label: "About", icon: AlignLeft },
  { to: "/admin/tech", label: "Tech Stack", icon: Code2 },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/experience", label: "Experience", icon: Clock },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/links", label: "Links", icon: LinkIcon },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-paper dark:bg-surface-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex gap-6">
        <aside className="w-56 shrink-0 hidden sm:block">
          <div className="sticky top-6 card p-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 px-3 py-2 mb-2 text-xs text-ink-500 dark:text-neutral-400 hover:text-maroon-600 transition-colors"
            >
              View live site
              <ExternalLink size={13} />
            </a>
            <nav className="space-y-0.5">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-maroon-800 text-white"
                        : "text-ink-700 dark:text-neutral-300 hover:bg-paper-dim dark:hover:bg-white/5"
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={() => signOut()}
              className="mt-2 w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 dark:text-neutral-400 hover:bg-paper-dim dark:hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="sm:hidden mb-4 -mx-1 flex gap-1.5 overflow-x-auto pb-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-maroon-800 text-white"
                      : "border border-black/10 dark:border-white/10 text-ink-700 dark:text-neutral-300"
                  }`
                }
              >
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
