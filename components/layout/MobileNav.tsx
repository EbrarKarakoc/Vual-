"use client";

import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const LINKLER = [
  { href: "/katalog", ad: "Katalog" },
  { href: "/bana-ozel", ad: "Bana Özel" },
  { href: "/favorilerim", ad: "Favorilerim" },
  { href: "/profil", ad: "Profilim" },
];

export function MobileNav({
  open,
  onOpenChange,
  onCikis,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCikis: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <div className="pt-6">
        <div className="flex items-center gap-3 pb-6 border-b border-black/5">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="font-medium">Hoş geldin</p>
            <p className="text-xs text-black/50">Menüyü keşfet</p>
          </div>
        </div>
        <ul className="py-4 space-y-1">
          {LINKLER.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => onOpenChange(false)}
                className="block px-3 py-3 rounded-xl hover:bg-black/5 text-ink"
              >
                {l.ad}
              </Link>
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-black/5">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onCikis();
              onOpenChange(false);
            }}
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
