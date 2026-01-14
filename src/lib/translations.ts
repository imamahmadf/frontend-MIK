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
    adminPengalaman: string;
  };
  footer: {
    rightsReserved: string;
  };
  berita: {
    title: string;
    description: string;
    badge: string;
    subtitle: string;
    available: string;
    error: string;
    empty: string;
    emptyDescription: string;
    readMore: string;
    loading: string;
  };
  latestNews: {
    badge: string;
    title: string;
    description: string;
    readMore: string;
    viewAll: string;
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
      adminPengalaman: "Admin Pengalaman",
    },
    footer: {
      rightsReserved: "Hak cipta dilindungi.",
    },
    berita: {
      title: "Berita",
      description:
        "Perbarui audiens dengan berita, kegiatan, atau pengumuman terbaru.",
      badge: "Informasi Terkini",
      subtitle:
        "Perbarui audiens dengan berita, kegiatan, atau pengumuman terbaru.",
      available: "Berita Tersedia",
      error: "Gagal memuat data berita",
      empty: "Belum Ada Berita",
      emptyDescription: "Belum ada berita yang tersedia saat ini.",
      readMore: "Baca Selengkapnya",
      loading: "Memuat data...",
    },
    latestNews: {
      badge: "Informasi Terkini",
      title: "Berita Terbaru",
      description:
        "Dapatkan informasi terbaru tentang kegiatan dan pengumuman terkini.",
      readMore: "Baca Selengkapnya",
      viewAll: "Lihat Semua Berita",
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
      adminPengalaman: "Admin Experience",
    },
    footer: {
      rightsReserved: "All rights reserved.",
    },
    berita: {
      title: "News",
      description:
        "Keep your audience updated with the latest news, events, or announcements.",
      badge: "Latest Information",
      subtitle:
        "Keep your audience updated with the latest news, events, or announcements.",
      available: "News Available",
      error: "Failed to load news data",
      empty: "No News Available",
      emptyDescription: "There are no news available at the moment.",
      readMore: "Read More",
      loading: "Loading data...",
    },
    latestNews: {
      badge: "Latest Information",
      title: "Latest News",
      description:
        "Get the latest information about activities and current announcements.",
      readMore: "Read More",
      viewAll: "View All News",
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
      adminPengalaman: "Админ Опыта",
    },
    footer: {
      rightsReserved: "Все права защищены.",
    },
    berita: {
      title: "Новости",
      description:
        "Обновляйте аудиторию последними новостями, событиями или объявлениями.",
      badge: "Актуальная Информация",
      subtitle:
        "Обновляйте аудиторию последними новостями, событиями или объявлениями.",
      available: "Новостей Доступно",
      error: "Не удалось загрузить данные новостей",
      empty: "Новостей Нет",
      emptyDescription: "В данный момент новостей нет.",
      readMore: "Читать Далее",
      loading: "Загрузка данных...",
    },
    latestNews: {
      badge: "Актуальная Информация",
      title: "Последние Новости",
      description:
        "Получайте последнюю информацию о мероприятиях и текущих объявлениях.",
      readMore: "Читать Далее",
      viewAll: "Посмотреть Все Новости",
    },
  },
};

/**
 * Mendapatkan terjemahan berdasarkan bahasa
 */
export function getTranslations(lang: LanguageCode): Translations {
  return translations[lang] || translations.id;
}
