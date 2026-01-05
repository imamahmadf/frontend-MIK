/**
 * Translation data untuk TemaPublikasi
 */
export interface TemaPublikasiTranslation {
  language_code: string;
  nama: string;
}

/**
 * TemaPublikasi dengan struktur multi-language
 */
export interface TemaPublikasi {
  id: number;
  nama: string; // Dari translation berdasarkan bahasa saat ini
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemaPublikasiResponse {
  success: boolean;
  data: TemaPublikasi;
  message?: string;
}

export interface TemaPublikasiListResponse {
  success: boolean;
  data: TemaPublikasi[];
  message?: string;
}

/**
 * Translation data untuk Publikasi
 */
export interface PublikasiTranslation {
  language_code: string;
  judul: string;
  ringkasan?: string;
}

/**
 * Publikasi dengan struktur multi-language
 */
export interface Publikasi {
  id: number;
  foto: string | null;
  tanggal: string | null;
  link: string | null;
  temaId: number | null;
  tema: { id: number; nama: string } | null;
  judul: string; // Dari translation berdasarkan bahasa saat ini
  ringkasan?: string; // Dari translation
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublikasiResponse {
  success: boolean;
  data: Publikasi;
  message?: string;
}

export interface PublikasiListResponse {
  success: boolean;
  data: Publikasi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Data untuk create publikasi dengan multi-language support
 */
export interface CreatePublikasiData {
  foto?: File | null;
  tanggal?: string | null;
  temaId?: number | null;
  link?: string | null;
  translations: PublikasiTranslation[];
}

/**
 * Data untuk update publikasi dengan multi-language support
 */
export interface UpdatePublikasiData {
  foto?: File | null;
  tanggal?: string | null;
  temaId?: number | null;
  link?: string | null;
  translations?: PublikasiTranslation[];
}

/**
 * Data untuk create tema publikasi dengan multi-language support
 */
export interface CreateTemaPublikasiData {
  translations: TemaPublikasiTranslation[];
}

/**
 * Data untuk update tema publikasi dengan multi-language support
 */
export interface UpdateTemaPublikasiData {
  translations?: TemaPublikasiTranslation[];
}
