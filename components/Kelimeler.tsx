import { Fragment } from "react";

type Props = {
  as?: "h1" | "h2" | "p";
  className?: string;
  children: string;
};

/** Başlığı kelime kelime (90 ms arayla) ortaya çıkan span'lere böler. */
export function Kelimeler({ as: Etiket = "h2", className = "", children }: Props) {
  const kelimeler = children.trim().split(/\s+/);
  return (
    <Etiket className={`vu-words ${className}`} aria-label={children}>
      {kelimeler.map((k, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span aria-hidden style={{ transitionDelay: `${i * 90}ms` }}>
            {k}
          </span>
        </Fragment>
      ))}
    </Etiket>
  );
}
