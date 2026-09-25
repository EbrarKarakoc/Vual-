import Link from "next/link";
import { Kelimeler } from "../Kelimeler";
import { UrunOgesi } from "../UrunOgesi";
import { markaUrunleri, type Marka } from "@/lib/katalog";
import stil from "./MarkaBolumu.module.css";

export function MarkaBolumu({ marka, koyu }: { marka: Marka; koyu: boolean }) {
  const urunler = markaUrunleri(marka.id);
  if (!urunler.length) return null;

  const tumu = (
    <Link className="vu-link" href={`/ara?marka=${marka.id}`}>
      Tümünü gör →
    </Link>
  );

  return (
    <section className={`${koyu ? "vu-deep" : "vu-soft"} ${stil.bolum}`}>
      <div className={stil.bas}>
        <p className={`vu-label ${stil.ust}`}>{marka.ad}</p>
        <Kelimeler className={`vu-display ${stil.baslik}`}>
          {`${marka.ad}${marka.ekler.bulunma} ${marka.vitrin} dene`}
        </Kelimeler>
        <div className={stil.tumuMasaustu}>{tumu}</div>
      </div>
      <div className={stil.ray}>
        {urunler.map((u) => (
          <UrunOgesi key={u.id} urun={u} className={stil.oge} />
        ))}
      </div>
      <div className={stil.tumuMobil}>{tumu}</div>
    </section>
  );
}
