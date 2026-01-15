import apiClient from "@/lib/axios";
import {
  FaktaUnik,
  FaktaUnikResponse,
  FaktaUnikListResponse,
  CreateFaktaUnikData,
  UpdateFaktaUnikData,
} from "@/types/faktaUnik";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all fakta unik
 */
export async function getAllFaktaUnik(
  lang?: LanguageCode
): Promise<FaktaUnik[]> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<FaktaUnikListResponse>(
      "/api/fakta-unik",
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching fakta unik:", error);

    // Jika error karena bahasa tidak ditemukan, coba dengan bahasa default
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
        const response = await apiClient.get<FaktaUnikListResponse>(
          "/api/fakta-unik",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching fakta unik dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data fakta unik");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data fakta unik"
      );
    }
    throw new Error("Gagal memuat data fakta unik");
  }
}

/**
 * Get fakta unik by ID
 */
export async function getFaktaUnikById(
  id: number,
  lang?: LanguageCode
): Promise<FaktaUnik> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<FaktaUnikResponse>(
      `/api/fakta-unik/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching fakta unik ${id}:`, error);

    // Jika error karena bahasa tidak ditemukan, coba dengan bahasa default
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
        const response = await apiClient.get<FaktaUnikResponse>(
          `/api/fakta-unik/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching fakta unik dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Fakta unik tidak ditemukan");
        }
        throw new Error("Gagal memuat data fakta unik");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Fakta unik tidak ditemukan");
    }
    throw new Error("Gagal memuat data fakta unik");
  }
}

/**
 * Create new fakta unik (requires authentication)
 */
export async function createFaktaUnik(
  data: CreateFaktaUnikData
): Promise<FaktaUnik> {
  try {
    // Kirim sebagai JSON karena tidak ada file upload
    const response = await apiClient.post<FaktaUnikResponse>(
      "/api/fakta-unik",
      {
        angka: data.angka,
        translations: data.translations,
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating fakta unik:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat data fakta unik"
      );
    }
    throw new Error("Gagal membuat data fakta unik");
  }
}

/**
 * Update fakta unik (requires authentication)
 */
export async function updateFaktaUnik(
  id: number,
  data: UpdateFaktaUnikData
): Promise<FaktaUnik> {
  try {
    // Kirim sebagai JSON karena tidak ada file upload
    const payload: any = {};

    if (data.angka !== undefined) {
      payload.angka = data.angka;
    }

    if (data.translations) {
      payload.translations = data.translations;
    }

    const response = await apiClient.put<FaktaUnikResponse>(
      `/api/fakta-unik/${id}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating fakta unik ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Data fakta unik tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate data fakta unik"
      );
    }
    throw new Error("Gagal mengupdate data fakta unik");
  }
}

/**
 * Delete fakta unik (requires authentication)
 */
export async function deleteFaktaUnik(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/fakta-unik/${id}`);
  } catch (error: any) {
    console.error(`Error deleting fakta unik ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Data fakta unik tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus data fakta unik"
      );
    }
    throw new Error("Gagal menghapus data fakta unik");
  }
}
