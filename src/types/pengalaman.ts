/**
 * Translation data untuk KegiatanPengalaman
 */
export interface KegiatanPengalamanTranslation {
  language_code: string;
  kegiatan: string;
}

/**
 * KegiatanPengalaman
 */
export interface KegiatanPengalaman {
  id: number;
  kegiatan: string; // Dari translation berdasarkan bahasa saat ini
  urutan: number;
}

/**
 * Translation data untuk Pengalaman
 */
export interface PengalamanTranslation {
  language_code: string;
  posisi: string;
  instansi?: string;
}

/**
 * Pengalaman dengan struktur multi-language
 */
export interface Pengalaman {
  id: number;
  durasi: string | null;
  posisi: string; // Dari translation berdasarkan bahasa saat ini
  instansi?: string; // Dari translation
  kegiatans: KegiatanPengalaman[];
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PengalamanResponse {
  success: boolean;
  data: Pengalaman;
  message?: string;
}

export interface PengalamanListResponse {
  success: boolean;
  data: Pengalaman[];
  message?: string;
}

/**
 * Data untuk create pengalaman dengan multi-language support
 */
export interface CreatePengalamanData {
  durasi?: string | null;
  translations: PengalamanTranslation[];
  kegiatans?: Array<{
    urutan: number;
    translations: KegiatanPengalamanTranslation[];
  }>;
}

/**
 * Data untuk update pengalaman dengan multi-language support
 */
export interface UpdatePengalamanData {
  durasi?: string | null;
  translations?: PengalamanTranslation[];
  kegiatans?: Array<{
    id?: number;
    urutan: number;
    translations: KegiatanPengalamanTranslation[];
  }>;
}
