import { NextRequest, NextResponse } from "next/server";
import { denemeGorseliUret, DenemeHatasi } from "@/lib/gemini-client";

/**
 * POST /api/try-on
 *
 * Body:
 *   userPhotoDataUrl  "data:image/...;base64,..."   (zorunlu)
 *   productImage      ürün görseli: https URL veya data URL
 *   productName, productStyle, productColor          (metin ipuçları)
 *
 * Yanıt: { image: "data:image/png;base64,..." } | { error: string }
 *
 * Hiçbir yere kaydetmez — önbelleği client tutar (K1).
 */

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  const { userPhotoDataUrl, productImage, productName, productStyle, productColor } =
    body as Record<string, string | undefined>;

  if (!userPhotoDataUrl) {
    return NextResponse.json(
      { error: "userPhotoDataUrl gerekli (data:image/...;base64,... formatında)" },
      { status: 400 }
    );
  }

  try {
    const image = await denemeGorseliUret({
      kullaniciFotografi: userPhotoDataUrl,
      urunGorseli: productImage,
      urunAdi: productName,
      urunStili: productStyle,
      urunRengi: productColor,
    });
    return NextResponse.json({ image });
  } catch (err) {
    if (err instanceof DenemeHatasi) {
      // Log'a sadece hata metni gider, görsel asla.
      console.error("[try-on]", err.message, err.detay ?? "");
      return NextResponse.json(
        { error: err.message, detail: err.detay },
        { status: err.durum }
      );
    }
    console.error("[try-on] beklenmedik hata:", err);
    return NextResponse.json({ error: "Deneme görseli üretilemedi" }, { status: 500 });
  }
}
