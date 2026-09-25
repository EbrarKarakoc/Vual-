import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Hareket } from "@/components/Hareket";
import { DenemeBaglami } from "@/components/deneme/DenemeBaglami";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const sans = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

const ACIKLAMA = "Yapay zekâ ile kendi fotoğrafında dene, beğenirsen markasından al.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Vualà — Başörtünü dijitalde dene",
    template: "%s · Vualà",
  },
  description: ACIKLAMA,
  openGraph: {
    title: "Vualà",
    description: ACIKLAMA,
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#440814",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <DenemeBaglami>{children}</DenemeBaglami>
        <Hareket />
      </body>
    </html>
  );
}
