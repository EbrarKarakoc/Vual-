/**
 * lib/katalog.ts içindeki (sahte) katalogu veritabanına yazar. Faz 2'de
 * gerçek ürün alımı gelene kadar geliştirme verisi olarak kullanılır.
 */

import { PrismaClient } from "@prisma/client";
import { MARKALAR, URUNLER } from "../lib/katalog";

const prisma = new PrismaClient();

async function main() {
  for (const m of MARKALAR) {
    const veri = {
      ad: m.ad,
      bulunmaEki: m.ekler.bulunma,
      iyelikEki: m.ekler.iyelik,
      vitrin: m.vitrin,
    };
    await prisma.marka.upsert({ where: { id: m.id }, update: veri, create: { id: m.id, ...veri } });
  }

  for (const u of URUNLER) {
    const veri = {
      markaId: u.markaId,
      ad: u.ad,
      tip: u.tip,
      kumas: u.kumas,
      olcu: u.olcu,
      renk: u.renk,
      fiyat: u.fiyat,
      aciklama: u.aciklama,
      urunUrl: u.urunUrl,
      gorseller: u.gorseller,
      onaylandi: true,
    };
    await prisma.urun.upsert({ where: { id: u.id }, update: veri, create: { id: u.id, ...veri } });
  }

  console.log(`${MARKALAR.length} marka, ${URUNLER.length} ürün yazıldı.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
