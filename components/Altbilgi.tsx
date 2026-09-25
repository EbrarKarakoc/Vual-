import Link from "next/link";
import stil from "./Altbilgi.module.css";

export function Altbilgi() {
  return (
    <footer className={`vu-deep ${stil.altbilgi}`}>
      <span className="vu-logo">Vualà</span>
      <p>Fotoğrafın saklanmaz. Sadece deneme sırasında işlenir ve silinir.</p>
      <nav>
        <Link className="vu-link" href="/gizlilik">
          Gizlilik
        </Link>
        <Link className="vu-link" href="/gizlilik#kvkk">
          KVKK
        </Link>
      </nav>
    </footer>
  );
}
