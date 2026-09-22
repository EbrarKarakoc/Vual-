"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/studio/Icon";
import { useStudio } from "@/components/studio/StudioProvider";

export default function ProfilPage() {
  const router = useRouter();
  const { user, favorites, selected, photo, setPhoto, signOut } = useStudio();

  const displayUser = user ?? { name: "Misafir", email: "misafir@ornek.com" };

  const stats = [
    { n: favorites.length, l: "Favori" },
    { n: selected.length, l: "Seçili deneme" },
    { n: photo ? 1 : 0, l: "Yüklü fotoğraf" },
  ];

  const rows: {
    t: string;
    d: string;
    action?: () => void;
    warn?: boolean;
  }[] = [
    { t: "Hesap bilgileri", d: "İsim, e-posta, şifre" },
    { t: "Bildirimler", d: "Yeni ürün ve indirim bildirimleri" },
    { t: "Gizlilik", d: "Fotoğraf ve veri kullanımı" },
    {
      t: "Yüklü fotoğrafı sil",
      d: "Deneme fotoğrafını tamamen kaldır",
      action: photo ? () => setPhoto(null) : undefined,
      warn: true,
    },
    {
      t: "Çıkış yap",
      d: "Bu cihazdan oturumu kapat",
      action: () => {
        signOut();
        router.push("/");
      },
      warn: true,
    },
  ];

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "clamp(36px, 5vh, 56px) clamp(20px, 4vw, 48px) 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "var(--green)",
            color: "var(--cream)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-serif)",
            fontSize: 42,
          }}
        >
          {(displayUser.name || "E")[0].toUpperCase()}
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            MERHABA
          </div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 300 }}>
            {displayUser.name || "Ebrar"}
          </h1>
          <div style={{ color: "var(--ink-soft)", marginTop: 6 }}>{displayUser.email}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.l}
            style={{
              padding: 24,
              background: "var(--bg-soft)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 44,
                lineHeight: 1,
              }}
            >
              {s.n}
            </div>
            <div className="eyebrow" style={{ marginTop: 10 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 24,
          background: "var(--bg-soft)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          AYARLAR
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rows.map((row) => (
            <button
              key={row.t}
              onClick={row.action}
              disabled={!row.action}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 4px",
                borderBottom: "1px dashed var(--line)",
                textAlign: "left",
                color: row.warn ? "var(--wine)" : "var(--ink)",
                cursor: row.action ? "pointer" : "default",
                opacity: row.action === undefined ? 0.4 : 1,
                background: "none",
                border: "none",
                borderBottomStyle: "dashed",
                borderBottomWidth: 1,
                borderBottomColor: "var(--line)",
                width: "100%",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{row.t}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{row.d}</div>
              </div>
              <Icon name="arrow-right" size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
