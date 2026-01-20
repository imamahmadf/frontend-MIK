/**
 * Konfigurasi Website
 *
 * INSTRUKSI:
 * 1. Pilih salah satu domain berikut sesuai dengan domain yang akan digunakan saat deploy
 * 2. Uncomment (hapus //) pada domain yang akan digunakan
 * 3. Comment (tambahkan //) pada domain yang tidak digunakan
 *
 * Contoh:
 * - Jika menggunakan .com: export const SITE_URL = "https://www.muhammadiksankiat.com";
 * - Jika menggunakan .id: export const SITE_URL = "https://www.muhammadiksankiat.id";
 */

// Pilih salah satu domain berikut:
// export const SITE_URL = "https://www.muhammadiksankiat.com";
// Atau gunakan domain .id:
export const SITE_URL = "https://muhammadiksankiat.id";

export const SITE_NAME = "Muhammad Iksan Kiat";
export const SITE_DESCRIPTION =
  "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil lengkap, biografi, pengalaman, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.";

// Untuk development, gunakan environment variable jika tersedia
export const getSiteUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: gunakan current origin
    return window.location.origin;
  }
  // Server-side: gunakan environment variable atau fallback ke config
  return process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
};
