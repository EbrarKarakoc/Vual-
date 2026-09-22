import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminUrunlerPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Ürünler</h1>
        <Link href="/admin/urunler/ekle">
          <Button>+ Yeni Ürün</Button>
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <p className="text-sm text-black/60">Ürün listesi tabloları buraya gelecek.</p>
      </div>
    </div>
  );
}
