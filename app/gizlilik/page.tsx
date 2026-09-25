import type { Metadata } from "next";
import { Altbilgi } from "@/components/Altbilgi";
import { UstCubuk } from "@/components/UstCubuk";
import stil from "./gizlilik.module.css";

export const metadata: Metadata = { title: "Gizlilik ve KVKK" };

// Bu metin koddaki gerçek veri akışını anlatır. KVKK aydınlatma metni hukuki
// incelemeden geçmeden yayına alınmaz (BRIEF Faz 0); sayfa bu yüzden
// "taslak" olarak işaretli.
export default function GizlilikSayfasi() {
  return (
    <>
      <UstCubuk />
      <main className={stil.sayfa}>
        <p className="vu-label vu-muted">Taslak · hukuki inceleme bekliyor</p>
        <h1 className="vu-display vu-xl">Fotoğrafın sende kalır.</h1>

        <section>
          <h2 className="vu-title">Fotoğrafına ne oluyor</h2>
          <p>
            Deneme için yüklediğin fotoğraf, telefonunda ya da bilgisayarında küçültülür ve sadece o
            deneme için sunucumuza gönderilir. Sunucumuz fotoğrafı seçtiğin ürünün bilgileriyle
            birlikte Google&apos;ın Gemini yapay zekâ servisine iletir ve dönen deneme görselini sana
            gösterir.
          </p>
          <p>
            Fotoğrafın sunucumuzda, veritabanımızda, kayıtlarımızda veya hata izleme sistemlerinde
            saklanmaz. Tarayıcında da kaydedilmez: sayfayı yenilediğinde ya da kapattığında silinir.
          </p>
        </section>

        <section>
          <h2 className="vu-title">Deneme görseli</h2>
          <p>
            Üretilen görsel sadece sana gösterilir, biz saklamayız. İstersen &quot;Görseli indir&quot; ile
            kendi cihazına kaydedebilirsin. Görsel yapay zekâ ile oluşturulur; gerçek bir fotoğraf
            değildir.
          </p>
        </section>

        <section>
          <h2 className="vu-title">Hesap yok</h2>
          <p>
            Vualà&apos;yı kullanmak için ad, e-posta ya da telefon istemiyoruz. Ücretsiz deneme hakkını
            adil dağıtmak için IP adresin gün boyunca sunucu belleğinde bir sayaçla tutulur ve gün
            sonunda silinir.
          </p>
        </section>

        <section>
          <h2 className="vu-title">Markanın sitesi</h2>
          <p>
            &quot;Ürüne git&quot; dediğinde markanın kendi sitesine geçersin. Satın alma ve orada paylaştığın
            bilgiler o markanın gizlilik politikasına tabidir.
          </p>
        </section>

        <section id="kvkk">
          <h2 className="vu-title">KVKK aydınlatma metni</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki aydınlatma metni hazırlanıyor ve
            hukuki incelemeden sonra burada yayınlanacak.
          </p>
        </section>
      </main>
      <Altbilgi />
    </>
  );
}
