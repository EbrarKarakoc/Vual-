"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function DeneButonu({
  productId,
  hasTemplate,
  ...props
}: { productId: string; hasTemplate?: boolean } & ButtonProps) {
  const router = useRouter();

  function tikla() {
    if (!hasTemplate) {
      router.push("/profil/sablon-sec");
      return;
    }
    router.push(`/dene?productId=${productId}`);
  }

  return (
    <Button onClick={tikla} {...props}>
      <Sparkles className="w-4 h-4" /> Dene
    </Button>
  );
}
