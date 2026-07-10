import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "../types";

interface Props {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: Props) {
  const goPrev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  const current = images[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <figure
        className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt={current.caption ?? ""}
          className="max-h-[75vh] w-auto rounded-xl object-contain"
        />
        {current.caption && (
          <figcaption className="text-sm text-white/80 text-center">{current.caption}</figcaption>
        )}
        {images.length > 1 && (
          <p className="text-xs text-white/50">
            {index + 1} / {images.length}
          </p>
        )}
      </figure>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next photo"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
