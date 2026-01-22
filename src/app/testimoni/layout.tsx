import { generateSEOMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Testimoni",
  description:
    "Testimoni dan kesan dari berbagai pihak tentang Muhammad Iksan Kiat. Pendapat, apresiasi, dan pengalaman bekerja sama dalam berbagai kegiatan dan proyek.",
  keywords: [
    "testimoni Muhammad Iksan Kiat",
    "kesan dan pesan",
    "apresiasi",
    "review",
    "pendapat tentang Muhammad Iksan Kiat",
  ],
  url: `${SITE_URL}/testimoni`,
  type: "website",
  section: "Testimoni",
});

export default function TestimoniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

