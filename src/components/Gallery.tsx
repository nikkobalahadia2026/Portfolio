import { useRef } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import type { GalleryImage } from "../types";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const items = images.length > 0 ? images : Array.from({ length: 5 }, () => null);

  return (
    <div>
      <h2 className="font-display text-lg font-semibold mb-4">Gallery</h2>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((img, i) =>
            img ? (
              <div
                key={img.url + i}
                className="shrink-0 h-40 w-52 rounded-xl overflow-hidden border border-black/10 dark:border-white/10"
              >
                <img src={img.url} alt={img.caption ?? ""} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div
                key={i}
                className="shrink-0 h-40 w-52 rounded-xl border border-black/10 dark:border-white/10 bg-paper-dim dark:bg-white/5 flex flex-col items-center justify-center gap-2 text-ink-500 dark:text-neutral-500"
              >
                <ImageIcon size={22} />
                <span className="text-xs">Add photo {i + 1}</span>
              </div>
            )
          )}
        </div>

        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll gallery left"
          className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white dark:bg-surface-dark-alt border border-black/10 dark:border-white/10 items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll gallery right"
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white dark:bg-surface-dark-alt border border-black/10 dark:border-white/10 items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
