export interface Galeri {
  id: number;
  judul: string;
  deskripsi: string | null;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

export interface GaleriResponse {
  success: boolean;
  data: Galeri;
  message?: string;
}

export interface GaleriListResponse {
  success: boolean;
  data: Galeri[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateGaleriData {
  judul: string;
  deskripsi?: string;
  foto: File;
}

export interface UpdateGaleriData {
  judul?: string;
  deskripsi?: string;
  foto?: File;
}
