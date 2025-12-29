export interface FotoBerita {
  id: number;
  beritaId: number;
  foto: string;
  urutan: number;
  createdAt: string;
  updatedAt: string;
}

export interface Berita {
  id: number;
  judul: string;
  isi: string;
  slug: string;
  foto: string | null; // Foto utama (backward compatibility)
  fotos?: FotoBerita[]; // Array multiple foto
  createdAt: string;
  updatedAt: string;
}

export interface BeritaResponse {
  success: boolean;
  data: Berita;
  message?: string;
}

export interface BeritaListResponse {
  success: boolean;
  data: Berita[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateBeritaData {
  judul: string;
  isi: string;
  slug?: string;
  foto?: File | null; // Foto utama (backward compatibility)
  fotos?: File[]; // Multiple foto
}

export interface UpdateBeritaData {
  judul?: string;
  isi?: string;
  slug?: string;
  foto?: File | null; // Foto utama (backward compatibility)
  fotos?: File[]; // Multiple foto
}
