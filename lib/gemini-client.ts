/**
 * Gemini 2.5 Flash Image ile deneme görseli üretimi.
 *
 * Model değiştirmek istendiğinde değişecek tek dosya burasıdır — route
 * sadece bu fonksiyonu çağırır. Alternatif sağlayıcılar için bkz.
 * docs/BRIEF.md "Teknik kararlar".
 *
 * MAHREMİYET: kullanıcı fotoğrafı buraya bellekte gelir, Gemini'ye gider ve
 * biter. Hiçbir koşulda log'a, diske veya hata mesajına yazılmaz (K1).
 */

const MODEL = "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAKUL_URUN_GORSELI_MB = 8;

export type DenemeGirdisi = {
  /** "data:image/...;base64,..." — kullanıcının yüz/boyun fotoğrafı */
  kullaniciFotografi: string;
  /** Ürün görseli: uzak URL veya data URL. Yoksa sadece metin ipucu kullanılır. */
  urunGorseli?: string;
  urunAdi?: string;
  urunStili?: string;
  urunRengi?: string;
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

function promptOlustur(g: DenemeGirdisi, urunGorseliVar: boolean): string {
  const { urunAdi = "başörtü", urunStili = "klasik", urunRengi = "krem" } = g;

  const kaynak = urunGorseliVar
    ? [
        "Sana iki görsel veriyorum:",
        "1. GÖRSEL — kişinin fotoğrafı. Düzenlenecek olan bu.",
        "2. GÖRSEL — başörtüsü ürününün fotoğrafı. Sadece referans.",
        "",
        "2. görseldeki kumaşın rengini, desenini, dokusunu ve parlaklığını",
        "birebir al ve 1. görseldeki kişinin başına yerleştir. Ürünün kendisini",
        "kopyala — benzerini üretme.",
      ]
    : [
        "Bu fotoğraftaki kişinin başına doğal, zarif ve gerçekçi bir başörtü",
        "yerleştir.",
      ];

  return [
    ...kaynak,
    "",
    "Ürün bilgisi (görselle çelişirse görsel doğrudur):",
    `- Ad: ${urunAdi}`,
    `- Stil: ${urunStili}`,
    `- Renk: ${urunRengi}`,
    "",
    "Kurallar:",
    "- Başörtü saçın tamamını ve boynun üst kısmını kapatsın.",
    "- Yüzün görünen kısmı (alın, kaş, göz, burun, yanak, çene) BİREBİR aynı",
    "  kalsın. Kişinin kimliği kesinlikle değişmesin.",
    "- Kumaş, kişinin baş pozisyonuna ve omuz hattına göre doğal düşsün;",
    "  kırışıklık ve gölgeler gerçek kumaş gibi olsun.",
    "- Fotoğrafın mevcut ışığına, renk sıcaklığına ve gölge yönüne uy.",
    "- Arkaplanı, vücudu, kıyafeti ve pozu değiştirme.",
    "- Çıktı fotoğraf kalitesinde olsun; çizim, render veya yapay görünmesin.",
    "",
    "Sonuç: aynı kişi, aynı fotoğraf — sadece başında bu başörtüsü var.",
  ].join("\n");
}

export async function denemeGorseliUret(girdi: DenemeGirdisi): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new DenemeHatasi("GEMINI_API_KEY tanımlı değil", 500);
  }

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

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: parcalar }],
      generationConfig: { responseModalities: ["IMAGE"], temperature: 0.4 },
    }),
  });

  const ham = await res.text();
  let veri: GeminiYanit;
  try {
    veri = JSON.parse(ham);
  } catch {
    throw new DenemeHatasi("Gemini yanıtı okunamadı", 502, ham.slice(0, 300));
  }

  if (!res.ok) {
    throw new DenemeHatasi(veri?.error?.message ?? `HTTP ${res.status}`, 502);
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
