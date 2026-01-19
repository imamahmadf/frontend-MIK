import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import PageTransition from "@/components/layout/PageTransition";
import NavigationProgress from "@/components/layout/NavigationProgress";
import { SITE_URL } from "@/lib/config";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muhammad Iksan Kiat - Profile & Portfolio",
    template: "%s | Muhammad Iksan Kiat",
  },
  description:
    "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil, biografi, pengalaman, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.",
  keywords: [
    "Muhammad Iksan Kiat",
    "muhammad iksan kiat",
    "Iksan Kiat",
    "Tenaga Ahli Menteri ESDM",
    "Kementerian Energi dan Sumber Daya Mineral",
    "ESDM",
    "energi Indonesia",
    "kebijakan energi",
    "pengembangan berkelanjutan",
    "profile",
    "biografi",
    "portfolio",
  ],
  authors: [{ name: "Muhammad Iksan Kiat" }],
  creator: "Muhammad Iksan Kiat",
  publisher: "Muhammad Iksan Kiat",
  openGraph: {
    type: "profile",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Muhammad Iksan Kiat",
    title: "Muhammad Iksan Kiat - Profile & Portfolio",
    description:
      "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil, biografi, pengalaman, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammad Iksan Kiat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Iksan Kiat - Profile & Portfolio",
    description:
      "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={SITE_URL} />
        {/* Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Iksan Kiat",
              alternateName: "Iksan Kiat",
              jobTitle: "Tenaga Ahli Menteri",
              worksFor: {
                "@type": "Organization",
                name: "Kementerian Energi dan Sumber Daya Mineral",
                alternateName: "ESDM",
              },
              url: SITE_URL,
              sameAs: [],
              description:
                "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Fokus pada kebijakan energi dan pengembangan berkelanjutan Indonesia.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jakarta",
                addressCountry: "ID",
              },
              knowsAbout: [
                "Kebijakan Energi",
                "Energi Terbarukan",
                "Pengembangan Berkelanjutan",
                "Kerja Sama Internasional",
              ],
            }),
          }}
        />
        {/* Website Schema untuk Sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Muhammad Iksan Kiat",
              url: SITE_URL,
              description:
                "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil lengkap, biografi, pengalaman, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.",
              publisher: {
                "@type": "Person",
                name: "Muhammad Iksan Kiat",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/berita?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Beranda",
                    url: SITE_URL,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Biografi",
                    url: `${SITE_URL}/biografi`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Publikasi",
                    url: `${SITE_URL}/publikasi`,
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: "Berita",
                    url: `${SITE_URL}/berita`,
                  },
                  {
                    "@type": "ListItem",
                    position: 5,
                    name: "Galeri",
                    url: `${SITE_URL}/galeri`,
                  },
                  {
                    "@type": "ListItem",
                    position: 6,
                    name: "Rekam Jejak",
                    url: `${SITE_URL}/rekam-jejak`,
                  },
                  {
                    "@type": "ListItem",
                    position: 7,
                    name: "Testimoni",
                    url: `${SITE_URL}/testimoni`,
                  },
                ],
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans`}>
        <ThemeProvider>
          <ReduxProvider>
            <AuthInitializer>
              <NavigationProgress />
              <PageTransition>
                <div className="relative z-10">
                  <Header />
                  <main className="min-h-screen relative z-10">{children}</main>
                  <Footer />
                </div>
              </PageTransition>
            </AuthInitializer>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
