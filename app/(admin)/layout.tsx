import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/giris");

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="bg-white border-r border-black/5 p-4 space-y-6">
        <Logo />
        <nav className="space-y-1 text-sm">
          <Link href="/admin/urunler" className="block px-3 py-2 rounded-xl hover:bg-black/5">
            Ürünler
          </Link>
          <Link href="/admin/urunler/ekle" className="block px-3 py-2 rounded-xl hover:bg-black/5">
            Ürün Ekle
          </Link>
        </nav>
      </aside>
      <main className="p-6 bg-cream">{children}</main>
    </div>
  );
}
