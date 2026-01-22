import { Metadata } from "next";
import { SITE_URL } from "./config";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image = "/og-image.jpg",
  url = SITE_URL,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Muhammad Iksan Kiat",
  section,
  tags,
  noindex = false,
  nofollow = false,
}: SEOProps): Metadata {
  const defaultTitle = "Muhammad Iksan Kiat - Profile & Portfolio";
  const defaultDescription =
    "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil lengkap, biografi, pengalaman, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.";
  const defaultKeywords = [
    "Muhammad Iksan Kiat",
    "muhammad iksan kiat",
    "Muhammad Iksan",
    "Iksan Kiat",
    "muhammad iksan kiat esdm",
    "Muhammad Iksan Kiat Tenaga Ahli Menteri",
    "Tenaga Ahli Menteri ESDM",
    "Kementerian Energi dan Sumber Daya Mineral",
    "ESDM",
    "energi Indonesia",
    "kebijakan energi",
    "pengembangan berkelanjutan",
    "biografi Muhammad Iksan Kiat",
    "profile Muhammad Iksan Kiat",
    "muhammadiksankiat",
    "muhammadiksankiat.id",
    "portfolio",
    "profil",
    "biografi",
  ];

  const finalTitle = title ? `${title} | Muhammad Iksan Kiat` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const finalUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  // Combine keywords and tags if tags provided
  const allKeywords = tags
    ? [...finalKeywords, ...tags]
    : finalKeywords;

  const metadata: Metadata = {
    title: finalTitle,
    description: finalDescription,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: "Muhammad Iksan Kiat",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: finalUrl,
    },
    openGraph: {
      title: title || defaultTitle,
      description: finalDescription,
      url: finalUrl,
      siteName: "Muhammad Iksan Kiat",
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: title || "Muhammad Iksan Kiat",
        },
      ],
      locale: "id_ID",
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags && tags.length > 0 && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: title || defaultTitle,
      description: finalDescription,
      images: [finalImage],
      creator: "@muhammadiksankiat",
      site: "@muhammadiksankiat",
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: section,
  };

  return metadata;
}
