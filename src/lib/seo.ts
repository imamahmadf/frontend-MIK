import { Metadata } from "next";
import { SITE_URL } from "./config";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image = "/og-image.jpg",
  url = SITE_URL,
}: SEOProps): Metadata {
  const defaultTitle = "Muhammad Iksan Kiat - Profile & Portfolio";
  const defaultDescription =
    "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil lengkap, biografi, pengalaman, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.";
  const defaultKeywords = [
    "Muhammad Iksan Kiat",
    "muhammad iksan kiat",
    "Iksan Kiat",
    "Tenaga Ahli Menteri ESDM",
    "Kementerian Energi dan Sumber Daya Mineral",
    "ESDM",
    "energi Indonesia",
    "kebijakan energi",
    "pengembangan berkelanjutan",
  ];

  return {
    title: title ? `${title} | Muhammad Iksan Kiat` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    openGraph: {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url,
      siteName: "Muhammad Iksan Kiat",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || "Muhammad Iksan Kiat",
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || defaultTitle,
      description: description || defaultDescription,
      images: [image],
    },
  };
}
