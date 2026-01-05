/**
 * Translation data untuk multi-language hero
 */
export interface HeroTranslation {
  language_code: string;
  nama: string;
  slogan?: string;
  isi?: string;
}

/**
 * Hero dengan struktur multi-language
 */
export interface Hero {
  id: number;
  foto: string | null;
  is_active: boolean;
  nama: string; // Dari translation berdasarkan bahasa saat ini
  slogan?: string; // Dari translation
  isi?: string; // Dari translation
  language?: string; // Code bahasa dari response
  createdAt: string;
  updatedAt: string;
}

export interface HeroResponse {
  success: boolean;
  data: Hero;
  message?: string;
}

export interface HeroListResponse {
  success: boolean;
  data: Hero[];
}

/**
 * Data untuk create hero dengan multi-language support
 */
export interface CreateHeroData {
  foto?: File | null;
  is_active?: boolean;
  // Format baru: translations array
  translations?: HeroTranslation[];
  // Format lama (backward compatibility): akan dikonversi ke translations
  nama?: string;
  slogan?: string;
  isi?: string;
}

/**
 * Data untuk update hero dengan multi-language support
 */
export interface UpdateHeroData {
  foto?: File | null;
  is_active?: boolean;
  // Format baru: translations array
  translations?: HeroTranslation[];
  // Format lama (backward compatibility): akan dikonversi ke translations
  nama?: string;
  slogan?: string;
  isi?: string;
}
