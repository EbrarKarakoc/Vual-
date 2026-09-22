import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-serif text-emerald-700 mb-2">404</h1>
      <p className="text-lg text-black/70 mb-6">Aradığın sayfa bulunamadı.</p>
      <Link href="/">
        <Button>Ana Sayfaya Dön</Button>
      </Link>
    </div>
  );
}
