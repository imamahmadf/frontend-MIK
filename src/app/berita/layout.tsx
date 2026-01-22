import { generateSEOMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Berita & Artikel",
  description:
    "Kumpulan berita, artikel, dan update terbaru dari Muhammad Iksan Kiat. Informasi terkini seputar kebijakan energi, pengembangan berkelanjutan, dan aktivitas di Kementerian ESDM.",
  keywords: [
    "berita Muhammad Iksan Kiat",
    "artikel energi Indonesia",
    "kebijakan energi terbaru",
    "berita ESDM",
    "update Kementerian ESDM",
    "artikel pengembangan berkelanjutan",
    "berita energi terbarukan",
    "update kebijakan energi",
  ],
  url: `${SITE_URL}/berita`,
  type: "website",
  section: "Berita",
});

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

