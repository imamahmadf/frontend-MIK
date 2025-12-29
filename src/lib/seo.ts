import { Metadata } from "next";

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
  url = "https://yourwebsite.com",
}: SEOProps): Metadata {
  return {
    title: title ? `${title} | Profile` : "Profile - Nama Anda",
    description:
      description ||
      "Website profile profesional dengan Next.js - SEO friendly",
    keywords: keywords || ["profile", "portfolio", "developer"],
    openGraph: {
      title: title || "Profile - Nama Anda",
      description:
        description ||
        "Website profile profesional dengan Next.js - SEO friendly",
      url,
      siteName: "Profile",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || "Profile",
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || "Profile - Nama Anda",
      description:
        description ||
        "Website profile profesional dengan Next.js - SEO friendly",
      images: [image],
    },
  };
}
