import { NextRequest, NextResponse } from "next/server";
import { denemeGorseliUret, DenemeHatasi } from "@/lib/gemini-client";
import { MAKS_FOTO_MB } from "@/lib/fotograf-sinirlari";
import { fotografKontrolEt } from "@/lib/gorsel-isleme";
import { denemeHakkiIadeEt, denemeHakkiKullan } from "@/lib/hiz-limiti";
import { urunGetir } from "@/lib/katalog";

/**
 * POST /api/try-on
 *
 * Body:  { fotograf: "data:image/...;base64,...", urunId: string }
 * Yanıt: { gorsel: "data:image/...;base64,..." } | { hata: string }
 *
 * Ürünün görseli ve tipi istemciden değil katalogdan alınır: tip satıcı
 * açıklamasından gelir (BRIEF: Başörtüsü şekli kuralı) ve istemci rastgele
 * bir görsel URL'si gönderip sunucuya indirtemez.
 *
 * Hiçbir yere kaydetmez (K1, K2). Hata mesajları kullanıcıya gösterilir;
 * teknik ayrıntı sadece log'a gider, fotoğraf asla.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const KUCUK_FOTO_NEDENLERI: Record<string, string> = {
  bicim: "Fotoğraf JPG, PNG veya WEBP olmalı.",
  buyuk: `Fotoğraf ${MAKS_FOTO_MB} MB'tan büyük olmamalı.`,
  kucuk: "Fotoğraf çok küçük. Yüzünün net göründüğü daha büyük bir fotoğraf yükle.",
  okunamadi: "Fotoğraf açılamadı. Başka bir fotoğrafla dene.",
};

function hata(mesaj: string, durum: number) {
  return NextResponse.json({ hata: mesaj }, { status: durum });
}

function istemciIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.ip || "yerel";
}

export async function POST(req: NextRequest) {
  let govde: { fotograf?: unknown; urunId?: unknown };
  try {
    govde = await req.json();
  } catch {
    return hata("Geçersiz istek.", 400);
  }

  const { fotograf, urunId } = govde;
  if (typeof fotograf !== "string" || typeof urunId !== "string") {
    return hata("Fotoğraf ve ürün gerekli.", 400);
  }

  const urun = urunGetir(urunId);
  if (!urun) return hata("Ürün bulunamadı.", 404);

  const kontrol = await fotografKontrolEt(fotograf);
  if (!kontrol.tamam) return hata(KUCUK_FOTO_NEDENLERI[kontrol.neden], 422);

  const ip = istemciIp(req);
  if (!denemeHakkiKullan(ip)) {
    return hata("Bugünlük deneme hakkın doldu. Yarın tekrar deneyebilirsin.", 429);
  }

  try {
    const gorsel = await denemeGorseliUret({
      kullaniciFotografi: fotograf,
      urunTipi: urun.tip,
      urunGorseli: urun.gorseller[0],
      urunAdi: urun.ad,
      urunRengi: urun.renk,
      urunKumasi: urun.kumas,
    });
    return NextResponse.json({ gorsel });
  } catch (err) {
    denemeHakkiIadeEt(ip);
    if (err instanceof DenemeHatasi) {
      console.error("[try-on]", err.durum, err.message, err.detay ?? "");
      if (err.durum === 422) {
        return hata("Bu fotoğrafla deneme yapılamadı. Başka bir fotoğraf dene.", 422);
      }
      if (err.durum === 429) {
        return hata("Şu an çok yoğunuz. Birkaç dakika sonra tekrar dene.", 503);
      }
    } else {
      console.error("[try-on] beklenmedik hata:", err);
    }
    return hata("Deneme görseli şu an üretilemedi. Biraz sonra tekrar dene.", 502);
  }
}
