"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { DenenecekUrun } from "@/lib/katalog";
import { Foto, tonSec } from "../Foto";
import { useDeneme, type KullaniciFotografi } from "./DenemeBaglami";
import { FotografHatasi, fotografHazirla } from "./fotografHazirla";
import { OnceSonra } from "./OnceSonra";
import stil from "./DenemePaneli.module.css";

type Asama = { tur: "yukle"; hata?: string } | { tur: "bekle" } | { tur: "sonuc"; gorsel: string };

const BEKLEME_MESAJLARI = ["Kumaşı inceliyoruz…", "Başörtünü yerleştiriyoruz…", "Işığı ayarlıyoruz…"];

export function DenemePaneli({ urun, kapat }: { urun: DenenecekUrun; kapat: () => void }) {
  const { fotograf, fotografAyarla } = useDeneme();
  const [asama, setAsama] = useState<Asama>({ tur: "yukle" });
  const panel = useRef<HTMLDivElement>(null);
  const istek = useRef<AbortController | null>(null);

  const kapatVeIptal = () => {
    istek.current?.abort();
    kapat();
  };

  useEffect(() => {
    const onceki = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const tus = (e: KeyboardEvent) => {
      if (e.key === "Escape") kapatVeIptal();
    };
    window.addEventListener("keydown", tus);
    return () => {
      document.body.style.overflow = onceki;
      window.removeEventListener("keydown", tus);
      istek.current?.abort();
    };
    // Sadece açılışta bağlanır; kapat referansı değişse de dinleyici aynı kalmalı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function denemeBaslat(f: KullaniciFotografi) {
    setAsama({ tur: "bekle" });
    istek.current = new AbortController();
    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fotograf: f.src, urunId: urun.id }),
        signal: istek.current.signal,
      });
      const veri = (await res.json().catch(() => ({}))) as { gorsel?: string; hata?: string };
      if (!res.ok || !veri.gorsel) {
        setAsama({ tur: "yukle", hata: veri.hata ?? "Deneme şu an yapılamadı. Biraz sonra tekrar dene." });
        return;
      }
      setAsama({ tur: "sonuc", gorsel: veri.gorsel });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setAsama({ tur: "yukle", hata: "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene." });
    }
  }

  async function dosyaSecildi(dosya: File | undefined) {
    if (!dosya) return;
    try {
      const f = await fotografHazirla(dosya);
      fotografAyarla(f);
      denemeBaslat(f);
    } catch (err) {
      const mesaj = err instanceof FotografHatasi ? err.message : "Fotoğraf okunamadı.";
      setAsama({ tur: "yukle", hata: mesaj });
    }
  }

  const secim = (e: ChangeEvent<HTMLInputElement>) => {
    dosyaSecildi(e.target.files?.[0]);
    e.target.value = "";
  };
  const birak = (e: DragEvent) => {
    e.preventDefault();
    dosyaSecildi(e.dataTransfer.files?.[0]);
  };

  const koyu = asama.tur === "bekle";

  return (
    <div className={stil.ortu} onClick={kapatVeIptal} role="presentation">
      <div
        ref={panel}
        className={`${stil.panel} ${koyu ? stil.panelKoyu : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${urun.ad} — üzerinde dene`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={`vu-link ${stil.kapat}`} onClick={kapatVeIptal}>
          Kapat
        </button>

        {asama.tur === "yukle" && (
          <div className={stil.icerik}>
            <div className={stil.tutma} aria-hidden="true" />
            <p className="vu-label vu-muted">
              {urun.markaAd} · {urun.ad}
            </p>
            <h2 className={`vu-title ${stil.baslik}`}>Üzerinde dene</h2>

            {fotograf ? (
              <>
                <div className={stil.mevcut}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotograf.src} alt="Yüklediğin fotoğraf" />
                </div>
                <button
                  type="button"
                  className="vu-btn vu-btn--primary vu-btn--block"
                  onClick={() => denemeBaslat(fotograf)}
                >
                  Bu fotoğrafla dene
                </button>
                <label className={`vu-btn vu-btn--secondary vu-btn--block ${stil.ikinci}`}>
                  Başka fotoğraf seç
                  <input type="file" accept="image/*" className="vu-gizli" onChange={secim} />
                </label>
              </>
            ) : (
              <>
                <label className={stil.birak} onDragOver={(e) => e.preventDefault()} onDrop={birak}>
                  <input type="file" accept="image/*" className="vu-gizli" onChange={secim} />
                  <svg viewBox="0 0 40 40" aria-hidden="true">
                    <path d="M20 27V11M13 18l7-7 7 7M9 31h22" />
                  </svg>
                  <span className={stil.buyukYazi}>Fotoğrafını yükle</span>
                  <span className="vu-small vu-muted">JPG veya PNG</span>
                </label>
                <label className={`vu-btn vu-btn--secondary vu-btn--block ${stil.kamera}`}>
                  Kamerayla çek
                  <input type="file" accept="image/*" capture="user" className="vu-gizli" onChange={secim} />
                </label>
              </>
            )}

            {asama.hata && (
              <p className={`vu-small ${stil.hata}`} role="alert">
                {asama.hata}
              </p>
            )}

            <p className={`vu-small ${stil.uyari}`}>
              Saçı açık bir fotoğraf yüklersen, başörtüsü seçtiğin ürünün modelindeki şekilde bağlanır.
            </p>
            <ol className={stil.ipuclari}>
              <li>Yüzün net görünsün</li>
              <li>Karşıdan çek</li>
              <li>Omuzların kadrajda olsun</li>
            </ol>
            <p className={`vu-label vu-muted ${stil.gizlilik}`}>Fotoğrafın saklanmaz.</p>
          </div>
        )}

        {asama.tur === "bekle" && fotograf && <Bekleme fotograf={fotograf.src} urun={urun} />}

        {asama.tur === "sonuc" && fotograf && (
          <div className={stil.icerik}>
            <OnceSonra once={fotograf.src} sonra={asama.gorsel} />
            <div className={stil.eylemler}>
              <p className="vu-label vu-muted">
                {urun.markaAd} · {urun.ad}
              </p>
              <a
                className="vu-btn vu-btn--primary vu-btn--block"
                href={urun.urunUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                Ürüne git ↗
              </a>
              <p className={`vu-small vu-muted ${stil.not}`}>
                Satın alma {urun.markaIyelik} sitesinde yapılır.
              </p>
              <Link className="vu-btn vu-btn--secondary vu-btn--block" href="/ara" onClick={kapat}>
                Başka bir başörtüsü dene
              </Link>
              <a className={`vu-link ${stil.indir}`} href={asama.gorsel} download={indirmeAdi(asama.gorsel)}>
                Görseli indir
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function indirmeAdi(dataUrl: string): string {
  const uzanti = dataUrl.startsWith("data:image/jpeg") ? "jpg" : "png";
  return `vuala-deneme.${uzanti}`;
}

function Bekleme({ fotograf, urun }: { fotograf: string; urun: DenenecekUrun }) {
  const [sira, setSira] = useState(0);
  const [ilerleme, setIlerleme] = useState(4);

  useEffect(() => {
    const baslangic = Date.now();
    const zamanlayici = setInterval(() => {
      const saniye = (Date.now() - baslangic) / 1000;
      // Gerçek ilerleme bilinmiyor; çizgi hızla başlayıp %92'ye yavaşça yaklaşır.
      setIlerleme(4 + 88 * (1 - Math.exp(-saniye / 20)));
      setSira(Math.min(BEKLEME_MESAJLARI.length - 1, Math.floor(saniye / 7)));
    }, 1400);
    return () => clearInterval(zamanlayici);
  }, []);

  return (
    <div className={stil.bekle} aria-live="polite">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={stil.bekleArka} src={fotograf} alt="" />
      <div className={stil.bekleOrtu} />
      <div className={stil.bekleUrun}>
        <Foto src={urun.gorsel} ton={tonSec(urun.id)} oran="45" />
      </div>
      <div className={stil.bekleAlt}>
        <p className={stil.mesaj} key={sira}>
          {BEKLEME_MESAJLARI[sira]}
        </p>
        <div className={stil.cizgi}>
          <b style={{ width: `${ilerleme}%` }} />
        </div>
        <p className={`vu-small ${stil.sure}`}>Bu işlem 30–60 saniye sürebilir.</p>
      </div>
    </div>
  );
}
