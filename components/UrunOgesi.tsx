import Link from "next/link";
import { Foto, tonSec } from "./Foto";
import { fiyatYaz, markaGetir, type Urun } from "@/lib/katalog";

export function UrunOgesi({ urun, className }: { urun: Urun; className?: string }) {
  const marka = markaGetir(urun.markaId);
  return (
    <Link className={`vu-item ${className ?? ""}`} href={`/urun/${urun.id}`}>
      <Foto src={urun.gorseller[0]} alt={urun.ad} ton={tonSec(urun.id)} oran="45" />
      <span className="vu-label vu-muted b">{marka?.ad}</span>
      <span className="n">{urun.ad}</span>
      <span className="p vu-muted">{fiyatYaz(urun.fiyat)}</span>
    </Link>
  );
}
