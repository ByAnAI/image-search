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
  for (let i = 0; i < data.length; i += 4) {
    features.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
  }
  return features;
}
