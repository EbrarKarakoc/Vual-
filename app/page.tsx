import Link from "next/link";
import { Altbilgi } from "@/components/Altbilgi";
import { Foto } from "@/components/Foto";
import { Kelimeler } from "@/components/Kelimeler";
import { UstCubuk } from "@/components/UstCubuk";
import { KaydirmaEtkisi } from "@/components/anasayfa/KaydirmaEtkisi";
import { MarkaBolumu } from "@/components/anasayfa/MarkaBolumu";
import { ModelSeridi } from "@/components/anasayfa/ModelSeridi";
import { MARKALAR } from "@/lib/katalog";
import stil from "./page.module.css";

const ADIMLAR = [
  { no: "01", metin: "Fotoğrafını yükle", ton: "t-cream" },
  { no: "02", metin: "Beğendiğin başörtüsünü seç", ton: "t-rose" },
  { no: "03", metin: "Üzerinde gör, markasından al.", ton: "t-rasp" },
] as const;

export default function AnaSayfa() {
  return (
    <>
      <UstCubuk tur="foto" />
      <main>
        <section className={stil.acilis}>
          <KaydirmaEtkisi tur="paralaks" className={stil.acilisFoto}>
            <Foto ton="t-deep" figur className={stil.dolu} />
          </KaydirmaEtkisi>
          <div className={stil.perde} />
          <div className={`vu-ondark ${stil.acilisMetin}`}>
            <Kelimeler as="h1" className={`vu-display ${stil.acilisBaslik}`}>
              Başörtünü dijitalde dene.
            </Kelimeler>
            <div className={stil.acilisAlt}>
              <p className="vu-lead vu-reveal">
                Yapay zekâ ile kendi fotoğrafında dene, beğenirsen markasından al.
              </p>
              <Link className={`vu-btn vu-btn--primary vu-reveal ${stil.hemenDene}`} href="/ara">
                Hemen dene
              </Link>
            </div>
          </div>
          <div className={stil.ipucu} aria-hidden="true">
            Aşağı kaydır
            <b />
          </div>
        </section>

        <section className={stil.serit}>
          <Kelimeler className={`vu-display vu-xl ${stil.seritBaslik}`}>Her tarz, tek yerde.</Kelimeler>
          <ModelSeridi />
        </section>

        <section className={stil.buyume}>
          <KaydirmaEtkisi tur="buyume" className={stil.cerceve}>
            <Foto ton="t-deep" figur className={stil.dolu} />
          </KaydirmaEtkisi>
          <p className={`vu-display ${stil.buyumeMetin}`}>
            Kumaşı hisset,
            <br />
            ışığı gör.
          </p>
        </section>

        {MARKALAR.map((m, i) => (
          <MarkaBolumu key={m.id} marka={m} koyu={i % 2 === 0} />
        ))}

        <section className={`vu-soft ${stil.cift}`}>
          <p className="vu-label vu-muted">Lookbook</p>
          <div className={`vu-reveal ${stil.ciftBuyuk}`}>
            <Foto ton="t-cream" oran="23" figur />
          </div>
          <div className={`vu-reveal ${stil.ciftKucuk}`}>
            <Foto ton="t-rasp" oran="34" figur />
          </div>
          <Kelimeler className={`vu-display vu-l ${stil.ciftBaslik}`}>Zarafet, senin fotoğrafında.</Kelimeler>
        </section>

        <section className={stil.nasil}>
          <p className="vu-label vu-muted">Nasıl çalışır</p>
          <ol className={stil.adimlar}>
            {ADIMLAR.map((a) => (
              <li key={a.no} className={`vu-reveal ${stil.adim}`}>
                <Foto ton={a.ton} oran="23" figur />
                <div>
                  <span className={stil.numara}>{a.no}</span>
                  <p>{a.metin}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Altbilgi />
    </>
  );
}
