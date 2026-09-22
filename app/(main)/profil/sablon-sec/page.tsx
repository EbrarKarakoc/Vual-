"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FotografRehber } from "@/components/tryon/FotografRehber";
import { FotografYukle } from "@/components/tryon/FotografYukle";
import { SablonSecici } from "@/components/tryon/SablonSecici";
import { Button } from "@/components/ui/button";
import { SABLON_TIPLERI } from "@/lib/sabitler";

type Adim = "rehber" | "yukle" | "secim";

export default function SablonSecPage() {
  const router = useRouter();
  const [adim, setAdim] = useState<Adim>("rehber");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [secili, setSecili] = useState<string[]>([]);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // Fotoğraf yüklenmeden önce bile kullanıcının 5 beyaz şablon opsiyonunu görebilmesi için demo:
  const demoSablonlari = SABLON_TIPLERI.map((t, i) => ({
    id: t.id,
    templateType: t.id,
    imageUrl: `https://picsum.photos/seed/tpl${i}/400/500`,
  }));

  function toggleSec(id: string) {
    setSecili((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  async function kaydet() {
    if (secili.length === 0) {
      toast.error("En az 1 şablon seç.");
      return;
    }
    setKaydediliyor(true);
    // Gerçek entegrasyon: /api/sablonlar POST
    await new Promise((r) => setTimeout(r, 600));
    setKaydediliyor(false);
    toast.success("Şablonların kaydedildi!");
    router.push("/katalog");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="font-serif text-3xl">Şablon Seçimi</h1>

      {adim === "rehber" && (
        <FotografRehber onDevam={() => setAdim("yukle")} />
      )}

      {adim === "yukle" && (
        <FotografYukle
          onYuklendi={(url) => {
            setFotoUrl(url);
            setAdim("secim");
          }}
        />
      )}

      {adim === "secim" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="font-serif text-xl mb-2">Tarzına uyan 2 şablonu seç</h2>
            <p className="text-sm text-black/60 mb-4">
              Seçtiğin stiller üzerinden denemeler yapılacak.
            </p>
            <SablonSecici
              templates={demoSablonlari}
              selected={secili}
              onSelect={toggleSec}
            />
          </div>
          <Button size="lg" className="w-full" onClick={kaydet} disabled={kaydediliyor}>
            {kaydediliyor ? "Kaydediliyor…" : "Seçimimi Kaydet"}
          </Button>
        </div>
      )}
    </div>
  );
}
