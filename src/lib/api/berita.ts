import apiClient from "@/lib/axios";
import {
  Berita,
  BeritaResponse,
  BeritaListResponse,
  CreateBeritaData,
  UpdateBeritaData,
} from "@/types/berita";

/**
 * Get all berita dengan pagination dan search
 */
export async function getAllBerita(
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<BeritaListResponse> {
  try {
    const response = await apiClient.get<BeritaListResponse>("/api/berita", {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching berita:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data berita"
      );
    }
    throw new Error("Gagal memuat data berita");
  }
}

/**
 * Get berita by ID
 */
export async function getBeritaById(id: number): Promise<Berita> {
  try {
    const response = await apiClient.get<BeritaResponse>(`/api/berita/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching berita ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    throw new Error("Gagal memuat data berita");
  }
}

/**
 * Get berita by slug
 */
export async function getBeritaBySlug(slug: string): Promise<Berita> {
  try {
    const response = await apiClient.get<BeritaResponse>(
      `/api/berita/slug/${slug}`
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching berita by slug ${slug}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    throw new Error("Gagal memuat data berita");
  }
}

/**
 * Create new berita (requires authentication)
 */
export async function createBerita(data: CreateBeritaData): Promise<Berita> {
  try {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("isi", data.isi);
    if (data.slug) {
      formData.append("slug", data.slug);
    }
    // Foto utama (backward compatibility)
    if (data.foto) {
      formData.append("foto", data.foto);
    }
    // Multiple foto
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((file) => {
        formData.append("fotos", file);
      });
    }

    const response = await apiClient.post<BeritaResponse>(
      "/api/berita",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating berita:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal membuat berita");
    }
    throw new Error("Gagal membuat berita");
  }
}

/**
 * Update berita (requires authentication)
 */
export async function updateBerita(
  id: number,
  data: UpdateBeritaData
): Promise<Berita> {
  try {
    const formData = new FormData();
    if (data.judul) {
      formData.append("judul", data.judul);
    }
    if (data.isi) {
      formData.append("isi", data.isi);
    }
    if (data.slug) {
      formData.append("slug", data.slug);
    }
    // Foto utama (backward compatibility)
    if (data.foto) {
      formData.append("foto", data.foto);
    }
    // Multiple foto
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((file) => {
        formData.append("fotos", file);
      });
    }

    const response = await apiClient.put<BeritaResponse>(
      `/api/berita/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating berita ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate berita"
      );
    }
    throw new Error("Gagal mengupdate berita");
  }
}

/**
 * Delete berita (requires authentication)
 */
export async function deleteBerita(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/berita/${id}`);
  } catch (error: any) {
    console.error(`Error deleting berita ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal menghapus berita");
    }
    throw new Error("Gagal menghapus berita");
  }
}
