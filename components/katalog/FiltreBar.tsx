"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RenkFiltre } from "./RenkFiltre";
import { KumasFiltre } from "./KumasFiltre";
import { FiyatFiltre } from "./FiyatFiltre";
import { useFiltre } from "@/hooks/useFiltre";

export function FiltreBar() {
  const [open, setOpen] = useState(false);
  const { temizle } = useFiltre();

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="w-4 h-4" /> Filtrele
      </Button>
      <Sheet open={open} onOpenChange={setOpen} side="right">
        <h2 className="font-serif text-2xl mb-6">Filtrele</h2>
        <div className="space-y-8">
          <RenkFiltre />
          <KumasFiltre />
          <FiyatFiltre />
        </div>
        <div className="mt-8 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => { temizle(); }}>
            Temizle
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Uygula
          </Button>
        </div>
      </Sheet>
    </>
  );
}
