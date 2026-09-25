import Link from "next/link";
import { UstCubuk } from "@/components/UstCubuk";

export default function Bulunamadi() {
  return (
    <>
      <UstCubuk />
      <main style={{ padding: "96px var(--gutter)", maxWidth: 720 }}>
        <p className="vu-label vu-muted">404</p>
        <h1 className="vu-display vu-xl" style={{ margin: "12px 0 32px" }}>
          Bu sayfa yok.
        </h1>
        <Link className="vu-btn vu-btn--primary" href="/">
          Ana sayfaya dön
        </Link>
      </main>
    </>
  );
}
