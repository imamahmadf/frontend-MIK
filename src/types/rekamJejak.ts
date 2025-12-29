export interface RekamJejak {
  id: number;
  judul: string;
  detail: string; // Field dari backend
  isi?: string; // Alias untuk detail (jika backend menggunakan isi)
  urutan?: number;
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

export interface CreateRekamJejakData {
  judul: string;
  detail: string;
  urutan?: number;
}

export interface UpdateRekamJejakData {
  judul?: string;
  detail?: string;
  urutan?: number;
}
