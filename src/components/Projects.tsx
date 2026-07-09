import { ChevronRight } from "lucide-react";
import type { Project } from "../types";

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
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug">{project.title}</h3>
              <ChevronRight size={16} className="text-ink-500 dark:text-neutral-500 shrink-0 mt-0.5" />
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500 dark:text-neutral-400">
              {project.description}
            </p>
            {(project.link || project.hasStory) && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {project.link && (
                  <code className="text-[11px] rounded-md bg-paper-dim dark:bg-white/5 px-2 py-1 text-ink-700 dark:text-neutral-300">
                    {project.link}
                  </code>
                )}
                {project.hasStory && (
                  <span className="text-[11px] text-ink-500 dark:text-neutral-500">
                    Read the story
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
