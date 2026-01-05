/**
 * Translation data untuk multi-language
 */
export interface BiografiTranslation {
  language_code: string;
  judul: string;
  isi: string;
  slogan?: string;
}

/**
 * Biografi dengan struktur multi-language
 */
export interface Biografi {
  id: number;
  judul: string; // Dari translation berdasarkan bahasa saat ini
  isi: string; // Dari translation berdasarkan bahasa saat ini
  slogan?: string; // Dari translation
  language?: string; // Code bahasa dari response
  createdAt: string;
  updatedAt: string;
}

export interface BiografiResponse {
  success: boolean;
  data: Biografi;
  message?: string;
}

export interface BiografiListResponse {
  success: boolean;
  data: Biografi[];
  message?: string;
}

/**
 * Data untuk create biografi dengan multi-language support
 */
export interface CreateBiografiData {
  translations: BiografiTranslation[];
}

/**
 * Data untuk update biografi dengan multi-language support
 */
export interface UpdateBiografiData {
  translations?: BiografiTranslation[];
}
