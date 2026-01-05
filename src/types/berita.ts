export interface FotoBerita {
  id: number;
  beritaId: number;
  foto: string;
  urutan: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Translation data untuk multi-language
 */
export interface BeritaTranslation {
  language_code: string;
  judul: string;
  isi: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
}

/**
 * Berita dengan struktur multi-language
 */
export interface Berita {
  id: number;
  slug: string;
  foto: string | null; // Foto utama
  is_published?: boolean;
  judul: string; // Dari translation berdasarkan bahasa saat ini
  isi: string; // Dari translation berdasarkan bahasa saat ini
  meta_title?: string; // Dari translation
  meta_description?: string; // Dari translation
  language?: string; // Code bahasa dari response
  fotos?: FotoBerita[]; // Array multiple foto
  createdAt: string;
  updatedAt: string;
}

export interface BeritaResponse {
  success: boolean;
  data: Berita;
  message?: string;
}

export interface BeritaListResponse {
  success: boolean;
  data: Berita[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Data untuk create berita dengan multi-language support
 */
export interface CreateBeritaData {
  slug?: string;
  foto?: File | null; // Foto utama
  fotos?: File[]; // Multiple foto
  // Format baru: translations array
  translations?: BeritaTranslation[];
  // Format lama (backward compatibility): akan dikonversi ke translations
  judul?: string;
  isi?: string;
}

/**
 * Data untuk update berita dengan multi-language support
 */
export interface UpdateBeritaData {
  slug?: string;
  foto?: File | null; // Foto utama
  fotos?: File[]; // Multiple foto
  is_published?: boolean;
  // Format baru: translations array
  translations?: BeritaTranslation[];
  // Format lama (backward compatibility): akan dikonversi ke translations
  judul?: string;
  isi?: string;
}
