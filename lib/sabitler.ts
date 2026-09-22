export const SITE_NAME = "Vualà";
export const SITE_DESCRIPTION =
  "Fotoğrafını yükle, yüzlerce başörtüyü dene, beğendiğini al.";

export const RENKLER = [
  { deger: "siyah", ad: "Siyah", hex: "#0A0A0A" },
  { deger: "beyaz", ad: "Beyaz", hex: "#FFFFFF" },
  { deger: "kirmizi", ad: "Kırmızı", hex: "#DC2626" },
  { deger: "yesil", ad: "Zümrüt Yeşili", hex: "#2D6A4F" },
  { deger: "mavi", ad: "Lacivert", hex: "#1E3A8A" },
  { deger: "krem", ad: "Krem", hex: "#F3E9D2" },
  { deger: "pembe", ad: "Pudra Pembe", hex: "#F4B5B3" },
  { deger: "kahve", ad: "Kahverengi", hex: "#6B4423" },
];

export const KUMASLAR = [
  { deger: "sifon", ad: "Şifon" },
  { deger: "pamuk", ad: "Pamuk" },
  { deger: "ipek", ad: "İpek" },
  { deger: "medine", ad: "Medine İpek" },
  { deger: "krep", ad: "Krep" },
];

export const STILLER = [
  { deger: "klasik", ad: "Klasik" },
  { deger: "modern", ad: "Modern" },
  { deger: "turban", ad: "Türban" },
  { deger: "sal", ad: "Şal" },
];

export const SABLON_TIPLERI = [
  { id: "duz", ad: "Düz Bağlama", aciklama: "Klasik, sade bağlama stili" },
  { id: "turban", ad: "Türban", aciklama: "Modern türban stili" },
  { id: "yan_drape", ad: "Yan Drape", aciklama: "Yandan drape görünümü" },
  { id: "klasik", ad: "Klasik", aciklama: "Geleneksel bağlama" },
  { id: "modern", ad: "Modern Şal", aciklama: "Gevşek şal stili" },
];

export const MAX_FOTO_MB = 10;
export const MIN_FOTO_PIXEL = 512;

// Kullanıcı fotoğrafı için storage bucket'ı bilerek tanımlı değil.
// Kaynak fotoğraf hiçbir koşulda diske yazılmaz — bkz. docs/BRIEF.md.
