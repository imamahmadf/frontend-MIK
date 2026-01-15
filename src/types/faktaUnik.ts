/**
 * FaktaUnik dengan struktur multi-language
 */
export interface FaktaUnik {
  id: number;
  angka: number;
  satuan: string | null; // Dari translation berdasarkan bahasa saat ini
  isi: string; // Dari translation berdasarkan bahasa saat ini
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaktaUnikResponse {
  success: boolean;
  data: FaktaUnik;
  message?: string;
}

export interface FaktaUnikListResponse {
  success: boolean;
  data: FaktaUnik[];
  message?: string;
}

/**
 * Translation data untuk FaktaUnik
 */
export interface FaktaUnikTranslation {
  language_code: string;
  satuan?: string | null;
  isi: string;
}

/**
 * Data untuk create fakta unik dengan multi-language support
 */
export interface CreateFaktaUnikData {
  angka: number;
  translations: FaktaUnikTranslation[];
}

/**
 * Data untuk update fakta unik dengan multi-language support
 */
export interface UpdateFaktaUnikData {
  angka?: number;
  translations?: FaktaUnikTranslation[];
}
