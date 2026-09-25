import sharp from "sharp";
import { MAKS_FOTO_MB, MIN_FOTO_KENAR } from "./fotograf-sinirlari";

export type FotografKontrolu =
  | { tamam: true }
  | { tamam: false; neden: "bicim" | "buyuk" | "kucuk" | "okunamadi" };

/**
 * Yüklenen fotoğrafın deneme için uygun olup olmadığına bakar. Fotoğraf
 * sadece bellekte çözülür, hiçbir yere yazılmaz (K1).
 */
export async function fotografKontrolEt(dataUrl: string): Promise<FotografKontrolu> {
  const m = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!m) return { tamam: false, neden: "bicim" };

  const buf = Buffer.from(m[2], "base64");
  if (buf.byteLength > MAKS_FOTO_MB * 1024 * 1024) return { tamam: false, neden: "buyuk" };

  try {
    const { width = 0, height = 0 } = await sharp(buf).metadata();
    if (Math.min(width, height) < MIN_FOTO_KENAR) return { tamam: false, neden: "kucuk" };
  } catch {
    return { tamam: false, neden: "okunamadi" };
  }
  return { tamam: true };
}
