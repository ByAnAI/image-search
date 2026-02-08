export type ImageFeatures = number[];

const GRID_SIZE = 64;

export async function resizeImageFile(file: File, size = GRID_SIZE): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported.");
  }
  ctx.drawImage(bitmap, 0, 0, size, size);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error("Image resize failed."));
        return;
      }
      resolve(result);
    }, "image/png");
  });
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return new File([blob], `${baseName}-64.png`, { type: "image/png" });
}

export async function extractImageFeatures(file: File): Promise<ImageFeatures> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = GRID_SIZE;
  canvas.height = GRID_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported.");
  }
  ctx.drawImage(bitmap, 0, 0, GRID_SIZE, GRID_SIZE);
  const { data } = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);
  const features: number[] = [];
  const luminance: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    features.push(r, g, b);
    // Per-pixel luminance captures brightness structure.
    luminance.push(0.299 * r + 0.587 * g + 0.114 * b);
  }

  // Simple gradient magnitude adds texture/shape sensitivity.
  const gradients: number[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const idx = y * GRID_SIZE + x;
      const right = x + 1 < GRID_SIZE ? idx + 1 : idx;
      const down = y + 1 < GRID_SIZE ? idx + GRID_SIZE : idx;
      const dx = luminance[right] - luminance[idx];
      const dy = luminance[down] - luminance[idx];
      gradients.push(Math.sqrt(dx * dx + dy * dy) / Math.SQRT2);
    }
  }

  features.push(...luminance, ...gradients);
  return features;
}
