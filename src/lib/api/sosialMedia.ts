import apiClient from "@/lib/axios";
import {
  SosialMedia,
  SosialMediaResponse,
  SosialMediaListResponse,
  CreateSosialMediaData,
  UpdateSosialMediaData,
} from "@/types/sosialMedia";

/**
 * Get all sosial media
 */
export async function getAllSosialMedia(): Promise<SosialMedia[]> {
  try {
    const response = await apiClient.get<SosialMediaListResponse>(
      "/api/sosial-media"
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching sosial media:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data sosial media"
      );
    }
    throw new Error("Gagal memuat data sosial media");
  }
}

/**
 * Get sosial media by ID
 */
export async function getSosialMediaById(id: number): Promise<SosialMedia> {
  try {
    const response = await apiClient.get<SosialMediaResponse>(
      `/api/sosial-media/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching sosial media ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Sosial media tidak ditemukan");
    }
    throw new Error("Gagal memuat data sosial media");
  }
}

/**
 * Get aktif sosial media (public) - hanya yang aktif
 */
export async function getAktifSosialMedia(): Promise<SosialMedia[]> {
  try {
    const response = await apiClient.get<SosialMediaListResponse>(
      "/api/sosial-media/aktif"
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching aktif sosial media:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data sosial media"
      );
    }
    throw new Error("Gagal memuat data sosial media");
  }
}

/**
 * Create new sosial media (requires authentication)
 */
export async function createSosialMedia(
  data: CreateSosialMediaData
): Promise<SosialMedia> {
  try {
    const response = await apiClient.post<SosialMediaResponse>(
      "/api/sosial-media",
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating sosial media:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat sosial media"
      );
    }
    throw new Error("Gagal membuat sosial media");
  }
}

/**
 * Update sosial media (requires authentication)
 */
export async function updateSosialMedia(
  id: number,
  data: UpdateSosialMediaData
): Promise<SosialMedia> {
  try {
    const response = await apiClient.put<SosialMediaResponse>(
      `/api/sosial-media/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating sosial media ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Sosial media tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate sosial media"
      );
    }
    throw new Error("Gagal mengupdate sosial media");
  }
}

/**
 * Delete sosial media (requires authentication)
 */
export async function deleteSosialMedia(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/sosial-media/${id}`);
  } catch (error: any) {
    console.error(`Error deleting sosial media ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Sosial media tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus sosial media"
      );
    }
    throw new Error("Gagal menghapus sosial media");
  }
}

