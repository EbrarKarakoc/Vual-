import { GONDERIM_MAKS_KENAR, MIN_FOTO_KENAR } from "@/lib/fotograf-sinirlari";
import type { KullaniciFotografi } from "./DenemeBaglami";

export class FotografHatasi extends Error {}

/**
 * Fotoğrafı tarayıcıda açar, çok küçükse reddeder, büyükse küçültür ve JPEG
 * data URL'ye çevirir. Sunucuya giden veri böylece en aza iner; EXIF
 * (konum dahil) yeniden çizim sırasında düşer.
 */
export async function fotografHazirla(dosya: File): Promise<KullaniciFotografi> {
  if (!dosya.type.startsWith("image/")) {
    throw new FotografHatasi("Bu dosya bir fotoğraf değil.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(dosya, { imageOrientation: "from-image" });
  } catch {
    throw new FotografHatasi("Fotoğraf açılamadı. JPG veya PNG bir fotoğraf dene.");
  }

  try {
    if (Math.min(bitmap.width, bitmap.height) < MIN_FOTO_KENAR) {
      throw new FotografHatasi(
        "Fotoğraf çok küçük. Yüzünün net göründüğü daha büyük bir fotoğraf yükle."
      );
    }

    const olcek = Math.min(1, GONDERIM_MAKS_KENAR / Math.max(bitmap.width, bitmap.height));
    const genislik = Math.round(bitmap.width * olcek);
    const yukseklik = Math.round(bitmap.height * olcek);

    const tuval = document.createElement("canvas");
    tuval.width = genislik;
    tuval.height = yukseklik;
    tuval.getContext("2d")!.drawImage(bitmap, 0, 0, genislik, yukseklik);

    return { src: tuval.toDataURL("image/jpeg", 0.9), genislik, yukseklik };
  } finally {
    bitmap.close();
  }
}
