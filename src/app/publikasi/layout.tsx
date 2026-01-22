import { generateSEOMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Publikasi & Karya Tulis",
  description:
    "Kumpulan publikasi, karya tulis, riset, dan artikel ilmiah dari Muhammad Iksan Kiat. Karya-karya yang berkaitan dengan kebijakan energi, pengembangan berkelanjutan, dan sektor energi Indonesia.",
  keywords: [
    "publikasi Muhammad Iksan Kiat",
    "karya tulis energi",
    "riset energi Indonesia",
    "artikel ilmiah ESDM",
    "publikasi kebijakan energi",
    "jurnal energi",
    "paper energi terbarukan",
  ],
  url: `${SITE_URL}/publikasi`,
  type: "website",
  section: "Publikasi",
});

export default function PublikasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

