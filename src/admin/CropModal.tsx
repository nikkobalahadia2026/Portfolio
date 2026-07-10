import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X, Check, ZoomIn } from "lucide-react";
import { getCroppedImageBlob } from "./cropImage";
import { Button } from "./ui";

interface Props {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

export default function CropModal({ imageSrc, aspect = 4 / 3, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-surface-dark-alt rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 dark:border-white/8">
          <h2 className="font-display text-base font-semibold">Adjust photo</h2>
          <button
            onClick={onCancel}
            aria-label="Cancel"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-paper-dim dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <ZoomIn size={16} className="text-ink-500 dark:text-neutral-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-maroon-700"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={processing}>
              <Check size={14} />
              {processing ? "Applying…" : "Apply crop"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
