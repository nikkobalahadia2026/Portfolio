export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Crops `imageSrc` to `cropAreaPixels` (as reported by react-easy-crop's
 * onCropComplete) and returns a JPEG Blob ready to upload.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  cropAreaPixels: CropArea,
  outputMaxDimension = 1600
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  // Scale the crop down if it's larger than the max output size, so uploads
  // stay a reasonable file size without limiting the interactive crop area.
  const scale = Math.min(1, outputMaxDimension / Math.max(cropAreaPixels.width, cropAreaPixels.height));
  const outputWidth = Math.round(cropAreaPixels.width * scale);
  const outputHeight = Math.round(cropAreaPixels.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't get canvas context.");

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Couldn't export cropped image."))),
      "image/jpeg",
      0.9
    );
  });
}
