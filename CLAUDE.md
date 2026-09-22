# CLAUDE.md

Bu dosya, bu depoda çalışan her oturumun başında okunur. Ürün vizyonu, kurallar
ve faz planı için **`docs/BRIEF.md`** dosyasına bak — burada sadece kodla
çalışmak için gereken bilgi var.

---

## Proje nedir

Başörtüsü satan sitelerin ürünlerini tek yerde toplayan, kullanıcının kendi
yüz/boyun fotoğrafı üzerinde bu başörtülerini **yapay zekâ ile denemesini**
sağlayan, beğendiğinde satıcının sitesine yönlendiren mobil öncelikli web
uygulaması. Gelir modeli affiliate — biz satmıyoruz, satışa aracılık ediyoruz.

Ürünün kalbi iki şey: **görüntü gerçekçiliği** ve **fotoğraf mahremiyeti**.
İkisinden biri bozulursa ürünün var olma sebebi kalmaz.

---

## Komutlar

```bash
npm run dev              # geliştirme sunucusu (localhost:3000)
npm run build            # üretim derlemesi
npm run lint             # eslint
npx tsc --noEmit         # tip kontrolü — commit öncesi çalıştır
npm run prisma:generate  # Prisma client üret
npm run prisma:migrate   # migration oluştur + uygula
npm run seed             # prisma/seed.ts
npm run deneme-testi     # test/yuzler x test/urunler kalite testi → test/sonuclar
```

---

## Yığın

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Stil | Tailwind + `app/globals.css` içindeki CSS değişkenleri |
| Veritabanı | Supabase Postgres (+ `vector` eklentisi), Prisma şema katmanı |
| Kimlik | Supabase Auth *(şu an devre dışı — aşağıya bak)* |
| Deneme görseli | Google Gemini 2.5 Flash Image (`gemini-2.5-flash-image`) |
| İçerik denetimi | Clarifai moderation |
| Görsel işleme | sharp |

---

## Klasör haritası

```
app/
  (main)/          Navbar'lı uygulama kabuğu
    dene/          fotoğraf yükleme
    katalog/       ürün ızgarası
    try-on/        AI deneme sonuçları
    favorilerim/
    profil/
  (auth)/          giris, kayit → AuthScreen
  (admin)/         admin paneli (iskelet)
  api/
    try-on/        Gemini deneme görseli üretimi  ← tek deneme endpoint'i
    favoriler/     yazıldı, DB yok, test edilmedi
    oneriler/      yazıldı, DB yok, test edilmedi
    moderation/    yazıldı, DB yok, test edilmedi
    auth/callback/ Supabase OAuth dönüşü
components/
  studio/          CANLI tasarım dili — CSS değişkenleri + inline style
  layout/          Navbar, Logo
  ui/              button/card/input/sheet/skeleton — Tailwind + emerald
lib/
  gemini-client.ts deneme görseli üretimi — model değişirse değişecek TEK dosya
  studio-data.ts   ⚠ SAHTE ürün verisi (Faz 2'de DB ile değişecek)
  sabitler.ts      renk/kumaş/stil listeleri, yükleme limitleri
  oneri-motoru.ts  favori tabanlı öneri (DB bekliyor)
  gorsel-isleme.ts sharp ile yeniden boyutlandırma/normalize
  supabase-*.ts    sunucu ve tarayıcı istemcileri
  clarifai-client.ts
prisma/
  schema.prisma    ⚠ hiç migrate edilmedi
docs/
  BRIEF.md         vizyon, kurallar, fazlar
  prototip/        orijinal HTML/JSX prototipi — sadece referans, import etme
```

---

## Şu an ne gerçek, ne sahte

Bu tabloyu güncel tut. Bir şeyi gerçeğe çevirdiğinde satırı değiştir.

| Alan | Durum |
|---|---|
| Deneme görseli üretimi | Gemini bağlı, **gerçek fotoğrafla doğrulanmadı** |
| Ürün verisi | Sahte — `lib/studio-data.ts`, görseller picsum.photos |
| Kimlik doğrulama | Sahte — `StudioProvider` + localStorage |
| `middleware.ts` | Boş geçiş, Supabase kontrolü kapalı |
| Veritabanı | Şema var, migration yok, tablo yok |
| Favoriler / öneriler | API yazılmış, DB olmadığı için çalışmıyor |
| Admin paneli | Sadece iskelet, "buraya gelecek" yazıyor |
| PWA | Yok |

---

## Sert kurallar

### 1. Kullanıcı fotoğrafı kalıcı hale getirilmez

Kaynak yüz/boyun fotoğrafı **hiçbir koşulda** diske, veritabanına, object
storage'a, log'a veya hata izleme servisine yazılmaz. Sadece istek süresince
bellekte durur ve yanıt döndükten sonra biter.

Bu yüzden `app/api/upload` ve `STORAGE_BUCKET = "user-photos"` sabiti bilerek
silindi. Geri ekleme.

> **Bilinen ihlal:** `components/studio/StudioProvider.tsx` fotoğrafı base64
> olarak `localStorage`'a (`bs-photo`) yazıyor. Faz 3'te kaldırılacak.
> Yeni kod bu deseni çoğaltmasın.

### 2. Gemini'ye giden veri bilinçli bir karardır

Fotoğraf üçüncü tarafa (Google) gidiyor. Ücretsiz katman kullanılmaz; veri
işleme şartları `docs/BRIEF.md` içinde yazılı olarak doğrulanır ve aydınlatma
metninde açıkça belirtilir.

### 3. Sır commit edilmez

`.env` gitignore'da ve öyle kalacak. Yeni değişken eklersen `.env.example`
dosyasına **boş** olarak ekle.

### 4. `prisma/migrations` asla ignore edilmez

Bu hata bir kez yapıldı ve şema geçmişi kayboldu. Migration dosyaları commit
edilir.

### 5. Ölü kod bırakılmaz

Bu depoda bir kez iki paralel katman birikti ve hiçbiri erişilemez haldeydi.
Bir yaklaşımı terk ediyorsan aynı commit'te sil. Git geçmişi zaten saklıyor.

---

## Konvansiyonlar

**İsimlendirme Türkçe.** Klasör, dosya, fonksiyon ve değişkenler Türkçe:
`katalog`, `favoriler`, `oneriGetir`, `resmIsle`, `sabitler`. İstisna, yerleşmiş
ürün terimleri: `try-on`, `studio`, `slug`.

**İki tasarım dili var, farkına var.** `components/studio/*` ve `(main)`
sayfaları CSS değişkenleri + inline `style` kullanıyor (zeytin/bej/bordo
paleti). `components/ui/*`, `loading.tsx`, `not-found.tsx` ve admin ise Tailwind
+ emerald kullanıyor. **Yeni kullanıcı arayüzü studio dilini takip eder.**
Admin tarafı şimdilik Tailwind'de kalabilir.

Palet `app/globals.css` `:root` içinde: `--bg`, `--ink`, `--green`, `--wine`,
`--line`, `--cream` ve `--radius-*`, `--ease-*`.

**Yorum yazma alışkanlığı.** Sadece *neden* açık değilse yorum yaz. Ne yaptığını
anlatan yorum yazma.

---

## Tuzaklar

- `lib/studio-data.ts` içindeki `StudioProduct.id` **number**, Prisma
  `Product.id` ise **uuid string**. Faz 2'de DB'ye geçerken burası kırılacak.
- `oneri-motoru.ts` Supabase tablolarını `"Product"`, `"Favorite"` gibi
  büyük harfle sorguluyor; Prisma'nın ürettiği tablo adlarıyla eşleştiğini
  migration sonrası doğrula.
- `clarifai-client.ts` bir **URL** alıyor. Sıfır-saklama politikasında ortada
  URL yok — byte/base64 alacak şekilde değiştirilmesi gerekiyor (Faz 1).
- `lib/studio-data.ts` ürün görselleri **picsum.photos**'tan geliyor, yani
  başörtüsü değil rastgele stok fotoğraf. `/api/try-on` artık ürün görselini
  de Gemini'ye gönderdiği için, sahte veriyle yapılan test **anlamsızdır** —
  gerçek ürün fotoğrafıyla `npm run deneme-testi` kullan.
- Deneme sonucu 60 sn sürebilir (`maxDuration = 60`). Vercel Hobby planında
  limit daha düşük; deploy öncesi kontrol et.
