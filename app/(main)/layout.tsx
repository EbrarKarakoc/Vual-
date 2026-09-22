import { Navbar } from "@/components/layout/Navbar";

// Not: Prototip entegrasyonu sırasında Supabase kontrolü devre dışı.
// Gerçek auth'a geçince server redirect'i tekrar eklenmeli.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer
        style={{
          padding: "16px clamp(20px, 4vw, 56px)",
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          background: "var(--bg)",
        }}
      >
        <span>© 2026 başörtü studio</span>
        <span>v0.1 · İstanbul</span>
      </footer>
    </div>
  );
}
