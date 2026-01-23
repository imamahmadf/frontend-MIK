export interface SosialMedia {
  id: number;
  nama: string; // Nama platform (contoh: "Facebook", "Instagram", "LinkedIn", dll)
  icon: string | null; // URL icon atau nama icon
  url: string; // URL link sosial media
  urutan: number; // Urutan untuk sorting
  aktif: boolean; // Status aktif/tidak aktif
  createdAt: string;
  updatedAt: string;
}

export interface SosialMediaResponse {
  success: boolean;
  data: SosialMedia;
  message?: string;
}

export interface SosialMediaListResponse {
  success: boolean;
  data: SosialMedia[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateSosialMediaData {
  nama: string;
  icon?: string | null;
  url: string;
  urutan?: number;
  aktif?: boolean;
}

export interface UpdateSosialMediaData {
  nama?: string;
  icon?: string | null;
  url?: string;
  urutan?: number;
  aktif?: boolean;
}

