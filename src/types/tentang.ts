/**
 * Translation data untuk multi-language
 */
export interface TentangTranslation {
  language_code: string;
  judul: string;
  isi: string;
}

/**
 * Tentang dengan struktur multi-language
 */
export interface Tentang {
  id: number;
  foto?: string;
  judul: string; // Dari translation berdasarkan bahasa saat ini
  isi: string; // Dari translation berdasarkan bahasa saat ini
  language?: string; // Code bahasa dari response
  createdAt: string;
  updatedAt: string;
}

export interface TentangResponse {
  success: boolean;
  data: Tentang;
  message?: string;
}

export interface TentangListResponse {
  success: boolean;
  data: Tentang[];
  message?: string;
}

/**
 * Data untuk create tentang dengan multi-language support
 */
export interface CreateTentangData {
  translations: TentangTranslation[];
  foto?: File;
}

/**
 * Data untuk update tentang dengan multi-language support
 */
export interface UpdateTentangData {
  translations?: TentangTranslation[];
  foto?: File;
}
