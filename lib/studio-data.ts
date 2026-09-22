// Studio prototype data — sponsor markalar, stiller, üretilmiş ürünler.
// Bu dosya yerine gerçek Supabase verisi bağlandığında kullanım değişmez:
// sadece veri kaynağı değişir.

export const SPONSORS = [
  "Modanisa",
  "Sefamerve",
  "Tuğba",
  "Armine",
  "Aker",
  "Karaca Home",
  "İpekevi",
  "Kayra",
  "Puane",
  "Tesettür Dünyası",
];

export const STYLE_TAGS = ["Şal", "Bone", "Eşarp", "İpek", "Pratik", "Düğün"];
export const COLOR_TAGS = ["Bej", "Yeşil", "Bordo", "Siyah", "Krem", "Toprak"];

export type StudioProduct = {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: string;
  color: string;
  style: string;
  seed: number;
  aspect: string;
  isNew: boolean;
  image: string;
};

// Demo amaçlı görsel URL'leri. Her ürünün seed'ine göre picsum.photos'tan
// deterministik bir fotoğraf çekilir — gerçek ürün entegrasyonu geldiğinde
// bu alan doğrudan sponsor mağazadan gelen görselle değiştirilebilir.
function productImage(seed: number): string {
  return `https://picsum.photos/seed/basortu-${seed + 11}/800/1000`;
}

function generate(): StudioProduct[] {
  const names = [
    "Damla Şal",
    "İnci Eşarp",
    "Zeytin Bone",
    "Vişne İpek",
    "Krem Düz",
    "Toprak Tonu",
    "Zarif Saten",
    "Sade Modal",
    "Antik Desen",
    "Leylak Nefti",
    "Nar Kırmızı",
    "Badem Bej",
    "Çiğ İpek",
    "Nil Yeşili",
    "Karanfil Şal",
    "Gül Kurusu",
    "Mühür Desen",
    "Mirra Tonu",
    "Beyaz Gölge",
    "Adaçayı",
    "Terra Kumaş",
    "Bulut Sade",
    "Safran Çizgi",
    "Tütsü Örtü",
  ];
  return names.map((n, i) => ({
    id: i + 1,
    name: n,
    brand: SPONSORS[i % SPONSORS.length],
    price: 120 + ((i * 37) % 520),
    rating: (4.2 + ((i * 7) % 8) / 10).toFixed(1),
    color: COLOR_TAGS[i % COLOR_TAGS.length],
    style: STYLE_TAGS[i % STYLE_TAGS.length],
    seed: i,
    aspect: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/5" : "1/1",
    isNew: i % 7 === 0,
    image: productImage(i),
  }));
}

export const ALL_PRODUCTS: StudioProduct[] = generate();
