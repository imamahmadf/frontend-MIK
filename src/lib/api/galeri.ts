import apiClient from "@/lib/axios";
import {
  Galeri,
  GaleriResponse,
  GaleriListResponse,
  CreateGaleriData,
  UpdateGaleriData,
} from "@/types/galeri";

/**
 * Get all galeri dengan pagination dan search
 */
export async function getAllGaleri(
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<GaleriListResponse> {
  try {
    const response = await apiClient.get<GaleriListResponse>("/api/galeri", {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching galeri:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data galeri"
      );
    }
    throw new Error("Gagal memuat data galeri");
  }
}

/**
 * Get galeri by ID
 */
export async function getGaleriById(id: number): Promise<Galeri> {
  try {
    const response = await apiClient.get<GaleriResponse>(`/api/galeri/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching galeri ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Galeri tidak ditemukan");
    }
    throw new Error("Gagal memuat data galeri");
  }
}

/**
 * Create new galeri (requires authentication)
 */
export async function createGaleri(data: CreateGaleriData): Promise<Galeri> {
  try {
    const formData = new FormData();
    formData.append("judul", data.judul);
    if (data.deskripsi) {
      formData.append("deskripsi", data.deskripsi);
    }
    formData.append("foto", data.foto);

    const response = await apiClient.post<GaleriResponse>(
      "/api/galeri",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating galeri:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal membuat galeri");
    }
    throw new Error("Gagal membuat galeri");
  }
}

/**
 * Update galeri (requires authentication)
 */
export async function updateGaleri(
  id: number,
  data: UpdateGaleriData
): Promise<Galeri> {
  try {
    const formData = new FormData();
    if (data.judul) {
      formData.append("judul", data.judul);
    }
    if (data.deskripsi !== undefined) {
      formData.append("deskripsi", data.deskripsi || "");
    }
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await apiClient.put<GaleriResponse>(
      `/api/galeri/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating galeri ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Galeri tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate galeri"
      );
    }
    throw new Error("Gagal mengupdate galeri");
  }
}

/**
 * Delete galeri (requires authentication)
 */
export async function deleteGaleri(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/galeri/${id}`);
  } catch (error: any) {
    console.error(`Error deleting galeri ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Galeri tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal menghapus galeri");
    }
    throw new Error("Gagal menghapus galeri");
  }
}
