import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Altbilgi } from "@/components/Altbilgi";
import { UstCubuk } from "@/components/UstCubuk";
import { UrunEylemleri } from "@/components/urun/UrunEylemleri";
import { UrunGalerisi } from "@/components/urun/UrunGalerisi";
import { denenecekUrun, fiyatYaz, markaGetir, tipAdi, urunGetir, URUNLER } from "@/lib/katalog";
import stil from "./urun.module.css";

type Props = { params: { id: string } };

export function generateStaticParams() {
  return URUNLER.map((u) => ({ id: u.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const urun = urunGetir(params.id);
  if (!urun) return {};
  return { title: `${urun.ad} · ${markaGetir(urun.markaId)?.ad}`, description: urun.aciklama };
}

export default function UrunSayfasi({ params }: Props) {
  const urun = urunGetir(params.id);
  if (!urun) notFound();
  const marka = markaGetir(urun.markaId)!;

  return (
    <>
      <UstCubuk />
      <main className={stil.sayfa}>
        <UrunGalerisi urunId={urun.id} ad={urun.ad} gorseller={urun.gorseller} />
        <div className={stil.bilgi}>
          <p className="vu-label vu-muted">{marka.ad}</p>
          <h1 className={`vu-title ${stil.ad}`}>{urun.ad}</h1>
          <p className={stil.fiyat}>{fiyatYaz(urun.fiyat)}</p>
          <p className={stil.aciklama}>{urun.aciklama}</p>
          <dl className={stil.ozellikler}>
            <div>
              <dt className="vu-label vu-muted">Tip</dt>
              <dd>{tipAdi(urun.tip)}</dd>
            </div>
            <div>
              <dt className="vu-label vu-muted">Kumaş</dt>
              <dd>{urun.kumas}</dd>
            </div>
            <div>
              <dt className="vu-label vu-muted">Ölçü</dt>
              <dd>{urun.olcu}</dd>
            </div>
          </dl>
          <UrunEylemleri urun={denenecekUrun(urun)} />
        </div>
      </main>
      <Altbilgi />
    </>
  );
}
