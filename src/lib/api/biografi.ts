import apiClient from "@/lib/axios";
import {
  Biografi,
  BiografiResponse,
  BiografiListResponse,
  CreateBiografiData,
  UpdateBiografiData,
} from "@/types/biografi";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get biografi (public) - biasanya hanya ada satu biografi
 */
export async function getBiografi(lang?: LanguageCode): Promise<Biografi> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<BiografiResponse>("/api/biografi", {
      params: { lang: language },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching biografi:", error);

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
      // Retry dengan bahasa default
      try {
        const response = await apiClient.get<BiografiResponse>(
          "/api/biografi",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching biografi dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Biografi tidak ditemukan");
        }
        throw new Error("Gagal memuat data biografi");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Biografi tidak ditemukan");
    }
    throw new Error("Gagal memuat data biografi");
  }
}

/**
 * Get all biografi (admin) - untuk melihat semua biografi jika ada beberapa
 */
export async function getAllBiografi(lang?: LanguageCode): Promise<Biografi[]> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<BiografiListResponse>(
      "/api/biografi/all",
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all biografi:", error);

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
      // Retry dengan bahasa default
      try {
        const response = await apiClient.get<BiografiListResponse>(
          "/api/biografi/all",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching all biografi dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data biografi");
      }
    }

    throw new Error("Gagal memuat data biografi");
  }
}

/**
 * Get biografi by ID
 */
export async function getBiografiById(
  id: number,
  lang?: LanguageCode
): Promise<Biografi> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<BiografiResponse>(
      `/api/biografi/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching biografi ${id}:`, error);

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
      // Retry dengan bahasa default
      try {
        const response = await apiClient.get<BiografiResponse>(
          `/api/biografi/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching biografi dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Biografi tidak ditemukan");
        }
        throw new Error("Gagal memuat data biografi");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Biografi tidak ditemukan");
    }
    throw new Error("Gagal memuat data biografi");
  }
}

/**
 * Create new biografi (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function createBiografi(
  data: CreateBiografiData
): Promise<Biografi> {
  try {
    const response = await apiClient.post<BiografiResponse>("/api/biografi", {
      translations: data.translations,
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating biografi:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal membuat biografi");
    }
    throw new Error("Gagal membuat biografi");
  }
}

/**
 * Update biografi (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function updateBiografi(
  id: number,
  data: UpdateBiografiData
): Promise<Biografi> {
  try {
    const response = await apiClient.put<BiografiResponse>(
      `/api/biografi/${id}`,
      {
        translations: data.translations,
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating biografi ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Biografi tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate biografi"
      );
    }
    throw new Error("Gagal mengupdate biografi");
  }
}

/**
 * Delete biografi (requires authentication)
 */
export async function deleteBiografi(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/biografi/${id}`);
  } catch (error: any) {
    console.error(`Error deleting biografi ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Biografi tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus biografi"
      );
    }
    throw new Error("Gagal menghapus biografi");
  }
}
