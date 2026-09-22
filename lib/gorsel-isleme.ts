import sharp from "sharp";

export async function resmIsle(buffer: Buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
    .normalize()
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
}

export async function gorselBoyutu(buffer: Buffer) {
  const meta = await sharp(buffer).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}
