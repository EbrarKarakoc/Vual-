# Başörtü Dene — Ürün Brifingi, Kurallar ve Yol Haritası

Son güncelleme: 22 Eylül 2026

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
AI analizi: desen, kumaş, renk, dökümlülük, şeffaflık  →  ÜRÜN SENTEZİ
   ↓
Kullanıcı kendi fotoğrafını yükler
   ↓  (Faz 1 — deneme motoru)
Sentez + fotoğraf → gerçekçi deneme görseli
   ↓
Beğendi → satıcının sitesine affiliate link ile çıkış
```

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
storage'a, log'a veya hata izleme servisine **yazılmaz**. Sadece istek
süresince bellekte durur.

Bunun sonucu: "Fotoğrafını saklamıyoruz" cümlesini kurabiliyoruz ve bu cümle
denetlenebilir. Çalınacak veri yok, çünkü veri yok. Bedeli, kullanıcının her
oturumda fotoğrafını tekrar yüklemesi — bu bedeli kabul ediyoruz.

### K2 — Deneme sonucu varsayılan olarak saklanmaz

Üretilen görsel kullanıcıya döner ve orada biter. Kullanıcı açıkça "kaydet"
derse saklanır; o zaman da:

- özel bucket, herkese açık URL yok
- erişim sadece kısa ömürlü imzalı URL ile
- satır düzeyinde güvenlik (RLS): sadece sahibi okuyabilir
- uygulama katmanında şifreleme

Yani veritabanı sızsa bile görseller okunamaz.

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
| Görsel üretimi | Gemini 2.5 Flash Image | Zaten entegre, görsel-girdili düzenleme yapabiliyor. Faz 1'de kalite barını geçemezse alternatif değerlendirilir. |

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
- [ ] **Ürün görselini de Gemini'ye gönder** — şu an sadece metin ipucu
      gidiyor, gerçekçilik için görsel referans şart
- [ ] Prompt iterasyonu: yüz kimliğinin korunması, kumaş dökümü, ışık uyumu
- [ ] Fotoğraf kalite kapısı: çözünürlük, tek yüz, yüz açısı, ışık — kötü
      girdi kibarca reddedilir
- [ ] Görsel ön işleme tarayıcıda yapılsın (gönderilen veri minimum olsun)
- [ ] `clarifai-client.ts`'i URL yerine byte alacak şekilde düzelt
- [ ] Sıfır saklama teyidi: log'a, geçici dosyaya, hata izlemeye foto sızmıyor
- [ ] Bekleme deneyimi: 60 sn sürebilir, kullanıcı ne gördüğünü bilsin

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
- [ ] İnsan onay adımı — onaylanmayan ürün yayına çıkmaz
- [ ] `lib/studio-data.ts` yerine DB'den okuma *(dikkat: `id` number → uuid)*
- [ ] Gerçek ürün görselleri (picsum.photos'u kaldır)
- [ ] Affiliate link + tıklama takibi
- [ ] Admin ürün listesi ve düzenleme

**Çıkış kriteri:** En az 100 gerçek ürün katalogda, her birinin sentezi
onaylanmış, affiliate tıklaması ölçülebiliyor.

---

### Faz 3 — Gerçek hesap ve mahremiyet altyapısı

Sahte kimliği at, K1–K2'yi koda dök.

- [ ] Supabase Auth'u devreye al, `middleware.ts`'i geri aç
- [ ] `StudioProvider`'ın localStorage'a fotoğraf yazmasını kaldır *(K1 ihlali)*
- [ ] Prisma şemasından `User.photoUrl` / `photoProcessed` alanlarını çıkar
- [ ] RLS politikaları: her kullanıcı sadece kendi satırını görür
- [ ] Kaydedilen deneme görselleri için şifreleme + imzalı URL
- [ ] Favoriler ve denemeler DB'ye (`/api/favoriler` gerçekten çalışsın)
- [ ] Hesap silme: tek tıkla, tüm veri gider
- [ ] Aydınlatma metnini yayına al

**Çıkış kriteri:** "Fotoğrafını saklamıyoruz" cümlesi koddan denetlenebilir.
Hesap silme tam çalışıyor.

---

### Faz 4 — Mobil deneyim ve PWA

- [ ] `manifest.json`, ikonlar, ana ekrana ekleme
- [ ] Service worker — çevrimdışı kabuk ve hızlı açılış
- [ ] Kamera ile doğrudan çekim (yükleme alternatifi)
- [ ] Tüm sayfaların mobil düzen geçişi
- [ ] Navbar'ın mobilde gizlendiği sorunu çöz — alt sekme çubuğu

**Çıkış kriteri:** Telefonda ana ekrana eklenip uygulama gibi çalışıyor,
Lighthouse PWA denetimi geçiyor.

---

### Faz 5 — Keşif ve kişiselleştirme

- [ ] Katalog arama ve filtreleme gerçek veriyle
- [ ] Ürün detay sayfası *(eski sahte veri sayfası silindi, yeniden yazılacak)*
- [ ] Embedding üretimi ve benzer ürün önerisi
- [ ] "Bana özel" — favori ve deneme geçmişine dayalı vitrin
- [ ] `oneri-motoru.ts`'i gerçek veriyle doğrula

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

- Gemini deneme başına maliyeti ne? Ücretsiz deneme hakkı kaç olacak?
- Satıcılarla affiliate anlaşması nasıl kurulacak — mevcut programlar mı,
  doğrudan görüşme mi?
- Ürün görsellerini kendi sunucumuzda mı barındıracağız, satıcının
  görselini mi göstereceğiz? (telif ve hotlink sorunu)
- Kullanıcı fotoğrafını saklamadığımız için her oturumda tekrar yükleme
  sürtünmesi ne kadar kayba yol açacak? Faz 4'te ölçülmeli.
