/**
 * Status pesan
 */
export type PesanStatus = "new" | "read" | "replied";

/**
 * Pesan model
 */
export interface Pesan {
  id: number;
  nama: string;
  email: string;
  kontak: string | null;
  judul: string | null;
  pesan: string;
  status: PesanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PesanResponse {
  success: boolean;
  data: Pesan;
  message?: string;
}

export interface PesanListResponse {
  success: boolean;
  data: Pesan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Data untuk create pesan (contact form)
 */
export interface CreatePesanData {
  nama: string;
  email: string;
  kontak?: string;
  judul?: string;
  pesan: string;
}

/**
 * Data untuk update pesan
 */
export interface UpdatePesanData {
  status?: PesanStatus;
  nama?: string;
  email?: string;
  kontak?: string;
  judul?: string;
  pesan?: string;
}
