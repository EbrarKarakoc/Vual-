# Vualà — Ürün Brifingi, Kurallar ve Yol Haritası

Son güncelleme: 25 Eylül 2026

Bu dosya projenin **niyetini** ve **sırasını** tutar. Kodla ilgili günlük
bilgiler `CLAUDE.md` içinde.

---

## 1. Ürün

### Problem

Başörtüsü, ekranda bakılarak satın alınması en zor ürünlerden biri. Aynı şal
farklı ten tonunda, farklı yüz hattında bambaşka duruyor. Bu yüzden sadece
internetten satış yapan mağazalarda iade oranı yüksek, dönüşüm düşük ve
müşteri tereddütlü. Mağazanın gösterebildiği tek şey, kendi mankeninin
üzerindeki hali.

### Çözüm

Kullanıcı kendi yüz ve boyun fotoğrafını yükler. Farklı satıcıların
ürünlerini bu fotoğraf üzerinde, gerçekçi bir görsel olarak dener. Yakıştığına
karar verdiğinde satıcının sitesine gider ve oradan satın alır.

### Akış

```
Satıcı sitesindeki ürün linki
   ↓  (Faz 2 — yarı otomatik alım)
Görsel + açıklama + yorumlar çekilir
   ↓
AI analizi: tip (açıklamadan), desen, kumaş, renk, dökümlülük, şeffaflık  →  ÜRÜN SENTEZİ
   ↓
Kullanıcı kendi fotoğrafını yükler
   ↓  (Faz 1 — deneme motoru)
Sentez + fotoğraf → gerçekçi deneme görseli
   ↓
Beğendi → satıcının sitesine affiliate link ile çıkış
```

### Başörtüsü şekli kuralı *(tasarım kuralı, 25 Eylül 2026)*

Deneme görselinde başörtüsünün **nasıl bağlandığını** iki şey belirler:
ürünün tipi ve kullanıcının yüklediği fotoğraf.

**1. Ürün tipi şekli belirler.** Şal ile kare başörtüsü (eşarp) farklı
ürünlerdir ve farklı bağlanır; biri diğeri gibi gösterilmez.

- **Kare başörtüsü:** üçgen katlanır, katlı kenar alını çerçeveler, çene
  altında iğnelenir, üçgenin ucu arkaya düşer, önde kısa kalır.
- **Şal:** uzun dikdörtgen; uçlar göğse ve/veya omuza uzun sarkar, varsa
  püskül uçlarda durur.

Ürün tipi **satıcının ürün açıklamasından** alınır, fotoğraftan tahmin
edilmez. Fotoğraf yakın çekimde veya katlanmış halde yanıltıcıdır;
açıklama ("şal", "eşarp", "kare", ölçü: 90×90, 70×180 gibi) güvenilir
kaynaktır. Faz 2'deki ürün sentezi tipi açıklamadan çıkarır, insan onay
adımında doğrulanır. **Tipi belirlenmemiş ürün yayına çıkmaz.**

**2. Kullanıcının fotoğrafı kapalılığı belirler.**

| Yüklenen fotoğraf | Bağlama şekli | Kulak / boyun |
|---|---|---|
| **Başörtülü** | Kullanıcının taktığı ürünle aynı tipteyse kendi bağlama şekli korunur, sadece kumaş değişir. Farklı tipteyse ürün kendi tipine göre bağlanır. | Kendi fotoğrafında nasılsa öyle: açıksa açık, kapalıysa kapalı |
| **Saçı açık** | Seçilen ürünün satıcı fotoğrafındaki modelin bağlama şekli uygulanır | Ürün fotoğrafındaki modele göre |

Her durumda **ürünün deseni, rengi ve motif ölçeği asla değişmez** ve saç
hiçbir yerde görünmez.

**Bone ürün değildir.** Başörtülü fotoğrafta bone varsa olduğu gibi kalır:
rengi, kumaşı ve alında görünen genişliği değişmez, büyütülmez. Bone yoksa
yenisi eklenmez. Alnın görünen kısmı orijinal fotoğraftakiyle aynı kalır.

Ürün fotoğrafında model yoksa (düz serilmiş kumaş), günlük tesettür
bağlaması kullanılır: saç, kulaklar ve boyun tamamen kapalı.

Kullanıcı bunu bilerek hareket eder: yükleme ekranında kısa bir uyarı
bulunur — *"Saçı açık bir fotoğraf yüklersen, başörtüsü seçtiğin ürünün
modelindeki şekilde bağlanır."* Başka uyarı eklenmez.

### Gelir modeli

Affiliate. Ürünü biz satmıyoruz, stok tutmuyoruz, kargo yapmıyoruz.
Yönlendirdiğimiz satıştan pay alıyoruz. Bu yüzden **tıklama ve dönüşüm
takibi** Faz 2'nin parçası — ölçemezsek gelir yok.

### Hedef kitle

İki taraflı:

- **Kullanıcı:** başörtüsünü internetten alan, yakışıp yakışmayacağından emin
  olamayan kadın.
- **Satıcı:** fiziksel mağazası olmayan, sadece internetten satan başörtüsü
  markası. Bizim için değer önerisi: iade oranını düşürmek ve dönüşümü
  artırmak.

### Büyüme

Lansman sonrası başörtülü influencer'larla iş birliği. Bu, ürün kalitesine
bağlı bir kanal: influencer kendi yüzünde denediği görseli paylaşacak. Görsel
inandırıcı değilse kanal işlemez. Bu yüzden **Faz 1'in kalite barı, pazarlama
stratejisinin ön koşuludur.**

---

## 2. Değişmez kurallar

Bunlar tercih değil, sınır. Bir faz bu kurallardan birini çiğnemek zorunda
kalıyorsa faz yanlış tasarlanmıştır.

### K1 — Kaynak fotoğraf kalıcı hale getirilmez

Kullanıcının yüklediği yüz/boyun fotoğrafı diske, veritabanına, object
storage'a, log'a, hata izleme servisine veya tarayıcı depolamasına
**yazılmaz**. Sunucuda sadece istek süresince, tarayıcıda sadece sekme
açıkken bellekte durur.

Bunun sonucu: "Fotoğrafını saklamıyoruz" cümlesini kurabiliyoruz ve bu cümle
denetlenebilir. Çalınacak veri yok, çünkü veri yok. Bedeli, kullanıcının her
oturumda fotoğrafını tekrar yüklemesi — bu bedeli kabul ediyoruz.

### K2 — Deneme sonucu saklanmaz

Üretilen görsel kullanıcıya döner ve orada biter. Hesap olmadığı için
sunucuda saklanacak bir yeri de yok: kullanıcı isterse "Görseli indir" ile
kendi cihazına kaydeder. İleride sunucuda saklama gündeme gelirse önce bu
kural yeniden yazılır (özel bucket, imzalı URL, şifreleme).

### K3 — Üçüncü taraf veri akışı açıkça beyan edilir

Fotoğraf deneme görseli üretimi için Google'a gidiyor. Bu gizlenmez.
Aydınlatma metninde hangi verinin nereye gittiği yazılır. Ücretsiz API
katmanı kullanılmaz — sağlayıcının veri işleme şartları Faz 0'da yazılı
olarak doğrulanır.

### K4 — Gerçekçi değilse yayınlanmaz

Deneme görseli kalite barını geçmiyorsa özellik yayına alınmaz. Yarı gerçekçi
bir çıktı, hiç olmamasından daha kötü: kullanıcı ürünü yanlış değerlendirir,
yanlış satın alır, iade eder ve satıcıya zarar veririz. "Şimdilik böyle
kalsın" bu üründe geçerli bir cümle değil.

### K5 — Her sonuçta yapay zekâ üretimi olduğu belirtilir

Deneme görseli gerçek bir fotoğraf değil. Kullanıcı bunu her zaman bilir.
Ürün rengi ve dokusu satıcının verisine dayanır ama ekrandaki görüntü
yorumdur.

### K6 — Kimsenin fotoğrafı rızası olmadan gösterilmez

Paylaşım özelliği eklenirse kullanıcının açık eylemiyle olur. Varsayılan
kapalıdır. Pazarlama görselleri için kullanıcı fotoğrafı kullanılmaz.

### K7 — Faz atlanmaz

Her fazın bir çıkış kriteri var. Kriter sağlanmadan sonraki faza geçilmez.
Özellikle Faz 1: deneme motoru çalışmıyorsa katalog, öneri, PWA ve pazarlama
yatırımının hiçbir anlamı yok.

> **Bilinçli istisna (25 Eylül 2026):** Arayüz, Faz 1 kapanmadan yeni tasarım
> sistemine göre baştan yazıldı (Faz 4–5 işlerinin bir kısmı). Karar ürün
> sahibinin. Katalog verisi hâlâ sahte; Faz 2'ye geçilmedi.

### K8 — Ölü kod bırakılmaz

Terk edilen yaklaşım aynı commit'te silinir. Bu depoda bir kez iki paralel
katman birikti; tekrar etmez.

---

## 3. Teknik kararlar

| Karar | Seçim | Gerekçe |
|---|---|---|
| Platform | Mobil öncelikli web + PWA | App store indirme engeli yok; influencer linki doğrudan tarayıcıda açılır. Native, doğrulama sonrası Faz 7. |
| Fotoğraf saklama | Sıfır saklama | En güçlü mahremiyet vaadi ve en basit mimari. |
| Ürün alımı | Yarı otomatik | Admin link verir, AI analiz eder, insan onaylar. Hukuki risk düşük, kalite kontrolü bizde. |
| Görsel üretimi | Gemini, Nano Banana 2 (`gemini-3.1-flash-image`) | Gemini uygulamasındaki elle testler bu modelle yapıldı. 2.5 Flash Image kullanımdan kalkıyor. Pro modele geçiş tek ortam değişkeni (`GEMINI_GORSEL_MODELI`). |
| Hesap | Yok | Deneme için kayıt, influencer linkinden gelen kullanıcıyı kaçırır; fotoğrafı saklamadığımız için hesaba bağlanacak veri de yok (25 Eylül 2026). Kötüye kullanım IP başına günlük sınırla önlenir. |
| Arayüz | Claude Design "Vualà" tasarım sistemi | Editoryal lookbook dili, bordo–pudra paleti. Tek tasarım dili; Tailwind kaldırıldı. |

---

## 4. Fazlar

### Faz 0 — Zemin ✅ *(büyük kısmı tamam)*

Kod yazmadan önce güvenlik ağı ve hukuki zemin.

- [x] Git deposu kur, mevcut durumu baz commit'e al
- [x] `.gitignore` düzelt — `prisma/migrations` ignore edilmemeli
- [x] Prototip entegrasyonundan kalan ölü katmanı temizle
- [x] `CLAUDE.md` ve bu brief
- [ ] Gemini ücretli katmana geç, veri işleme şartlarını yazılı doğrula
- [ ] KVKK aydınlatma metni ve gizlilik politikası taslağı
- [ ] Uzak depo (GitHub, özel) ve yedek

**Çıkış kriteri:** Kod kaybı riski yok, hangi verinin nereye gittiği yazılı.

---

### Faz 1 — Deneme motoru *(en kritik faz)*

Ürünün tek gerçek riski burada. Görsel inandırıcı olmazsa geri kalan her şey
boşa emek.

- [ ] `/api/try-on`'u gerçek fotoğraflarla uçtan uca doğrula
- [x] **Ürün görselini de Gemini'ye gönder** — metin ipucu tek başına
      yetmiyordu, artık ürün fotoğrafı da referans olarak gidiyor
- [x] Kalite testi altyapısı — `npm run deneme-testi`
- [ ] Prompt iterasyonu: yüz kimliğinin korunması, kumaş dökümü, ışık uyumu
      *(Gemini uygulamasında 15 fotoğrafla yapıldı, koda alındı; bone/yüz
      açıklığı sorunu sürüyor — ürün fotoğrafı yerine kumaş yakın çekimi
      denenecek)*
- [ ] Fotoğraf kalite kapısı: çözünürlük, tek yüz, yüz açısı, ışık — kötü
      girdi kibarca reddedilir *(çözünürlük ve biçim kontrolü var)*
- [x] Görsel ön işleme tarayıcıda: uzun kenar 1536 px'e iner, EXIF düşer
- [ ] İçerik denetimi: fotoğrafı byte olarak alan bir sağlayıcı seç *(eski
      `clarifai-client.ts` URL aldığı için silindi)*
- [ ] Sıfır saklama teyidi: log'a, geçici dosyaya, hata izlemeye foto sızmıyor
- [x] Bekleme deneyimi: değişen cümle + ince ilerleme çizgisi
- [x] IP başına günlük deneme sınırı *(bellekte; Faz 3'te paylaşılan depoya)*

**Çıkış kriteri:** 20 farklı gerçek fotoğrafta, bağımsız 3 kişinin
değerlendirmesiyle **en az %80 "gerçek duruyor"** oranı. Yüz kimliği hiçbir
örnekte bozulmuyor.

**Geçemezse:** alternatif model veya yaklaşım değerlendirilir. Faz 2'ye
geçilmez.

---

### Faz 2 — Ürün sentezi ve gerçek katalog

Sahte veriyi at, gerçek ürünleri getir.

- [ ] Prisma migration'ı oluştur ve uygula, `pgvector` eklentisini aç
- [ ] Admin: ürün linki yapıştırma ekranı
- [ ] Link alımı: görsel, başlık, fiyat, açıklama, yorumlar
- [ ] AI analizi: desen, kumaş, renk, dökümlülük, şeffaflık, stil → **sentez**
- [ ] Ürün tipi (şal / kare başörtüsü) **açıklamadan** çıkarılır, onayda
      doğrulanır — tipsiz ürün yayına çıkmaz *(bkz. Başörtüsü şekli kuralı)*
- [ ] İnsan onay adımı — onaylanmayan ürün yayına çıkmaz
- [ ] `lib/katalog.ts` yerine DB'den okuma *(fonksiyon imzaları korunur)*
- [ ] Gerçek ürün görselleri *(şu an yer tutucu; görselsiz ürünle deneme
      sadece metin ipucuyla çalışıyor)*
- [ ] Affiliate link + tıklama takibi
- [ ] Admin ürün listesi ve düzenleme

**Çıkış kriteri:** En az 100 gerçek ürün katalogda, her birinin sentezi
onaylanmış, affiliate tıklaması ölçülebiliyor.

---

### Faz 3 — Mahremiyet ve kötüye kullanım altyapısı *(hesapsız)*

Hesap olmadığı için (bkz. Teknik kararlar) bu faz kimlik değil, K1–K3'ün
denetlenebilirliği ve maliyet koruması üzerine.

- [x] Fotoğrafın tarayıcıya (`localStorage`) yazılması kaldırıldı — sadece
      sekme belleğinde
- [x] Kullanıcıya ait tablolar şemadan çıkarıldı; Supabase Auth kaldırıldı
- [ ] Deneme sınırını paylaşılan depoya taşı (ör. Upstash Redis) — sunucusuz
      ortamda bellek sayacı örnek başına ayrı sayıyor
- [ ] Gerekirse görünmez bot koruması (ör. Cloudflare Turnstile)
- [ ] Barındırma sağlayıcısının istek log'larında gövde (fotoğraf) tutulmadığını
      doğrula
- [ ] Aydınlatma metnini hukuki incelemeden geçirip yayına al *(taslak:
      `/gizlilik`)*

**Çıkış kriteri:** "Fotoğrafını saklamıyoruz" cümlesi koddan ve barındırma
ayarlarından denetlenebilir; deneme sınırı tüm sunucularda tutarlı.

---

### Faz 4 — Mobil deneyim ve PWA

- [ ] `manifest.json`, ikonlar, ana ekrana ekleme
- [ ] Service worker — çevrimdışı kabuk ve hızlı açılış
- [x] Kamera ile doğrudan çekim (yükleme alternatifi)
- [x] Tüm sayfaların mobil düzen geçişi *(yeni tasarım mobil öncelikli)*

**Çıkış kriteri:** Telefonda ana ekrana eklenip uygulama gibi çalışıyor,
Lighthouse PWA denetimi geçiyor.

---

### Faz 5 — Keşif ve kişiselleştirme

- [ ] Katalog arama ve filtreleme gerçek veriyle *(arayüz ve kelime
      eşleştirmeli arama sahte veriyle çalışıyor)*
- [x] Ürün detay sayfası
- [x] Link yapıştırarak arama — katalogdaki ürün linkiyle eşleştirme; dış
      sayfa çekilmez
- [ ] Embedding üretimi ve benzer ürün önerisi *(şu an kelime eşleştirme)*

**Çıkış kriteri:** Yeni kullanıcı ilgisini çeken ürünü aramadan bulabiliyor.

---

### Faz 6 — Lansman

- [ ] Satıcı tarafı: hangi ürün kaç kez denendi, kaç tıklama aldı
- [ ] Analitik: huni takibi (yükleme → deneme → tıklama)
- [ ] Influencer kiti: paylaşılabilir görsel *(K6 — açık rıza ile)*
- [ ] Performans ve maliyet: deneme başına API maliyeti, hız limitleri
- [ ] Hata izleme *(fotoğraf sızdırmayan yapılandırma ile)*

**Çıkış kriteri:** İlk satıcı iş birliği ve ilk influencer kampanyası
ölçülebilir şekilde yayında.

---

### Faz 7 — Native uygulama *(koşullu)*

PWA'da gerçek kullanıcı ilgisi doğrulandıktan sonra. Aynı backend üzerine
Expo istemci. Doğrulama olmadan başlanmaz.

---

## 5. Açık sorular

Karar verilmesi gereken, henüz cevabı olmayan başlıklar:

- ~~Gemini deneme başına maliyeti ne?~~ **Cevaplandı (25 Eylül 2026'da
  güncellendi):** Nano Banana 2 görsel başına **$0.067**, Nano Banana Pro
  **$0.134** (2.5 Flash Image'ın $0.039'u kullanımdan kalkıyor). Ücretsiz
  katmanda görsel üretimi yok; yeni hesaplar ön ödemeli (en az $5), bakiye
  bitince API durur. Açık kalan kısım: kullanıcı başına kaç bedava deneme
  hakkı? Şimdilik IP başına günde 10 (`GUNLUK_DENEME_LIMITI`). Affiliate
  komisyonu deneme maliyetini karşılamak zorunda — bu bir iş kararı, Faz 2'de
  ölçülecek.
- Nano Banana 2 mi, Pro mu? Gemini uygulamasındaki denemelerde "Pro ile
  yeniden yap" kullanıldıysa beğenilen kalite Pro'dan geliyor olabilir.
- Satıcılarla affiliate anlaşması nasıl kurulacak — mevcut programlar mı,
  doğrudan görüşme mi?
- Ürün görsellerini kendi sunucumuzda mı barındıracağız, satıcının
  görselini mi göstereceğiz? (telif ve hotlink sorunu)
- Kullanıcı fotoğrafını saklamadığımız için her oturumda tekrar yükleme
  sürtünmesi ne kadar kayba yol açacak? Faz 4'te ölçülmeli. (Aynı sekmede
  birden çok ürün, fotoğraf tekrar yüklenmeden denenebiliyor.)
