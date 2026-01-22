import { generateSEOMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Galeri Foto",
  description:
    "Galeri foto dan dokumentasi kegiatan Muhammad Iksan Kiat. Kumpulan foto dari berbagai acara, kegiatan, dan momen penting dalam perjalanan karier di Kementerian ESDM.",
  keywords: [
    "galeri foto Muhammad Iksan Kiat",
    "foto kegiatan ESDM",
    "dokumentasi kegiatan",
    "foto acara energi",
    "galeri aktivitas",
  ],
  url: `${SITE_URL}/galeri`,
  type: "website",
  section: "Galeri",
});

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

