import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RENKLER = [
  { hex: "#2D6A4F", ad: "Zümrüt Yeşili" },
  { hex: "#6B4423", ad: "Kahverengi" },
  { hex: "#DC2626", ad: "Kırmızı" },
  { hex: "#1E3A8A", ad: "Lacivert" },
  { hex: "#F4B5B3", ad: "Pudra Pembe" },
  { hex: "#F3E9D2", ad: "Krem" },
  { hex: "#0A0A0A", ad: "Siyah" },
];
const KUMASLAR = ["sifon", "pamuk", "ipek", "medine", "krep"];
const STILLER = ["klasik", "modern", "turban", "sal"];

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Ürünler oluşturuluyor…");
  for (let i = 1; i <= 30; i++) {
    const r = RENKLER[i % RENKLER.length];
    const k = KUMASLAR[i % KUMASLAR.length];
    const s = STILLER[i % STILLER.length];
    const ad = `${r.ad} ${s} şal ${i}`;
    await prisma.product.upsert({
      where: { slug: slug(ad) },
      update: {},
      create: {
        slug: slug(ad),
        name: ad,
        description: `${r.ad} tonunda, ${k} kumaştan üretilmiş ${s} başörtüsü.`,
        colorHex: r.hex,
        colorName: r.ad,
        fabricType: k,
        style: s,
        price: 149 + i * 5,
        currency: "TRY",
        imageUrls: [`https://picsum.photos/seed/seed${i}/600/800`],
        affiliateUrl: `https://example.com/urun/${i}`,
        brand: i % 2 === 0 ? "Nur Moda" : "Sena Tekstil",
        inStock: true,
      },
    });
  }
  console.log("Tamamlandı.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
