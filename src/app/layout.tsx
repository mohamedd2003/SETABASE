import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  // Variable font so the optical-size axis is available; weights 400–600 are used in CSS.
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Property, facility, relocation and real estate in New Cairo`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_EG",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // TODO(arabic): switch `lang`/`dir` per locale once the Arabic version exists.
    // Components use logical properties (ps-/pe-/start/end) so RTL needs no layout rewrite.
    <html
      lang="en"
      dir="ltr"
      className={`${ibmPlexSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
