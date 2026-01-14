import apiClient from "@/lib/axios";
import {
  Pengalaman,
  PengalamanResponse,
  PengalamanListResponse,
  CreatePengalamanData,
  UpdatePengalamanData,
} from "@/types/pengalaman";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all pengalaman
 */
export async function getAllPengalaman(
  lang?: LanguageCode
): Promise<Pengalaman[]> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<PengalamanListResponse>(
      "/api/pengalaman",
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching pengalaman:", error);

    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("Bahasa")
    ) {
      console.warn(
        `Bahasa ${
          lang || getCurrentLanguage()
        } tidak ditemukan, fallback ke bahasa default (id)`
      );
      try {
        const response = await apiClient.get<PengalamanListResponse>(
          "/api/pengalaman",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching pengalaman dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data pengalaman");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data pengalaman"
      );
    }
    throw new Error("Gagal memuat data pengalaman");
  }
}

/**
 * Get pengalaman by ID
 */
export async function getPengalamanById(
  id: number,
  lang?: LanguageCode
): Promise<Pengalaman> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<PengalamanResponse>(
      `/api/pengalaman/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching pengalaman ${id}:`, error);

    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("Bahasa")
    ) {
      console.warn(
        `Bahasa ${
          lang || getCurrentLanguage()
        } tidak ditemukan, fallback ke bahasa default (id)`
      );
      try {
        const response = await apiClient.get<PengalamanResponse>(
          `/api/pengalaman/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching pengalaman dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Pengalaman tidak ditemukan");
        }
        throw new Error("Gagal memuat data pengalaman");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Pengalaman tidak ditemukan");
    }
    throw new Error("Gagal memuat data pengalaman");
  }
}

/**
 * Create new pengalaman (requires authentication)
 */
export async function createPengalaman(
  data: CreatePengalamanData
): Promise<Pengalaman> {
  try {
    const response = await apiClient.post<PengalamanResponse>(
      "/api/pengalaman",
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating pengalaman:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat pengalaman"
      );
    }
    throw new Error("Gagal membuat pengalaman");
  }
}

/**
 * Update pengalaman (requires authentication)
 */
export async function updatePengalaman(
  id: number,
  data: UpdatePengalamanData
): Promise<Pengalaman> {
  try {
    const response = await apiClient.put<PengalamanResponse>(
      `/api/pengalaman/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating pengalaman ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Pengalaman tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate pengalaman"
      );
    }
    throw new Error("Gagal mengupdate pengalaman");
  }
}

/**
 * Delete pengalaman (requires authentication)
 */
export async function deletePengalaman(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/pengalaman/${id}`);
  } catch (error: any) {
    console.error(`Error deleting pengalaman ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Pengalaman tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus pengalaman"
      );
    }
    throw new Error("Gagal menghapus pengalaman");
  }
}
