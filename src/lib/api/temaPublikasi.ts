import apiClient from "@/lib/axios";
import {
  TemaPublikasi,
  TemaPublikasiResponse,
  TemaPublikasiListResponse,
  CreateTemaPublikasiData,
  UpdateTemaPublikasiData,
} from "@/types/publikasi";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all tema publikasi
 */
export async function getAllTemaPublikasi(
  lang?: LanguageCode
): Promise<TemaPublikasi[]> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TemaPublikasiListResponse>(
      "/api/tema-publikasi",
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching tema publikasi:", error);

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
        const response = await apiClient.get<TemaPublikasiListResponse>(
          "/api/tema-publikasi",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching tema publikasi dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data tema publikasi");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data tema publikasi"
      );
    }
    throw new Error("Gagal memuat data tema publikasi");
  }
}

/**
 * Get tema publikasi by ID
 */
export async function getTemaPublikasiById(
  id: number,
  lang?: LanguageCode
): Promise<TemaPublikasi> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TemaPublikasiResponse>(
      `/api/tema-publikasi/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching tema publikasi ${id}:`, error);

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
        const response = await apiClient.get<TemaPublikasiResponse>(
          `/api/tema-publikasi/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching tema publikasi dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Tema publikasi tidak ditemukan");
        }
        throw new Error("Gagal memuat data tema publikasi");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Tema publikasi tidak ditemukan");
    }
    throw new Error("Gagal memuat data tema publikasi");
  }
}

/**
 * Create new tema publikasi (requires authentication)
 */
export async function createTemaPublikasi(
  data: CreateTemaPublikasiData
): Promise<TemaPublikasi> {
  try {
    const response = await apiClient.post<TemaPublikasiResponse>(
      "/api/tema-publikasi",
      {
        translations: data.translations,
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating tema publikasi:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat tema publikasi"
      );
    }
    throw new Error("Gagal membuat tema publikasi");
  }
}

/**
 * Update tema publikasi (requires authentication)
 */
export async function updateTemaPublikasi(
  id: number,
  data: UpdateTemaPublikasiData
): Promise<TemaPublikasi> {
  try {
    const response = await apiClient.put<TemaPublikasiResponse>(
      `/api/tema-publikasi/${id}`,
      {
        translations: data.translations,
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating tema publikasi ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Tema publikasi tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate tema publikasi"
      );
    }
    throw new Error("Gagal mengupdate tema publikasi");
  }
}

/**
 * Delete tema publikasi (requires authentication)
 */
export async function deleteTemaPublikasi(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/tema-publikasi/${id}`);
  } catch (error: any) {
    console.error(`Error deleting tema publikasi ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Tema publikasi tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus tema publikasi"
      );
    }
    throw new Error("Gagal menghapus tema publikasi");
  }
}
