/**
 * Gemini ile deneme görseli üretimi.
 *
 * Model değiştirmek istendiğinde değişecek tek dosya burasıdır — route
 * sadece bu fonksiyonu çağırır. Varsayılan Nano Banana 2; Nano Banana Pro
 * için GEMINI_GORSEL_MODELI=gemini-3-pro-image (görsel başı maliyet 2 kat).
 *
 * Prompt, Gemini uygulamasında 15 gerçek fotoğrafla elle denenip düzeltilen
 * sürümdür (Eylül 2026). Kuralların gerekçesi docs/BRIEF.md "Başörtüsü şekli
 * kuralı" bölümünde.
 *
 * MAHREMİYET: kullanıcı fotoğrafı buraya bellekte gelir, Gemini'ye gider ve
 * biter. Hiçbir koşulda log'a, diske veya hata mesajına yazılmaz (K1).
 */

import type { UrunTipi } from "./katalog";

const VARSAYILAN_MODEL = "gemini-3.1-flash-image";

const MAKUL_URUN_GORSELI_MB = 8;

export type DenemeGirdisi = {
  /** "data:image/...;base64,..." — kullanıcının yüz/boyun fotoğrafı */
  kullaniciFotografi: string;
  urunTipi: UrunTipi;
  /** Ürün görseli: uzak URL veya data URL. Yoksa sadece metin ipucu kullanılır. */
  urunGorseli?: string;
  urunAdi?: string;
  urunRengi?: string;
  urunKumasi?: string;
};

export class DenemeHatasi extends Error {
  constructor(
    message: string,
    readonly durum: number,
    readonly detay?: string
  ) {
    super(message);
    this.name = "DenemeHatasi";
  }
}

type GeminiParca = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

type GeminiYanit = {
  candidates?: Array<{ content?: { parts?: GeminiParca[] }; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

type Gorsel = { mime: string; base64: string };

function dataUrlCoz(dataUrl: string): Gorsel | null {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  return m ? { mime: m[1], base64: m[2] } : null;
}

async function urunGorseliGetir(kaynak: string): Promise<Gorsel> {
  const dogrudan = dataUrlCoz(kaynak);
  if (dogrudan) return dogrudan;

  let url: URL;
  try {
    url = new URL(kaynak);
  } catch {
    throw new DenemeHatasi("Ürün görseli geçersiz", 400);
  }
  // Sunucu tarafı istek — iç ağa yönlendirilmesini engelle (SSRF).
  if (url.protocol !== "https:") {
    throw new DenemeHatasi("Ürün görseli yalnızca https olabilir", 400);
  }

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new DenemeHatasi(`Ürün görseli indirilemedi (HTTP ${res.status})`, 502);
  }

  const mime = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
  if (!mime.startsWith("image/")) {
    throw new DenemeHatasi("Ürün bağlantısı bir görsel değil", 400);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength > MAKUL_URUN_GORSELI_MB * 1024 * 1024) {
    throw new DenemeHatasi("Ürün görseli çok büyük", 400);
  }

  return { mime, base64: buf.toString("base64") };
}

// Görsel modelleri İngilizce talimata daha tutarlı uyuyor; bu yüzden prompt
// İngilizce.
const SEKIL: Record<UrunTipi, string[]> = {
  esarp: [
    "The product is a SQUARE HIJAB:",
    "- It is folded diagonally into a triangle and placed on the head with the folded edge framing the forehead.",
    "- It is pinned under the chin. The two ends are pinned at the side or shoulder, or fall over the chest.",
    "- The triangle's point falls down the back of the head.",
    "- In front it is shorter than a shawl: it covers the chest area but does not hang down long.",
    "- The printed border runs along the forehead fold and along the hanging edges.",
    "- It must NOT look like a long shawl: no long tails reaching the waist.",
  ],
  sal: [
    "The product is a SHAWL:",
    "- It is a long rectangular piece wrapped around the head and pinned under the chin or at the side.",
    "- One or both long ends fall over the chest and/or are thrown over the shoulder, hanging long.",
    "- Fringe or tassels, if the product has them, are at the ends of the long tails.",
    "- It must NOT look like a folded square scarf.",
  ],
};

function promptOlustur(g: DenemeGirdisi, urunGorseliVar: boolean): string {
  const urun = urunGorseliVar ? "the product from IMAGE 2" : "the product described below";
  const bilgi = [
    g.urunAdi && `- Name: ${g.urunAdi}`,
    g.urunRengi && `- Color: ${g.urunRengi}`,
    g.urunKumasi && `- Fabric: ${g.urunKumasi}`,
  ].filter(Boolean);

  return [
    urunGorseliVar ? "I am giving you two images." : "I am giving you one image.",
    "",
    "IMAGE 1 is a photo of a woman. This is the photo to edit.",
    ...(urunGorseliVar
      ? ["IMAGE 2 is a product photo from a seller. It is the reference for the fabric."]
      : []),
    "",
    "TASK",
    `Edit IMAGE 1 so that the woman is wearing ${urun}, worn the way this type of product is really worn. The result must look like a real, unedited photograph of her.`,
    "",
    ...(bilgi.length
      ? [
          urunGorseliVar
            ? "PRODUCT DETAILS (if they conflict with IMAGE 2, IMAGE 2 wins):"
            : "PRODUCT DETAILS:",
          ...bilgi,
          "",
        ]
      : []),
    "STEP 1 — THE PRODUCT TYPE DECIDES THE SHAPE",
    ...SEKIL[g.urunTipi],
    "",
    "STEP 2 — THE PERSON DECIDES THE COVERAGE",
    "",
    "CASE A — She is already wearing a hijab or shawl in IMAGE 1:",
    ...(urunGorseliVar
      ? [
          "- In this case IMAGE 2 is ONLY a fabric reference. Ignore how the model in IMAGE 2 wears it, ignore the model's underscarf, ignore the model's coverage.",
        ]
      : []),
    "- Remove her current scarf completely: every piece of it, every trace of its pattern and color, including any end hanging behind her, under her arm, behind a bag or at the edge of the frame. No part of the old scarf may remain anywhere in the image.",
    "- Look carefully at her ears in IMAGE 1. If any part of an ear or an earring is visible in IMAGE 1, the same ear and the same earring MUST remain visible in the result, in the same place. Do not cover them. This is more important than any modesty default.",
    "- Look carefully at her neck in IMAGE 1. If her neck is visible, it stays visible the same amount. If it is covered, it stays covered.",
    "- If her current scarf is the same type as the product, keep her way of wrapping it (volume on top, fit around the face, pin position, which side the ends fall to) and only replace the fabric.",
    "",
    "FACE OPENING — CASE A (very important):",
    "- The opening of the scarf around her face must be identical to IMAGE 1: the same shape, the same size, the same position on the forehead, temples, cheeks and chin.",
    "- Look at the edge of the scarf at her hairline in IMAGE 1. If there is a thin strip of another fabric there, it stays exactly that thin strip — the same width (only a few millimeters), the same color — and it stays only where it is in IMAGE 1. It must NOT become a wide band and must NOT continue down the sides of her face.",
    "- If there is no such strip in IMAGE 1, there is none in the result.",
    "- The new scarf's edge comes down to exactly where the old scarf's edge was. There must never be a visible inner layer that looks like a second scarf under the first one.",
    ...(urunGorseliVar ? ["- Do not copy the inner cap or face opening of the model in IMAGE 2."] : []),
    "",
    "CASE B — Her hair is uncovered in IMAGE 1:",
    ...(urunGorseliVar
      ? [
          "- If IMAGE 2 shows a model wearing the product, copy the model's wrapping style and coverage, including the underscarf if the model has one: ears and neck visible or covered exactly like the model.",
          "- If IMAGE 2 shows only the fabric, use the everyday way women in Turkey wear this product type: hair, ears and neck completely covered.",
        ]
      : [
          "- Use the everyday way women in Turkey wear this product type: hair, ears and neck completely covered.",
        ]),
    "",
    "IN ALL CASES",
    "- No hair is visible anywhere.",
    "- The scarf frames the face without covering any part of the face itself.",
    "",
    "THE PRODUCT MUST NOT CHANGE",
    ...(urunGorseliVar
      ? [
          "- Copy the pattern from IMAGE 2 exactly: same motifs, same shapes, same colors, same spacing, same scale.",
          "- Keep the BASE (background) color of the fabric exactly. If the base is pink, it stays pink — it must not become cream, white or beige.",
          "- If the pattern is irregular, hand-painted or made of brush strokes, keep it irregular. Do not turn it into regular, evenly spaced stripes or a repeating print.",
          "- If the product is plain or has very few motifs, keep it that way. Do not add any motif, dot or flower that is not in IMAGE 2.",
          "- Keep any border, edge detail, fringe or embroidery exactly as in the product.",
        ]
      : ["- Use exactly the color and fabric in the product details. Do not add patterns that are not described."]),
    "- Match the material: chiffon is light and slightly sheer; cotton or modal is matte with soft thick folds; satin, silk or twill has a gentle sheen and crisper folds.",
    "- The pattern follows the folds of the fabric; it is not pasted flat.",
    "",
    "THE PERSON AND THE PHOTO MUST NOT CHANGE",
    "- The face stays exactly the same person: eyes, eyebrows, nose, lips, lip color, cheeks, jawline, skin tone, skin texture, moles, freckles, expression, glasses. No beautifying, smoothing or retouching. No new or changed makeup.",
    "- Keep all jewelry and accessories that are visible in IMAGE 1 (earrings, necklaces, rings, bracelets, watches, sunglasses) exactly as they are. Do not add any jewelry or accessory that is not visible in IMAGE 1 — not even if it could have been hidden under the old scarf.",
    "- Keep the exact framing and zoom of IMAGE 1. Do not zoom in, zoom out, crop or extend the image. Do not add, move or change arms, hands or body.",
    "- Do not change her pose, clothing, bag, background, text or stickers in the photo.",
    "- Keep the original lighting direction, color temperature, shadows and grain. The scarf is lit by the same light as her face.",
    "",
    "OUTPUT",
    "- One photorealistic image, same framing as IMAGE 1.",
    "- It must look like a real photograph, not a drawing, 3D render or AI-looking image.",
    "- Do not add text, logos, watermarks, jewelry or objects that are not in IMAGE 1.",
  ].join("\n");
}

export async function denemeGorseliUret(girdi: DenemeGirdisi): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new DenemeHatasi("GEMINI_API_KEY tanımlı değil", 500);
  }
  const model = process.env.GEMINI_GORSEL_MODELI || VARSAYILAN_MODEL;

  const kullanici = dataUrlCoz(girdi.kullaniciFotografi);
  if (!kullanici) {
    throw new DenemeHatasi("Kullanıcı fotoğrafı base64 data URL olmalı", 400);
  }

  const urun = girdi.urunGorseli ? await urunGorseliGetir(girdi.urunGorseli) : null;

  const parcalar: GeminiParca[] = [
    { text: promptOlustur(girdi, Boolean(urun)) },
    { inlineData: { mimeType: kullanici.mime, data: kullanici.base64 } },
  ];
  if (urun) {
    parcalar.push({ inlineData: { mimeType: urun.mime, data: urun.base64 } });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: parcalar }],
        generationConfig: { responseModalities: ["IMAGE"], temperature: 0.4 },
      }),
    }
  );

  const ham = await res.text();
  let veri: GeminiYanit;
  try {
    veri = JSON.parse(ham);
  } catch {
    throw new DenemeHatasi("Gemini yanıtı okunamadı", 502, ham.slice(0, 300));
  }

  if (!res.ok) {
    // Durum kodu aynen geçer: 429 (hız limiti) ile 400 (hatalı istek) farklı
    // ele alınmalı, ikisini birden 502'ye çevirmek bilgi kaybı.
    throw new DenemeHatasi(veri?.error?.message ?? `HTTP ${res.status}`, res.status);
  }

  const engel = veri.promptFeedback?.blockReason;
  if (engel) {
    throw new DenemeHatasi(`İçerik filtrelemesi engelledi: ${engel}`, 422);
  }

  const parts = veri.candidates?.[0]?.content?.parts ?? [];
  const gorselParca = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
  if (!gorselParca) {
    throw new DenemeHatasi(
      "Gemini görsel üretmedi",
      502,
      parts.find((p) => p.text)?.text
    );
  }

  const mime =
    gorselParca.inlineData?.mimeType ?? gorselParca.inline_data?.mime_type ?? "image/png";
  const b64 = gorselParca.inlineData?.data ?? gorselParca.inline_data!.data!;

  return `data:${mime};base64,${b64}`;
}
