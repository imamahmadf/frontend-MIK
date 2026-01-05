/**
 * Translation data untuk multi-language
 */
export interface RekamJejakTranslation {
  language_code: string;
  judul: string;
  isi: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
}

/**
 * Rekam Jejak dengan struktur multi-language
 */
export interface RekamJejak {
  id: number;
  slug: string;
  foto: string | null;
  judul: string; // Dari translation berdasarkan bahasa saat ini
  isi: string; // Dari translation berdasarkan bahasa saat ini
  detail?: string; // Alias untuk isi (backward compatibility)
  meta_title?: string; // Dari translation
  meta_description?: string; // Dari translation
  language?: string; // Code bahasa dari response
  urutan?: number; // Urutan untuk sorting
  createdAt: string;
  updatedAt: string;
}

export interface RekamJejakResponse {
  success: boolean;
  data: RekamJejak;
  message?: string;
}

export interface RekamJejakListResponse {
  success: boolean;
  data: RekamJejak[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Data untuk create rekam jejak dengan multi-language support
 */
export interface CreateRekamJejakData {
  slug?: string;
  foto?: File | null;
  // Format baru: translations array
  translations?: RekamJejakTranslation[];
  // Format lama (backward compatibility): akan dikonversi ke translations
  judul?: string;
  detail?: string;
  isi?: string;
  urutan?: number;
}

/**
 * Data untuk update rekam jejak dengan multi-language support
 */
export interface UpdateRekamJejakData {
  slug?: string;
  foto?: File | null;
  // Format baru: translations array
  translations?: RekamJejakTranslation[];
  // Format lama (backward compatibility): akan dikonversi ke translations
  judul?: string;
  detail?: string;
  isi?: string;
  urutan?: number;
}
