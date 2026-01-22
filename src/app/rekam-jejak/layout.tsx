import { generateSEOMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Rekam Jejak",
  description:
    "Rekam jejak dan timeline perjalanan karier Muhammad Iksan Kiat. Perjalanan profesional, pencapaian, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.",
  keywords: [
    "rekam jejak Muhammad Iksan Kiat",
    "timeline karier",
    "perjalanan profesional",
    "pencapaian ESDM",
    "kontribusi energi Indonesia",
    "timeline aktivitas",
  ],
  url: `${SITE_URL}/rekam-jejak`,
  type: "website",
  section: "Rekam Jejak",
});

export default function RekamJejakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

