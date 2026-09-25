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
**Hesap yok:** kullanıcı kayıt olmadan dener.

Ürünün kalbi iki şey: **görüntü gerçekçiliği** ve **fotoğraf mahremiyeti**.
İkisinden biri bozulursa ürünün var olma sebebi kalmaz.

---

## Komutlar

```bash
npm run dev              # geliştirme sunucusu (localhost:3000)
npm run build            # üretim derlemesi
npx tsc --noEmit         # tip kontrolü — commit öncesi çalıştır
npm run prisma:generate  # Prisma client üret
npm run prisma:migrate   # migration oluştur + uygula
npm run seed             # lib/katalog.ts verisini DB'ye yazar
npm run deneme-testi     # test/yuzler x test/urunler kalite testi → test/sonuclar
```

`npm run lint` henüz yapılandırılmadı (ESLint yapılandırması yok, komut
etkileşimli kurulum soruyor).

---

## Yığın

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Stil | `app/globals.css` (tasarım token'ları + `vu-*` sınıfları) ve CSS Modules |
| Font | Cormorant Garamond (başlık) + Jost (metin), `next/font` |
| Veritabanı | Supabase Postgres (+ `vector`), Prisma şema katmanı — *henüz bağlı değil* |
| Deneme görseli | Google Gemini, varsayılan Nano Banana 2 (`gemini-3.1-flash-image`) |
| Görsel işleme | Tarayıcıda canvas (küçültme), sunucuda sharp (boyut kontrolü) |

---

## Klasör haritası

```
app/
  page.tsx           ana sayfa: açılış, model şeridi, marka bölümleri, nasıl çalışır
  ara/               arama: boşsa arama alanı, ?q / ?tip / ?marka ile sonuçlar, link eşleştirme
  urun/[id]/         ürün sayfası + deneme paneli
  gizlilik/          veri akışı metni (taslak, KVKK hukuki inceleme bekliyor)
  api/try-on/        Gemini deneme görseli üretimi  ← tek API
components/
  UstCubuk, Foto, UrunOgesi, Kelimeler, Hareket, Altbilgi
  anasayfa/          ModelSeridi, MarkaBolumu, KaydirmaEtkisi (paralaks + büyüme)
  arama/             AramaAlani
  urun/              UrunGalerisi, UrunEylemleri
  deneme/            DenemePaneli, OnceSonra, DenemeBaglami, fotografHazirla
lib/
  katalog.ts         ⚠ SAHTE marka/ürün verisi + arama (Faz 2'de DB ile değişecek)
  gemini-client.ts   deneme görseli üretimi — model değişirse değişecek TEK dosya
  gorsel-isleme.ts   sunucuda fotoğraf kontrolü (biçim, boyut, çözünürlük)
  hiz-limiti.ts      IP başına günlük deneme sınırı (bellekte)
  fotograf-sinirlari.ts, link.ts
prisma/
  schema.prisma      Marka + Urun — ⚠ hiç migrate edilmedi
docs/
  BRIEF.md           vizyon, kurallar, fazlar
```

---

## Şu an ne gerçek, ne sahte

Bu tabloyu güncel tut. Bir şeyi gerçeğe çevirdiğinde satırı değiştir.

| Alan | Durum |
|---|---|
| Arayüz | Gerçek — Claude Design'daki "Vualà" tasarım sistemine göre |
| Deneme görseli üretimi | Gemini bağlı; prompt Gemini uygulamasında elle test edildi, **API üzerinden gerçek fotoğrafla doğrulanmadı** |
| Ürün verisi | Sahte — `lib/katalog.ts`, 5 marka × 4 ürün, görsel yok (yer tutucu) |
| Ürün görseli olmadan deneme | Sadece metin ipucuyla çalışır — kalite testi için anlamsız |
| Arama | Katalog içinde kelime eşleştirme; link yapıştırılırsa katalogdaki `urunUrl` ile eşleşir |
| Deneme sınırı | Bellekte; sunucusuz ortamda örnek başına ayrı sayar |
| Veritabanı | Şema var, migration yok, tablo yok |
| PWA | Yok |

---

## Sert kurallar

### 1. Kullanıcı fotoğrafı kalıcı hale getirilmez

Kaynak yüz/boyun fotoğrafı **hiçbir koşulda** diske, veritabanına, object
storage'a, log'a, hata izleme servisine veya tarayıcı depolamasına
(`localStorage`, `sessionStorage`, IndexedDB) yazılmaz. Tarayıcıda sadece
React belleğinde (`DenemeBaglami`) durur, sunucuda sadece istek süresince.

Bu yüzden `app/api/upload` ve `STORAGE_BUCKET = "user-photos"` sabiti bilerek
silindi. Geri ekleme.

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
`katalog`, `urunGetir`, `denemeHakkiKullan`, `fotografHazirla`. İstisna,
yerleşmiş ürün terimleri: `try-on`, `slug`.

**Tek tasarım dili.** Kaynak, Claude Design'daki "Vualà" tasarım sistemi
(https://claude.ai/artifact/QquTLmH19kjXwNcEWtD6YX). Renk, tipografi, boşluk
ve hareket değerleri oradan birebir `app/globals.css` `:root` içine alındı.
Tailwind yok.

- Paylaşılan parçalar `globals.css` içinde `vu-` önekli sınıflar: `vu-btn`,
  `vu-chip`, `vu-item`, `vu-ph` (fotoğraf/yer tutucu), `vu-search`,
  `vu-display`, `vu-label`, `vu-reveal`, `vu-words`.
- Sayfaya/bileşene özel yerleşim, yanındaki `*.module.css` dosyasında.
- Sadece altı marka rengi: `--bordo`, `--sarap`, `--ahududu`, `--gul`,
  `--pudra`, `--kirik-beyaz`. Anlamsal adlar (`--ink`, `--surface-deep` …)
  bunlara bağlı. `--ahududu` çok az kullanılır; pudra veya bordo üzerinde
  yazı rengi olmaz.
- Köşe yok (`--radius-none`), gölge yok. Mobil kırılım 900px.
- Hareket: mobilde sadece belirme (`vu-reveal`, `vu-words`) ve model şeridi;
  paralaks/büyüme sadece masaüstünde. `prefers-reduced-motion` her şeyi durdurur.
- Kullanıcıya "sen" diye hitap edilir. Sabit cümleler (fotoğraf saklanmaz,
  saçı açık fotoğraf uyarısı, "Yapay zekâ ile oluşturuldu", "Satın alma
  X'in sitesinde yapılır") tasarım sistemindeki gibi birebir kalır.

**Yorum yazma alışkanlığı.** Sadece *neden* açık değilse yorum yaz. Ne yaptığını
anlatan yorum yazma.

---

## Tuzaklar

- Markaların Türkçe ekleri (`'daki`, `'nın`) yabancı isimlerde hesaplanamıyor;
  `lib/katalog.ts` ve şemada elle tutuluyor. Yeni marka eklerken doldur.
- Ürün tipi (`sal` / `esarp`) prompt'ta bağlama şeklini belirliyor ve satıcı
  açıklamasından gelir. `/api/try-on` tipi ve görseli istemciden değil
  katalogdan alır; istemciye güvenme.
- Katalogda ürün görseli yok, bu yüzden `/api/try-on` şu an sadece metin
  ipucuyla çalışır. Kalite testi için gerçek ürün fotoğrafıyla
  `npm run deneme-testi` kullan (ürün dosya adı `sal-` veya `esarp-` ile
  başlamalı).
- Deneme görseli ücretli (görsel başı ~$0.067). Geliştirirken `/api/try-on`'a
  gerçek fotoğraf göndermek bakiyeden düşer.
- Deneme sonucu 60 sn sürebilir (`maxDuration = 60`). Vercel Hobby planında
  limit daha düşük; deploy öncesi kontrol et.
