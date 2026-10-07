import type { Metadata, Viewport } from "next";
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

const defaultTitle = `${site.name} — Property, facility, relocation and real estate in New Cairo`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: defaultTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  category: "real estate",
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Social images come from app/opengraph-image.jpg and app/twitter-image.jpg (file conventions).
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_EG",
    url: "/",
    title: defaultTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
  },
  // Icons come from app/icon.jpeg and app/apple-icon.png (file conventions).
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F325A",
  colorScheme: "dark",
};

/** Structured data: the company as a local professional-services business. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: `${site.name} Services`,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/logo/setabase-stacked.png`,
  image: `${site.url}/opengraph-image.jpg`,
  description: site.description,
  email: site.email, // TODO(contact): placeholder
  telephone: site.phone, // TODO(contact): placeholder
  address: {
    "@type": "PostalAddress",
    streetAddress: "Building 6, Floor 3, Unit 9, EDNC",
    addressLocality: "New Cairo",
    addressRegion: "Cairo Governorate",
    addressCountry: "EG",
  },
  areaServed: { "@type": "Country", name: "Egypt" },
  knowsAbout: [
    "Property management",
    "Facility management",
    "Relocation services",
    "Real estate",
    "Workplace services",
  ],
  availableLanguage: ["en", "ar"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // TODO(arabic): switch `lang`/`dir` per locale once the Arabic version exists.
    // Components use logical properties (ps-/pe-/start/end) so RTL needs no layout rewrite.
    <html
      lang="en"
      dir="ltr"
      // Tells Next.js the page scrolls smoothly, so it can jump instantly on navigation
      // instead of gliding from the previous page's position.
      data-scroll-behavior="smooth"
      className={`${ibmPlexSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <script
          type="application/ld+json"
          // Static, server-rendered JSON built from our own content — no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
