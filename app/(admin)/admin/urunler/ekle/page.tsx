"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UrunEklePage() {
  const [form, setForm] = useState({
    name: "",
    colorHex: "#2D6A4F",
    colorName: "",
    fabricType: "sifon",
    style: "klasik",
    price: "",
    affiliateUrl: "",
    brand: "",
  });

  function degistir<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function gonder(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Ürün kaydedildi (demo).");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl mb-6">Yeni Ürün Ekle</h1>
      <form onSubmit={gonder} className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Ürün Adı</label>
          <Input value={form.name} onChange={(e) => degistir("name", e.target.value)} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Renk Adı</label>
            <Input value={form.colorName} onChange={(e) => degistir("colorName", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Renk (hex)</label>
            <Input value={form.colorHex} onChange={(e) => degistir("colorHex", e.target.value)} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Kumaş</label>
            <Input value={form.fabricType} onChange={(e) => degistir("fabricType", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Stil</label>
            <Input value={form.style} onChange={(e) => degistir("style", e.target.value)} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Fiyat (TL)</label>
            <Input type="number" value={form.price} onChange={(e) => degistir("price", e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Marka</label>
            <Input value={form.brand} onChange={(e) => degistir("brand", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Affiliate URL</label>
          <Input value={form.affiliateUrl} onChange={(e) => degistir("affiliateUrl", e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Kaydet</Button>
      </form>
    </div>
  );
}
