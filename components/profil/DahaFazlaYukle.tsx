"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function DahaFazlaYukle({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      Daha Fazla Göster <ChevronDown className="w-4 h-4" />
    </Button>
  );
}
