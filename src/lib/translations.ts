/**
 * Translation data untuk UI components (Header, Footer, dll)
 */

import { LanguageCode } from "./language";

export interface Translations {
  nav: {
    home: string;
    biography: string;
    publication: string;
    news: string;
    gallery: string;
    timeline: string;
    testimoni: string;
  };
  auth: {
    login: string;
    logout: string;
    adminNews: string;
    adminGallery: string;
    adminTimeline: string;
    adminHero: string;
    adminTestimoni: string;
    adminBiografi: string;
    adminPublikasi: string;
    adminPesan: string;
  };
  footer: {
    rightsReserved: string;
  };
}

const translations: Record<LanguageCode, Translations> = {
  id: {
    nav: {
      home: "Beranda",
      biography: "Biografi",
      publication: "Publikasi",
      news: "Berita",
      gallery: "Galeri",
      timeline: "Rekam Jejak",
      testimoni: "Testimoni",
    },
    auth: {
      login: "Masuk",
      logout: "Keluar",
      adminNews: "Admin Berita",
      adminGallery: "Admin Galeri",
      adminTimeline: "Admin Rekam Jejak",
      adminHero: "Admin Hero",
      adminTestimoni: "Admin Testimoni",
      adminBiografi: "Admin Biografi",
      adminPublikasi: "Admin Publikasi",
      adminPesan: "Admin Pesan",
    },
    footer: {
      rightsReserved: "Hak cipta dilindungi.",
    },
  },
  en: {
    nav: {
      home: "Home",
      biography: "Biography",
      publication: "Publication",
      news: "News",
      gallery: "Gallery",
      timeline: "Timeline",
      testimoni: "Testimonials",
    },
    auth: {
      login: "Login",
      logout: "Logout",
      adminNews: "Admin News",
      adminGallery: "Admin Gallery",
      adminTimeline: "Admin Timeline",
      adminHero: "Admin Hero",
      adminTestimoni: "Admin Testimonials",
      adminBiografi: "Admin Biography",
      adminPublikasi: "Admin Publication",
      adminPesan: "Admin Messages",
    },
    footer: {
      rightsReserved: "All rights reserved.",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      biography: "Биография",
      publication: "Публикации",
      news: "Новости",
      gallery: "Галерея",
      timeline: "Хронология",
      testimoni: "Отзывы",
    },
    auth: {
      login: "Войти",
      logout: "Выйти",
      adminNews: "Админ Новостей",
      adminGallery: "Админ Галереи",
      adminTimeline: "Админ Хронологии",
      adminHero: "Админ Героя",
      adminTestimoni: "Админ Отзывов",
      adminBiografi: "Админ Биографии",
      adminPublikasi: "Админ Публикаций",
      adminPesan: "Админ Сообщений",
    },
    footer: {
      rightsReserved: "Все права защищены.",
    },
  },
};

/**
 * Mendapatkan terjemahan berdasarkan bahasa
 */
export function getTranslations(lang: LanguageCode): Translations {
  return translations[lang] || translations.id;
}
