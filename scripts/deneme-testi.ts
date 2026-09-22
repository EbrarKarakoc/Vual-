/**
 * Deneme motoru kalite testi.
 *
 *   npm run deneme-testi
 *
 * test/yuzler/  içindeki her fotoğrafı, test/urunler/ içindeki her ürünle
 * dener ve sonucu test/sonuclar/ altına yazar. Faz 1'in çıkış kriterini
 * (20 fotoğraf, bağımsız değerlendirme) elle tıklamadan ölçebilmek için.
 *
 * test/ klasörü gitignore'dadır — yüz fotoğrafları repoya girmez.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname, basename } from "path";

const KOK = join(process.cwd(), "test");
const YUZLER = join(KOK, "yuzler");
const URUNLER = join(KOK, "urunler");
const SONUCLAR = join(KOK, "sonuclar");

const GORSEL_UZANTILARI = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function envYukle() {
  const yol = join(process.cwd(), ".env");
  if (!existsSync(yol)) return;
  for (const satir of readFileSync(yol, "utf8").split("\n")) {
    const m = satir.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function gorselleriListele(klasor: string): string[] {
  if (!existsSync(klasor)) return [];
  return readdirSync(klasor)
    .filter((f) => GORSEL_UZANTILARI.has(extname(f).toLowerCase()))
    .sort();
}

function dataUrlOku(yol: string): string {
  const uzanti = extname(yol).toLowerCase();
  return `data:${MIME[uzanti]};base64,${readFileSync(yol).toString("base64")}`;
}

/** Ücretsiz katmanda görsel modeli tamamen kapalıdır; tekrar denemek işe yaramaz. */
class FaturaKapali extends Error {}

const bekle = (ms: number) => new Promise((r) => setTimeout(r, ms));

function kisalt(mesaj: string): string {
  return mesaj.split("\n")[0].slice(0, 160);
}

async function main() {
  envYukle();

  const { denemeGorseliUret, DenemeHatasi } = await import("../lib/gemini-client");

  /** Hız limitinde artan aralıklarla 3 kez dener. */
  async function denemeYap(girdi: Parameters<typeof denemeGorseliUret>[0]) {
    for (let deneme = 1; ; deneme++) {
      try {
        return await denemeGorseliUret(girdi);
      } catch (err) {
        if (err instanceof DenemeHatasi && /limit:\s*0/.test(err.message)) {
          throw new FaturaKapali(err.message);
        }
        if (err instanceof DenemeHatasi && err.durum === 429 && deneme < 3) {
          const saniye = 10 * deneme;
          process.stdout.write(`hız limiti, ${saniye}s bekleniyor... `);
          await bekle(saniye * 1000);
          continue;
        }
        throw err;
      }
    }
  }

  const yuzler = gorselleriListele(YUZLER);
  const urunler = gorselleriListele(URUNLER);

  if (!yuzler.length || !urunler.length) {
    console.error(
      `Fotoğraf bulunamadı.\n  yüzler:  ${YUZLER} (${yuzler.length})\n  ürünler: ${URUNLER} (${urunler.length})`
    );
    process.exit(1);
  }

  mkdirSync(SONUCLAR, { recursive: true });

  const toplam = yuzler.length * urunler.length;
  console.log(`${yuzler.length} yüz x ${urunler.length} ürün = ${toplam} deneme\n`);

  let sira = 0;
  let basarili = 0;
  const hatalar: string[] = [];

  for (const yuz of yuzler) {
    for (const urun of urunler) {
      sira++;
      const ad = `${basename(yuz, extname(yuz))}__${basename(urun, extname(urun))}`;
      process.stdout.write(`[${sira}/${toplam}] ${ad} ... `);

      const basladi = Date.now();
      try {
        const sonuc = await denemeYap({
          kullaniciFotografi: dataUrlOku(join(YUZLER, yuz)),
          urunGorseli: dataUrlOku(join(URUNLER, urun)),
          urunAdi: basename(urun, extname(urun)),
        });

        const [, b64] = sonuc.match(/^data:[^;]+;base64,(.+)$/)!;
        writeFileSync(join(SONUCLAR, `${ad}.png`), Buffer.from(b64, "base64"));

        basarili++;
        console.log(`tamam (${((Date.now() - basladi) / 1000).toFixed(1)}s)`);
      } catch (err) {
        if (err instanceof FaturaKapali) {
          console.error(
            "\n\nÜcretsiz katmanda görsel üretim modeli kapalı (limit: 0).\n" +
              "aistudio.google.com üzerinden faturalandırmayı aç, sonra tekrar çalıştır.\n" +
              "Tekrar denemenin faydası yok, test durduruldu."
          );
          process.exitCode = 1;
          return;
        }
        const mesaj = err instanceof Error ? kisalt(err.message) : String(err);
        hatalar.push(`${ad}: ${mesaj}`);
        console.log(`HATA — ${mesaj}`);
      }
    }
  }

  console.log(`\n${basarili}/${toplam} başarılı. Çıktılar: ${SONUCLAR}`);
  if (hatalar.length) {
    console.log(`\n${hatalar.length} hata:`);
    for (const h of hatalar) console.log(`  ${h}`);
  }
}

main();
