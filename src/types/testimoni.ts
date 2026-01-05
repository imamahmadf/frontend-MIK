/**
 * Translation data untuk multi-language
 */
export interface TestimoniTranslation {
  language_code: string;
  nama: string;
  isi: string;
  tempat?: string;
}

/**
 * Testimoni dengan struktur multi-language
 */
export interface Testimoni {
  id: number;
  foto: string | null;
  nama: string; // Dari translation berdasarkan bahasa saat ini
  isi: string; // Dari translation berdasarkan bahasa saat ini
  tempat?: string; // Dari translation
  language?: string; // Code bahasa dari response
  createdAt: string;
  updatedAt: string;
}

export interface TestimoniResponse {
  success: boolean;
  data: Testimoni;
  message?: string;
}

export interface TestimoniListResponse {
  success: boolean;
  data: Testimoni[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Data untuk create testimoni dengan multi-language support
 */
export interface CreateTestimoniData {
  foto?: File | null;
  translations: TestimoniTranslation[];
}

/**
 * Data untuk update testimoni dengan multi-language support
 */
export interface UpdateTestimoniData {
  foto?: File | null;
  translations?: TestimoniTranslation[];
}
