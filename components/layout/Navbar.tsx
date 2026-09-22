"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Icon } from "@/components/studio/Icon";
import { useStudio } from "@/components/studio/StudioProvider";

const NAV_ITEMS = [
  { href: "/dene", label: "Fotoğraf", icon: "image" as const, match: "/dene" },
  { href: "/katalog", label: "Katalog", icon: "grid" as const, match: "/katalog" },
  { href: "/try-on", label: "Deneme", icon: "sparkles" as const, match: "/try-on" },
  { href: "/favorilerim", label: "Favoriler", icon: "heart" as const, match: "/favorilerim" },
  { href: "/profil", label: "Profil", icon: "user" as const, match: "/profil" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, selected } = useStudio();

  const goTryOn = () => router.push("/try-on");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(245,239,228,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(20px, 4vw, 48px)",
          gap: 20,
        }}
      >
        <Logo size={20} />

        <nav className="app-nav-items flex gap-1">
          {NAV_ITEMS.map((it) => {
            const active = pathname.startsWith(it.match);
            return (
              <Link
                key={it.href}
                href={it.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--cream)" : "var(--ink-soft)",
                  background: active ? "var(--ink)" : "transparent",
                  borderRadius: "var(--radius-pill)",
                  transition: "all 180ms var(--ease-out)",
                }}
              >
                <Icon name={it.icon} size={14} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {selected.length > 0 && !pathname.startsWith("/try-on") && (
            <button
              className="app-btn app-btn-wine"
              style={{ padding: "10px 18px", fontSize: 13 }}
              onClick={goTryOn}
            >
              <Icon name="sparkles" size={14} /> {selected.length} ürünü dene
            </button>
          )}
          <Link
            href="/profil"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--green)",
              color: "var(--cream)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-serif)",
              fontSize: 15,
            }}
          >
            {(user?.name || "M")[0].toUpperCase()}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .app-nav-items { display: none !important; }
        }
      `}</style>
    </header>
  );
}
