import { ExternalLink } from "lucide-react";
import type { Project } from "../types";

function toHref(link: string) {
  return link.startsWith("http") ? link : `https://${link}`;
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="card p-6 sm:p-7">
      <h2 className="font-display text-lg font-semibold">Recent Projects</h2>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.title}
            className="rounded-xl border border-black/8 dark:border-white/8 p-4 hover:border-maroon-600/40 transition-colors"
          >
            <h3 className="text-sm font-semibold leading-snug">{project.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500 dark:text-neutral-400">
              {project.description}
            </p>

            {project.link && (
              <a
                href={toHref(project.link)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-paper-dim dark:bg-white/5 px-2 py-1 text-[11px] font-medium text-maroon-600 dark:text-maroon-500 hover:bg-maroon-800 hover:text-white dark:hover:bg-maroon-800 transition-colors"
              >
                {project.linkLabel ?? project.link}
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
