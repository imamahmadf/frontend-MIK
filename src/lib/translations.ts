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
    adminTentang: string;
    adminFaktaUnik: string;
    adminLogo: string;
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
  latestTestimoni: {
    badge: string;
    title: string;
    description: string;
    readMore: string;
    viewAll: string;
  };
  galeri: {
    badge: string;
    title: string;
    description: string;
    viewAll: string;
    closeModal: string;
    empty: string;
    emptyDescription: string;
    noDescription: string;
    previousPhoto: string;
    nextPhoto: string;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    email: string;
    phone: string;
    name: string;
    nameRequired: string;
    emailRequired: string;
    contactOptional: string;
    contactPlaceholder: string;
    subjectOptional: string;
    subjectPlaceholder: string;
    message: string;
    messageRequired: string;
    sendButton: string;
    sending: string;
    validationError: string;
    sendError: string;
    successMessage: string;
  };
  about: {
    title: string;
    information: string;
    location: string;
    email: string;
    focus: string;
    loading: string;
    error: string;
  };
  faktaUnik: {
    title: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
  };
  experience: {
    title: string;
    loading: string;
    error: string;
    empty: string;
  };
  rekamJejak: {
    title: string;
    description: string;
    loading: string;
    error: string;
    empty: string;
    footerMessage: string;
  };
  logo: {
    title: string;
    description: string;
  };
  search: {
    placeholder: string;
    noResults: string;
    loading: string;
    error: string;
    minChars: string;
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
      adminTentang: "Admin Tentang",
      adminFaktaUnik: "Admin Fakta Unik",
      adminLogo: "Admin Logo",
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
    latestTestimoni: {
      badge: "Kata Mereka",
      title: "Testimoni Terbaru",
      description: "Dengarkan apa kata mereka tentang pengalaman mereka.",
      readMore: "Baca Selengkapnya",
      viewAll: "Lihat Semua Testimoni",
    },
    galeri: {
      badge: "Dokumentasi",
      title: "Galeri Foto",
      description:
        "Kumpulan dokumentasi foto yang merekam aktivitas dan pencapaian.",
      viewAll: "Lihat Semua Foto",
      closeModal: "Tutup modal",
      empty: "Belum ada foto di galeri",
      emptyDescription: "Belum ada foto yang tersedia saat ini.",
      noDescription: "Tidak ada deskripsi",
      previousPhoto: "Foto sebelumnya",
      nextPhoto: "Foto berikutnya",
    },
    contact: {
      title: "Kontak",
      subtitle: "Mari Berkolaborasi",
      description:
        "Saya selalu terbuka untuk diskusi tentang proyek baru, peluang kerja, atau sekadar berkenalan. Jangan ragu untuk menghubungi saya!",
      email: "email@example.com",
      phone: "+62 812-3456-7890",
      name: "Nama",
      nameRequired: "Nama *",
      emailRequired: "Email *",
      contactOptional: "Kontak (Opsional)",
      contactPlaceholder: "Nomor telepon atau WhatsApp",
      subjectOptional: "Judul (Opsional)",
      subjectPlaceholder: "Subjek pesan Anda",
      message: "Pesan",
      messageRequired: "Pesan *",
      sendButton: "Kirim Pesan",
      sending: "Mengirim...",
      validationError: "Nama, email, dan pesan wajib diisi",
      sendError: "Gagal mengirim pesan. Silakan coba lagi.",
      successMessage:
        "Terima kasih! Pesan Anda telah dikirim. Kami akan segera merespons.",
    },
    about: {
      title: "Tentang Saya",
      information: "Informasi",
      location: "Lokasi",
      email: "Email",
      focus: "Fokus",
      loading: "Memuat data...",
      error: "Gagal memuat data tentang",
    },
    faktaUnik: {
      title: "Fakta Unik",
      item1: "Tahun Pengalaman",
      item2: "Proyek Selesai",
      item3: "Klien Puas",
      item4: "Tingkat Kepuasan",
    },
    experience: {
      title: "Pengalaman",
      loading: "Memuat data...",
      error: "Gagal memuat data pengalaman",
      empty: "Belum ada pengalaman yang tersedia",
    },
    rekamJejak: {
      title: "Potongan Perjalanan yang Membentuk Arah",
      description:
        "Setiap poin ini adalah bagian dari perjalanan yang membentuk visi dan dedikasi untuk energi dan Indonesia.",
      loading: "Memuat data...",
      error: "Gagal memuat data rekam jejak",
      empty: "Belum ada rekam jejak yang tersedia",
      footerMessage:
        "Perjalanan ini belum selesai. Selama masih ada anak muda yang mau belajar, bergerak, dan peduli pada energi, harapan itu akan selalu hidup.",
    },
    logo: {
      title: "Logo & Mitra",
      description: "Organisasi dan mitra yang telah bekerja sama",
    },
    search: {
      placeholder: "Cari berita...",
      noResults: "Tidak ada hasil ditemukan",
      loading: "Mencari...",
      error: "Gagal melakukan pencarian",
      minChars: "Ketik minimal 2 karakter untuk mencari",
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
      adminTentang: "Admin About",
      adminFaktaUnik: "Admin Unique Facts",
      adminLogo: "Admin Logo",
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
    latestTestimoni: {
      badge: "What They Say",
      title: "Latest Testimonials",
      description: "Listen to what they say about their experiences.",
      readMore: "Read More",
      viewAll: "View All Testimonials",
    },
    galeri: {
      badge: "Documentation",
      title: "Photo Gallery",
      description:
        "Collection of photo documentation that records activities and achievements.",
      viewAll: "View All Photos",
      closeModal: "Close modal",
      empty: "No photos in gallery",
      emptyDescription: "There are no photos available at the moment.",
      noDescription: "No description",
      previousPhoto: "Previous photo",
      nextPhoto: "Next photo",
    },
    contact: {
      title: "Contact",
      subtitle: "Let's Collaborate",
      description:
        "I'm always open to discussing new projects, job opportunities, or just getting to know each other. Feel free to reach out!",
      email: "email@example.com",
      phone: "+62 812-3456-7890",
      name: "Name",
      nameRequired: "Name *",
      emailRequired: "Email *",
      contactOptional: "Contact (Optional)",
      contactPlaceholder: "Phone number or WhatsApp",
      subjectOptional: "Subject (Optional)",
      subjectPlaceholder: "Your message subject",
      message: "Message",
      messageRequired: "Message *",
      sendButton: "Send Message",
      sending: "Sending...",
      validationError: "Name, email, and message are required",
      sendError: "Failed to send message. Please try again.",
      successMessage:
        "Thank you! Your message has been sent. We will respond soon.",
    },
    about: {
      title: "About Me",
      information: "Information",
      location: "Location",
      email: "Email",
      focus: "Focus",
      loading: "Loading data...",
      error: "Failed to load about data",
    },
    faktaUnik: {
      title: "Unique Facts",
      item1: "Years of Experience",
      item2: "Completed Projects",
      item3: "Satisfied Clients",
      item4: "Satisfaction Rate",
    },
    experience: {
      title: "Experience",
      loading: "Loading data...",
      error: "Failed to load experience data",
      empty: "No experience available",
    },
    rekamJejak: {
      title: "Journey Milestones That Shape Direction",
      description:
        "Each point is part of a journey that shapes vision and dedication to energy and Indonesia.",
      loading: "Loading data...",
      error: "Failed to load timeline data",
      empty: "No timeline available",
      footerMessage:
        "This journey is not over yet. As long as there are young people willing to learn, move, and care about energy, that hope will always live on.",
    },
    logo: {
      title: "Logos & Partners",
      description: "Organizations and partners we have collaborated with",
    },
    search: {
      placeholder: "Search news...",
      noResults: "No results found",
      loading: "Searching...",
      error: "Failed to search",
      minChars: "Type at least 2 characters to search",
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
      adminTentang: "Админ О Нас",
      adminFaktaUnik: "Админ Уникальных Фактов",
      adminLogo: "Админ Логотип",
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
    latestTestimoni: {
      badge: "Что Они Говорят",
      title: "Последние Отзывы",
      description: "Послушайте, что они говорят о своем опыте.",
      readMore: "Читать Далее",
      viewAll: "Посмотреть Все Отзывы",
    },
    galeri: {
      badge: "Документация",
      title: "Фото Галерея",
      description:
        "Коллекция фото-документации, запечатлевшая мероприятия и достижения.",
      viewAll: "Посмотреть Все Фото",
      closeModal: "Закрыть модальное окно",
      empty: "Нет фотографий в галерее",
      emptyDescription: "В данный момент фотографий нет.",
      noDescription: "Нет описания",
      previousPhoto: "Предыдущее фото",
      nextPhoto: "Следующее фото",
    },
    contact: {
      title: "Контакты",
      subtitle: "Давайте Сотрудничать",
      description:
        "Я всегда открыт для обсуждения новых проектов, возможностей трудоустройства или просто знакомства. Не стесняйтесь связаться со мной!",
      email: "email@example.com",
      phone: "+62 812-3456-7890",
      name: "Имя",
      nameRequired: "Имя *",
      emailRequired: "Электронная почта *",
      contactOptional: "Контакт (Необязательно)",
      contactPlaceholder: "Номер телефона или WhatsApp",
      subjectOptional: "Тема (Необязательно)",
      subjectPlaceholder: "Тема вашего сообщения",
      message: "Сообщение",
      messageRequired: "Сообщение *",
      sendButton: "Отправить Сообщение",
      sending: "Отправка...",
      validationError: "Имя, электронная почта и сообщение обязательны",
      sendError:
        "Не удалось отправить сообщение. Пожалуйста, попробуйте снова.",
      successMessage: "Спасибо! Ваше сообщение отправлено. Мы скоро ответим.",
    },
    about: {
      title: "Обо Мне",
      information: "Информация",
      location: "Местоположение",
      email: "Электронная почта",
      focus: "Фокус",
      loading: "Загрузка данных...",
      error: "Не удалось загрузить данные",
    },
    faktaUnik: {
      title: "Уникальные Факты",
      item1: "Лет Опыта",
      item2: "Завершенных Проектов",
      item3: "Довольных Клиентов",
      item4: "Уровень Удовлетворенности",
    },
    experience: {
      title: "Опыт",
      loading: "Загрузка данных...",
      error: "Не удалось загрузить данные опыта",
      empty: "Опыта пока нет",
    },
    rekamJejak: {
      title: "Вехи Путешествия, Формирующие Направление",
      description:
        "Каждая точка - это часть путешествия, формирующего видение и преданность энергии и Индонезии.",
      loading: "Загрузка данных...",
      error: "Не удалось загрузить данные хронологии",
      empty: "Хронологии пока нет",
      footerMessage:
        "Это путешествие еще не закончено. Пока есть молодые люди, готовые учиться, двигаться и заботиться об энергии, эта надежда всегда будет жить.",
    },
    logo: {
      title: "Логотипы и Партнеры",
      description: "Организации и партнеры, с которыми мы сотрудничали",
    },
    search: {
      placeholder: "Поиск новостей...",
      noResults: "Результатов не найдено",
      loading: "Поиск...",
      error: "Не удалось выполнить поиск",
      minChars: "Введите хотя бы 2 символа для поиска",
    },
  },
};

/**
 * Mendapatkan terjemahan berdasarkan bahasa
 */
export function getTranslations(lang: LanguageCode): Translations {
  return translations[lang] || translations.id;
}
