import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/try-on
 *
 * Kullanıcı fotoğrafı + ürün metadatasını alır, Gemini 2.5 Flash Image
 * ("nano-banana") modelini çağırarak başörtüsü geçirilmiş gerçekçi bir görsel
 * üretir. Cache'leme yapmaz — client tarafı kendi önbelleğini tutar.
 *
 * Body:
 *   - userPhotoDataUrl: "data:image/...;base64,..."  (zorunlu)
 *   - productName, productStyle, productColor       (opsiyonel metin ipuçları)
 *
 * Response:
 *   - { image: "data:image/png;base64,..." }         başarılı
 *   - { error: string }                              hata
 */

const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const runtime = "nodejs";
export const maxDuration = 60;

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

function buildPrompt(args: {
  name?: string;
  style?: string;
  color?: string;
}): string {
  const { name = "başörtü", style = "klasik", color = "krem" } = args;
  return [
    "Bu fotoğraftaki kişinin başına doğal, zarif ve gerçekçi bir başörtü (hijab) yerleştir.",
    "",
    "Ürün detayları:",
    `- Ad: ${name}`,
    `- Stil: ${style}`,
    `- Renk: ${color}`,
    "",
    "Teknik kurallar:",
    "- Başörtü SAÇIN TAMAMINI ve boynun üst kısmını kapatsın.",
    "- Yüzün görünen kısmı (alın, kaş, göz, burun, yanak, çene) olduğu gibi kalsın.",
    "- Kumaş kişinin baş pozisyonuna, yüz açısına ve omuz hattına göre doğal şekilde drape edilsin.",
    "- Ürünün RENGİ ve STİLİ yukarıdaki tanıma tam olarak sadık olsun.",
    "- Mevcut fotoğrafın ışığına, gölgesine ve tonuna uyum sağla.",
    "- Arkaplanı, vücudu, kıyafetleri ve kişinin kimliğini değiştirme.",
    "- Çıktı FOTOĞRAF KALİTESİNDE ve gerçekçi olsun — çizim, karikatür veya yapay hissi VERMEsin.",
    "",
    "Sonuç olarak: aynı kişi, aynı fotoğraf, sadece başında tanımlanan başörtüsü olan hali.",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY tanımlı değil. .env dosyasına eklediğinden emin ol." },
      { status: 500 }
    );
  }

  let body: {
    userPhotoDataUrl?: string;
    productName?: string;
    productStyle?: string;
    productColor?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  const { userPhotoDataUrl, productName, productStyle, productColor } = body;

  if (!userPhotoDataUrl || typeof userPhotoDataUrl !== "string") {
    return NextResponse.json(
      { error: "userPhotoDataUrl gerekli (data:image/...;base64,... formatında)" },
      { status: 400 }
    );
  }

  const match = userPhotoDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json(
      { error: "userPhotoDataUrl geçersiz — base64 data URL olmalı" },
      { status: 400 }
    );
  }
  const [, userMime, userB64] = match;

  const prompt = buildPrompt({
    name: productName,
    style: productStyle,
    color: productColor,
  });

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: userMime, data: userB64 } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
          temperature: 0.4,
        },
      }),
    });

    const raw = await response.text();
    let data: GeminiResponse;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error("[try-on] Gemini JSON parse hatası:", raw.slice(0, 500));
      return NextResponse.json(
        { error: "Gemini yanıtı okunamadı" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const msg = data?.error?.message || `HTTP ${response.status}`;
      console.error("[try-on] Gemini API hatası:", msg);
      return NextResponse.json({ error: `Gemini: ${msg}` }, { status: 502 });
    }

    const blockReason = data.promptFeedback?.blockReason;
    if (blockReason) {
      return NextResponse.json(
        { error: `İçerik filtrelemesi tarafından engellendi: ${blockReason}` },
        { status: 422 }
      );
    }

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      (p) => p.inlineData?.data || p.inline_data?.data
    );

    if (!imagePart) {
      const textPart = parts.find((p) => p.text)?.text;
      console.warn("[try-on] Gemini görsel dönmedi. Metin:", textPart);
      return NextResponse.json(
        {
          error: "Gemini görsel üretmedi",
          detail: textPart ?? "Boş yanıt",
        },
        { status: 502 }
      );
    }

    const mime =
      imagePart.inlineData?.mimeType ??
      imagePart.inline_data?.mime_type ??
      "image/png";
    const b64 = imagePart.inlineData?.data ?? imagePart.inline_data?.data!;
    const dataUrl = `data:${mime};base64,${b64}`;

    return NextResponse.json({ image: dataUrl });
  } catch (err) {
    console.error("[try-on] Beklenmedik hata:", err);
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
