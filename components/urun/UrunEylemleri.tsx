"use client";

import { useState } from "react";
import type { DenenecekUrun } from "@/lib/katalog";
import { DenemePaneli } from "../deneme/DenemePaneli";
import stil from "./UrunEylemleri.module.css";

type Props = {
  urun: DenenecekUrun;
  /** dock: mobilde ekranın altına sabitlenir. blok: bulunduğu yerde durur. */
  yerlesim?: "dock" | "blok";
};

export function UrunEylemleri({ urun, yerlesim = "dock" }: Props) {
  const [acik, setAcik] = useState(false);

  return (
    <>
      <div className={yerlesim === "dock" ? stil.dock : stil.blok}>
        <button type="button" className="vu-btn vu-btn--primary vu-btn--block" onClick={() => setAcik(true)}>
          Üzerimde dene
        </button>
        <a
          className="vu-btn vu-btn--secondary vu-btn--block"
          href={urun.urunUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          Ürüne git ↗
        </a>
        <p className="vu-small vu-muted">Satın alma {urun.markaIyelik} sitesinde yapılır.</p>
      </div>
      {acik && <DenemePaneli urun={urun} kapat={() => setAcik(false)} />}
    </>
  );
}
