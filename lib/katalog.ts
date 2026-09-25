/**
 * Katalog: markalar, ürünler ve arama.
 *
 * ⚠ SAHTE VERİ. Ürün adları, fiyatlar ve bağlantılar tasarım için uydurma;
 * markalarla henüz anlaşma yok. Faz 2'de bu dosyanın verisi veritabanına
 * taşınır, fonksiyonların imzası aynı kalır. Ürün görseli olmadığı için
 * arayüz yer tutucu gösterir ve deneme sadece metin ipucuyla çalışır.
 */

export type UrunTipi = "sal" | "esarp";

export type Marka = {
  id: string;
  ad: string;
  /** Türkçe ek uyumu yabancı isimlerde hesaplanamıyor ("Scarfs'taki"), elle tutuluyor. */
  ekler: { bulunma: string; iyelik: string };
  /** Ana sayfadaki başlığın nesnesi: "Tuğba'daki şalları dene". */
  vitrin: string;
};

export type Urun = {
  /** URL'de kullanılan kimlik (slug). */
  id: string;
  markaId: string;
  ad: string;
  /** Satıcı açıklamasından alınır, fotoğraftan tahmin edilmez (BRIEF: Başörtüsü şekli kuralı). */
  tip: UrunTipi;
  kumas: string;
  olcu: string;
  renk: string;
  fiyat: number;
  aciklama: string;
  urunUrl: string;
  gorseller: string[];
};

export const MARKALAR: Marka[] = [
  { id: "tugba", ad: "Tuğba", ekler: { bulunma: "'daki", iyelik: "'nın" }, vitrin: "şalları" },
  { id: "armine", ad: "Armine", ekler: { bulunma: "'deki", iyelik: "'nin" }, vitrin: "eşarpları" },
  { id: "aker", ad: "Aker", ekler: { bulunma: "'deki", iyelik: "'in" }, vitrin: "eşarpları" },
  {
    id: "fresh-scarfs",
    ad: "Fresh Scarfs",
    ekler: { bulunma: "'taki", iyelik: "'ın" },
    vitrin: "şalları",
  },
  {
    id: "cameli-scarf",
    ad: "Cameli Scarf",
    ekler: { bulunma: "'taki", iyelik: "'ın" },
    vitrin: "şalları",
  },
];

type UrunTaslagi = Omit<Urun, "id" | "urunUrl" | "gorseller">;

const TASLAKLAR: UrunTaslagi[] = [
  {
    markaId: "tugba",
    ad: "İpek şifon şal, pudra",
    tip: "sal",
    kumas: "%100 ipek şifon",
    olcu: "75 × 200 cm",
    renk: "pudra",
    fiyat: 1290,
    aciklama:
      "Hafif, akışkan ipek şifon. Yüzü aydınlatan sıcak pudra tonu; günlükte de davette de zahmetsiz bir döküm.",
  },
  {
    markaId: "tugba",
    ad: "Pamuk şal, bordo",
    tip: "sal",
    kumas: "%100 pamuk",
    olcu: "70 × 180 cm",
    renk: "bordo",
    fiyat: 890,
    aciklama: "Mat, yumuşak dokulu pamuk. Kış tonlarıyla uyumlu derin bir bordo.",
  },
  {
    markaId: "tugba",
    ad: "Desenli eşarp, çiçek",
    tip: "esarp",
    kumas: "Twill ipek",
    olcu: "90 × 90 cm",
    renk: "krem, çiçek desenli",
    fiyat: 1150,
    aciklama: "Krem zemin üzerine el çizimi çiçekler; dört kenarı çerçeveli kare eşarp.",
  },
  {
    markaId: "tugba",
    ad: "Krep şal, gül kurusu",
    tip: "sal",
    kumas: "Krep",
    olcu: "75 × 190 cm",
    renk: "gül kurusu",
    fiyat: 990,
    aciklama: "Hafif kumlu dokusuyla kaymayan krep; soluk gül kurusu tonu.",
  },
  {
    markaId: "armine",
    ad: "Twill eşarp, zincir desen",
    tip: "esarp",
    kumas: "Twill ipek",
    olcu: "90 × 90 cm",
    renk: "lacivert, zincir desenli",
    fiyat: 1640,
    aciklama: "Parlak twill üzerinde klasik zincir deseni; kenarları el ile bastırılmış.",
  },
  {
    markaId: "armine",
    ad: "Modal şal, kum",
    tip: "sal",
    kumas: "Modal",
    olcu: "70 × 190 cm",
    renk: "kum beji",
    fiyat: 1090,
    aciklama: "Yumuşak, esnek modal; her mevsim giyilen nötr bir kum beji.",
  },
  {
    markaId: "armine",
    ad: "İpek eşarp, şarap",
    tip: "esarp",
    kumas: "%100 ipek",
    olcu: "100 × 100 cm",
    renk: "şarap",
    fiyat: 2150,
    aciklama: "Derin şarap renginde, hafif parlak saf ipek kare eşarp.",
  },
  {
    markaId: "armine",
    ad: "Jakar şal, taş",
    tip: "sal",
    kumas: "Jakar",
    olcu: "75 × 200 cm",
    renk: "taş grisi",
    fiyat: 1380,
    aciklama: "Kendinden desenli jakar dokuma; ışıkta beliren ince motifler.",
  },
  {
    markaId: "aker",
    ad: "Klasik eşarp, lacivert desen",
    tip: "esarp",
    kumas: "Twill",
    olcu: "90 × 90 cm",
    renk: "lacivert desenli",
    fiyat: 1450,
    aciklama: "Lacivert zemin, beyaz klasik motifler ve kalın çerçeve.",
  },
  {
    markaId: "aker",
    ad: "Şifon şal, pembe",
    tip: "sal",
    kumas: "Şifon",
    olcu: "70 × 180 cm",
    renk: "pembe",
    fiyat: 960,
    aciklama: "Hafif yarı saydam şifon; canlı ama yumuşak bir pembe.",
  },
  {
    markaId: "aker",
    ad: "Soft şal, toprak",
    tip: "sal",
    kumas: "Soft pamuk",
    olcu: "70 × 180 cm",
    renk: "toprak",
    fiyat: 1020,
    aciklama: "Dökümlü soft pamuk; sıcak bir toprak tonu.",
  },
  {
    markaId: "aker",
    ad: "Twill eşarp, kareli",
    tip: "esarp",
    kumas: "Twill",
    olcu: "90 × 90 cm",
    renk: "kareli",
    fiyat: 1520,
    aciklama: "İnce kareli desen, kontrast kenar bandı.",
  },
  {
    markaId: "fresh-scarfs",
    ad: "Medine ipeği şal, toz pembe",
    tip: "sal",
    kumas: "Medine ipeği",
    olcu: "70 × 180 cm",
    renk: "toz pembe",
    fiyat: 420,
    aciklama: "Kaymayan Medine ipeği; toz pembe.",
  },
  {
    markaId: "fresh-scarfs",
    ad: "Jersey şal, vizon",
    tip: "sal",
    kumas: "Penye jersey",
    olcu: "70 × 180 cm",
    renk: "vizon",
    fiyat: 380,
    aciklama: "Esnek penye jersey, iğnesiz de durur; vizon tonu.",
  },
  {
    markaId: "fresh-scarfs",
    ad: "Pamuk şal, kiremit",
    tip: "sal",
    kumas: "Pamuk",
    olcu: "70 × 180 cm",
    renk: "kiremit",
    fiyat: 350,
    aciklama: "Mat pamuk, sıcak bir kiremit rengi.",
  },
  {
    markaId: "fresh-scarfs",
    ad: "Şifon şal, ekru",
    tip: "sal",
    kumas: "Şifon",
    olcu: "70 × 180 cm",
    renk: "ekru",
    fiyat: 399,
    aciklama: "Hafif şifon; her renkle uyumlu ekru.",
  },
  {
    markaId: "cameli-scarf",
    ad: "Keten şal, bej",
    tip: "sal",
    kumas: "Keten karışım",
    olcu: "70 × 190 cm",
    renk: "bej",
    fiyat: 560,
    aciklama: "Doğal dokulu keten karışım; yazlık bej.",
  },
  {
    markaId: "cameli-scarf",
    ad: "İpek karışım eşarp, mürdüm",
    tip: "esarp",
    kumas: "İpek karışım",
    olcu: "90 × 90 cm",
    renk: "mürdüm",
    fiyat: 740,
    aciklama: "Hafif parlak ipek karışım; koyu mürdüm.",
  },
  {
    markaId: "cameli-scarf",
    ad: "Modal şal, pudra",
    tip: "sal",
    kumas: "Modal",
    olcu: "70 × 180 cm",
    renk: "pudra",
    fiyat: 520,
    aciklama: "Yumuşak modal, pudra pembesi.",
  },
  {
    markaId: "cameli-scarf",
    ad: "Desenli eşarp, bahar",
    tip: "esarp",
    kumas: "Twill",
    olcu: "90 × 90 cm",
    renk: "çiçek desenli",
    fiyat: 610,
    aciklama: "Bahar çiçekleriyle bezeli, çerçeveli kare eşarp.",
  },
];

/** Türkçe karakterleri sadeleştirip küçük harfe çevirir: "Şifon Şal" → "sifon sal". */
export function sadelestir(metin: string): string {
  return metin
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[âà]/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugYap(metin: string): string {
  return sadelestir(metin).replace(/ /g, "-");
}

export const URUNLER: Urun[] = TASLAKLAR.map((t) => {
  const id = slugYap(`${t.markaId} ${t.ad}`);
  return { ...t, id, urunUrl: `https://example.com/${t.markaId}/${id}`, gorseller: [] };
});

const markaHaritasi = new Map(MARKALAR.map((m) => [m.id, m]));

export function markaGetir(id: string): Marka | undefined {
  return markaHaritasi.get(id);
}

export function markaUrunleri(markaId: string): Urun[] {
  return URUNLER.filter((u) => u.markaId === markaId);
}

export function urunGetir(id: string): Urun | undefined {
  return URUNLER.find((u) => u.id === id);
}

/** Deneme paneline (istemciye) giden, sadece gerekli alanları taşıyan özet. */
export type DenenecekUrun = {
  id: string;
  ad: string;
  markaAd: string;
  /** "Tuğba'nın" gibi, iyelik ekiyle. */
  markaIyelik: string;
  urunUrl: string;
  gorsel?: string;
};

export function denenecekUrun(u: Urun): DenenecekUrun {
  const marka = markaGetir(u.markaId)!;
  return {
    id: u.id,
    ad: u.ad,
    markaAd: marka.ad,
    markaIyelik: `${marka.ad}${marka.ekler.iyelik}`,
    urunUrl: u.urunUrl,
    gorsel: u.gorseller[0],
  };
}

export function tipAdi(tip: UrunTipi): string {
  return tip === "sal" ? "Şal" : "Eşarp";
}

export function fiyatYaz(fiyat: number): string {
  return `₺${new Intl.NumberFormat("tr-TR").format(fiyat)}`;
}

// ---------- arama ----------

/** Aramada tip belirten kelimeler; ürünü değil tipi seçerler. */
const TIP_KELIMELERI: Record<string, UrunTipi | "hepsi"> = {
  sal: "sal",
  sallar: "sal",
  sali: "sal",
  esarp: "esarp",
  esarplar: "esarp",
  esarpi: "esarp",
  basortu: "hepsi",
  basortusu: "hepsi",
  basortuleri: "hepsi",
};

function kelimeler(metin: string): string[] {
  return sadelestir(metin)
    .split(" ")
    .filter((k) => k.length >= 2);
}

/** "sallari" ile "sal", "desenli" ile "desen" eşleşsin diye önek karşılaştırması. */
function eslesir(aranan: string, kelime: string): boolean {
  return kelime.startsWith(aranan) || (kelime.length >= 3 && aranan.startsWith(kelime));
}

function urunKelimeleri(u: Urun): string[] {
  const marka = markaGetir(u.markaId);
  return kelimeler(`${u.ad} ${u.renk} ${u.kumas} ${marka?.ad ?? ""} ${u.aciklama}`);
}

export type AramaFiltresi = { metin?: string; tip?: UrunTipi; markaId?: string };

export function ara({ metin = "", tip, markaId }: AramaFiltresi): Urun[] {
  const aranan = kelimeler(metin);
  const tipler = new Set<UrunTipi>();
  const icerik: string[] = [];
  for (const k of aranan) {
    const t = TIP_KELIMELERI[k];
    if (t === "sal" || t === "esarp") tipler.add(t);
    else if (!t) icerik.push(k);
  }

  const sonuclar: { urun: Urun; puan: number }[] = [];
  for (const urun of URUNLER) {
    if (tip && urun.tip !== tip) continue;
    if (markaId && urun.markaId !== markaId) continue;
    if (tipler.size && !tipler.has(urun.tip)) continue;

    const sozluk = urunKelimeleri(urun);
    const puan = icerik.filter((a) => sozluk.some((k) => eslesir(a, k))).length;
    if (icerik.length && puan === 0) continue;
    sonuclar.push({ urun, puan });
  }

  return sonuclar.sort((a, b) => b.puan - a.puan).map((s) => s.urun);
}

export function benzerleri(urun: Urun, adet = 8): Urun[] {
  const hedef = kelimeler(`${urun.renk} ${urun.kumas}`);
  return URUNLER.filter((u) => u.id !== urun.id)
    .map((u) => {
      const sozluk = urunKelimeleri(u);
      const ortak = hedef.filter((h) => sozluk.some((k) => eslesir(h, k))).length;
      return { u, puan: ortak * 2 + (u.tip === urun.tip ? 1 : 0) };
    })
    .sort((a, b) => b.puan - a.puan)
    .slice(0, adet)
    .map((s) => s.u);
}

function linkAnahtari(url: URL): string {
  return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}`.toLowerCase();
}

export type LinkSonucu =
  | { tur: "bulundu"; urun: Urun; benzerler: Urun[] }
  | { tur: "bulunamadi"; benzerler: Urun[] };

/**
 * Yapıştırılan ürün linkini katalogla eşleştirir. Linkteki sayfa çekilmez:
 * dış siteye istek atmak hem SSRF riski hem de satıcı sitesini kazımak olur
 * (ürün alımı Faz 2'de admin tarafında, insan onayıyla yapılıyor). Katalogda
 * yoksa linkin son parçasındaki kelimelerle ("ipek-sifon-sal-pudra") arar.
 */
export function linktenBul(metin: string): LinkSonucu {
  let url: URL;
  try {
    url = new URL(metin.trim());
  } catch {
    return { tur: "bulunamadi", benzerler: [] };
  }

  const anahtar = linkAnahtari(url);
  const urun = URUNLER.find((u) => linkAnahtari(new URL(u.urunUrl)) === anahtar);
  if (urun) return { tur: "bulundu", urun, benzerler: benzerleri(urun) };

  const sonParca = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() ?? "");
  const tahmin = sonParca.replace(/\.[a-z]+$/i, "").replace(/[-_]+/g, " ");
  return { tur: "bulunamadi", benzerler: tahmin ? ara({ metin: tahmin }).slice(0, 8) : [] };
}
