import { SITE_URL } from "./config";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList structured data untuk SEO
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate breadcrumb untuk halaman tertentu
 */
export function getBreadcrumbsForPage(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Beranda", url: SITE_URL }];

  const pathMap: Record<string, string> = {
    "/biografi": "Biografi",
    "/publikasi": "Publikasi",
    "/berita": "Berita",
    "/galeri": "Galeri",
    "/rekam-jejak": "Rekam Jejak",
    "/testimoni": "Testimoni",
  };

  if (pathMap[pathname]) {
    breadcrumbs.push({
      name: pathMap[pathname],
      url: `${SITE_URL}${pathname}`,
    });
  }

  return breadcrumbs;
}
