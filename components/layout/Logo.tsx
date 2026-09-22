import Link from "next/link";

type LogoProps = {
  size?: number;
  color?: string;
  href?: string | null;
};

export function Logo({ size = 22, color, href = "/" }: LogoProps) {
  const inner = (
    <div className="flex items-center gap-2.5" style={{ color: color || "inherit" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        style={{ flex: "none" }}
        aria-hidden="true"
      >
        <path
          d="M6 22 C 6 12, 12 6, 16 6 C 20 6, 26 12, 26 22"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M9 22 C 10 18, 13 14, 16 14 C 19 14, 22 18, 23 22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        <line
          x1="6"
          y1="25"
          x2="26"
          y2="25"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </svg>
      <div
        className="font-serif leading-none"
        style={{
          fontSize: size * 0.82,
          letterSpacing: "-0.01em",
          fontWeight: 400,
        }}
      >
        başörtü
        <span className="italic opacity-60"> studio</span>
      </div>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="Ana sayfa">
      {inner}
    </Link>
  );
}
