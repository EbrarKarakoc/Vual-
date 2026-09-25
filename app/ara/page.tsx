import type { Metadata } from "next";
import Link from "next/link";
import { Altbilgi } from "@/components/Altbilgi";
import { Foto, tonSec } from "@/components/Foto";
import { Kelimeler } from "@/components/Kelimeler";
import { UrunOgesi } from "@/components/UrunOgesi";
import { UstCubuk } from "@/components/UstCubuk";
import { AramaAlani } from "@/components/arama/AramaAlani";
import { UrunEylemleri } from "@/components/urun/UrunEylemleri";
import {
  ara,
  denenecekUrun,
  fiyatYaz,
  linktenBul,
  markaGetir,
  MARKALAR,
  type Urun,
  type UrunTipi,
} from "@/lib/katalog";
import { linkMi } from "@/lib/link";
import stil from "./ara.module.css";

export const metadata: Metadata = { title: "Ara" };

type Props = { searchParams: { q?: string; tip?: string; marka?: string } };

function tipOku(deger?: string): UrunTipi | undefined {
  return deger === "sal" || deger === "esarp" ? deger : undefined;
}

export default function AramaSayfasi({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? "";
  const tip = tipOku(searchParams.tip);
  const markaId = searchParams.marka && markaGetir(searchParams.marka) ? searchParams.marka : undefined;

  if (!q && !tip && !markaId) return <AramaGirisi />;

  return (
    <>
      <UstCubuk />
      <main>
        <div className={stil.ust}>
          <AramaAlani key={q} boyut="kucuk" baslangic={q} />
          <Filtreler q={q} tip={tip} markaId={markaId} />
        </div>
        {linkMi(q) ? <LinkSonucu q={q} /> : <Sonuclar urunler={ara({ metin: q, tip, markaId })} />}
      </main>
      <Altbilgi />
    </>
  );
}

function AramaGirisi() {
  return (
    <div className={stil.giris}>
      <UstCubuk tur="sade" />
      <main className={stil.girisIc}>
        <Kelimeler as="h1" className={`vu-display vu-xl ${stil.girisBaslik}`}>
          Ne arıyorsun?
        </Kelimeler>
        <AramaAlani boyut="buyuk" />
      </main>
    </div>
  );
}

function Filtreler({ q, tip, markaId }: { q: string; tip?: UrunTipi; markaId?: string }) {
  const adres = (degisen: { tip?: UrunTipi; marka?: string }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    const t = "tip" in degisen ? degisen.tip : tip;
    const m = "marka" in degisen ? degisen.marka : markaId;
    if (t) p.set("tip", t);
    if (m) p.set("marka", m);
    return `/ara?${p}`;
  };

  const TIPLER: { deger: UrunTipi; ad: string }[] = [
    { deger: "sal", ad: "Şal" },
    { deger: "esarp", ad: "Eşarp" },
  ];

  return (
    <nav className={`vu-chips ${stil.filtreler}`} aria-label="Filtreler">
      {TIPLER.map((t) => (
        <Link
          key={t.deger}
          className="vu-chip"
          href={adres({ tip: tip === t.deger ? undefined : t.deger })}
          aria-current={tip === t.deger ? "true" : undefined}
          scroll={false}
        >
          {t.ad}
        </Link>
      ))}
      <span className={stil.ayrac} aria-hidden="true" />
      {MARKALAR.map((m) => (
        <Link
          key={m.id}
          className="vu-chip"
          href={adres({ marka: markaId === m.id ? undefined : m.id })}
          aria-current={markaId === m.id ? "true" : undefined}
          scroll={false}
        >
          {m.ad}
        </Link>
      ))}
    </nav>
  );
}

function Izgara({ urunler }: { urunler: Urun[] }) {
  return (
    <div className={stil.izgara}>
      {urunler.map((u) => (
        <div key={u.id} className={stil.hucre}>
          <UrunOgesi urun={u} />
        </div>
      ))}
    </div>
  );
}

function Sonuclar({ urunler }: { urunler: Urun[] }) {
  if (!urunler.length) {
    return (
      <section className={stil.bos}>
        <h2 className="vu-display vu-m">Aradığını bulamadık.</h2>
        <p className="vu-muted">Başka bir renk, kumaş ya da tarz yazmayı dene.</p>
      </section>
    );
  }
  return (
    <section className={stil.sonuclar}>
      <p className={`vu-label vu-muted ${stil.sayi}`}>{urunler.length} sonuç</p>
      <Izgara urunler={urunler} />
    </section>
  );
}

function LinkSonucu({ q }: { q: string }) {
  const sonuc = linktenBul(q);

  if (sonuc.tur === "bulunamadi") {
    return (
      <>
        <section className={stil.bos}>
          <h2 className="vu-display vu-m">Bu ürün henüz katalogumuzda yok.</h2>
          <p className="vu-muted">
            {sonuc.benzerler.length
              ? "Linkteki kelimelere göre benzerlerini gösteriyoruz."
              : "Ürünün adını ya da rengini yazarak aramayı dene."}
          </p>
        </section>
        {sonuc.benzerler.length > 0 && (
          <section className={stil.benzerler}>
            <Izgara urunler={sonuc.benzerler} />
          </section>
        )}
      </>
    );
  }

  const { urun, benzerler } = sonuc;
  const marka = markaGetir(urun.markaId)!;
  return (
    <>
      <section className={stil.bulunan}>
        <p className="vu-label vu-muted">Bulduğumuz ürün</p>
        <div className={stil.bulunanIc}>
          <Link href={`/urun/${urun.id}`} className={stil.bulunanFoto}>
            <Foto src={urun.gorseller[0]} alt={urun.ad} ton={tonSec(urun.id)} oran="45" />
          </Link>
          <div>
            <p className="vu-label vu-muted">{marka.ad}</p>
            <h2 className="vu-display vu-m">{urun.ad}</h2>
            <p className={stil.fiyat}>{fiyatYaz(urun.fiyat)}</p>
            <UrunEylemleri urun={denenecekUrun(urun)} yerlesim="blok" />
          </div>
        </div>
      </section>
      <section className={stil.benzerler}>
        <Kelimeler className={`vu-display vu-l ${stil.benzerBaslik}`}>Benzerleri</Kelimeler>
        <Izgara urunler={benzerler} />
      </section>
    </>
  );
}
