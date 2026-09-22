"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const IYI = [
  "Yüzünüz net ve merkezde olsun",
  "Düz bakın, kamera göz hizasında olsun",
  "Omuz hizanıza kadar görünsün",
  "İyi aydınlatılmış bir yerde çekin",
  "Nötr veya sade bir arka plan tercih edin",
];
const KOTU = [
  "Yan profil veya eğik kadraj",
  "Aşırı filtre / makyaj",
  "Karanlık veya bulanık fotoğraf",
  "Başka aksesuar (şapka, saç bandı)",
];

export function FotografRehber({ onDevam }: { onDevam: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8">
      <h2 className="font-serif text-2xl mb-2">Fotoğraf Rehberi</h2>
      <p className="text-sm text-black/60 mb-6">
        En iyi sonucu almak için aşağıdaki ipuçlarına dikkat et.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-emerald-700 mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" /> İyi Örnekler
          </h3>
          <ul className="space-y-2">
            {IYI.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-red-600 mb-3 flex items-center gap-2">
            <X className="w-4 h-4" /> Kaçınılması Gerekenler
          </h3>
          <ul className="space-y-2">
            {KOTU.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button className="w-full mt-8" size="lg" onClick={onDevam}>
        Fotoğrafımı Yükle
      </Button>
    </div>
  );
}
