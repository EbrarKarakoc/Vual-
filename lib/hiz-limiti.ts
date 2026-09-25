/**
 * IP başına günlük deneme sınırı.
 *
 * Hesap olmadığı için her deneme (görsel başı ~$0.067) kimliksiz bir istekle
 * tetiklenebiliyor; sınır olmadan bir betik bakiyeyi bir gecede bitirir.
 *
 * Sayaç sunucu belleğinde: tek sunucuda doğru çalışır, sunucusuz ortamda
 * (Vercel) her örnek kendi sayacını tutar ve sınır gevşer. Yayından önce
 * paylaşılan bir depoya (ör. Upstash Redis) taşınmalı — BRIEF Faz 3.
 */

const VARSAYILAN_LIMIT = 10;

let sayacGunu = "";
const sayaclar = new Map<string, number>();

function limit(): number {
  const deger = Number(process.env.GUNLUK_DENEME_LIMITI);
  return Number.isInteger(deger) && deger > 0 ? deger : VARSAYILAN_LIMIT;
}

function gunuGuncelle() {
  const bugun = new Date().toISOString().slice(0, 10);
  // Gün değişince tüm sayaçlar silinir; IP adresleri ertesi güne taşınmaz.
  if (bugun !== sayacGunu) {
    sayaclar.clear();
    sayacGunu = bugun;
  }
}

/** Hakkı varsa sayacı bir artırır ve true döner. */
export function denemeHakkiKullan(ip: string): boolean {
  gunuGuncelle();
  const sayi = sayaclar.get(ip) ?? 0;
  if (sayi >= limit()) return false;
  sayaclar.set(ip, sayi + 1);
  return true;
}

/** Deneme sunucu tarafında başarısız olursa hak geri verilir. */
export function denemeHakkiIadeEt(ip: string): void {
  const sayi = sayaclar.get(ip);
  if (sayi) sayaclar.set(ip, sayi - 1);
}
