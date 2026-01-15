import apiClient from "@/lib/axios";
import {
  Tentang,
  TentangResponse,
  TentangListResponse,
  CreateTentangData,
  UpdateTentangData,
} from "@/types/tentang";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get tentang (public) - biasanya hanya ada satu tentang
 */
export async function getTentang(lang?: LanguageCode): Promise<Tentang> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TentangResponse>("/api/tentang", {
      params: { lang: language },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching tentang:", error);

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
        const response = await apiClient.get<TentangResponse>("/api/tentang", {
          params: { lang: "id" },
        });
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching tentang dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Data tentang tidak ditemukan");
        }
        throw new Error("Gagal memuat data tentang");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Data tentang tidak ditemukan");
    }
    throw new Error("Gagal memuat data tentang");
  }
}

/**
 * Get all tentang (admin) - untuk melihat semua tentang jika ada beberapa
 */
export async function getAllTentang(lang?: LanguageCode): Promise<Tentang[]> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TentangListResponse>(
      "/api/tentang/all",
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all tentang:", error);

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
        const response = await apiClient.get<TentangListResponse>(
          "/api/tentang/all",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching all tentang dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data tentang");
      }
    }

    throw new Error("Gagal memuat data tentang");
  }
}

/**
 * Get tentang by ID
 */
export async function getTentangById(
  id: number,
  lang?: LanguageCode
): Promise<Tentang> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TentangResponse>(
      `/api/tentang/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching tentang ${id}:`, error);

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
        const response = await apiClient.get<TentangResponse>(
          `/api/tentang/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching tentang dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Data tentang tidak ditemukan");
        }
        throw new Error("Gagal memuat data tentang");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Data tentang tidak ditemukan");
    }
    throw new Error("Gagal memuat data tentang");
  }
}

/**
 * Create new tentang (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function createTentang(data: CreateTentangData): Promise<Tentang> {
  try {
    const formData = new FormData();

    // Tambahkan translations sebagai JSON string
    formData.append("translations", JSON.stringify(data.translations));

    // Tambahkan foto jika ada
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await apiClient.post<TentangResponse>(
      "/api/tentang",
      formData
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating tentang:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat data tentang"
      );
    }
    throw new Error("Gagal membuat data tentang");
  }
}

/**
 * Update tentang (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function updateTentang(
  id: number,
  data: UpdateTentangData
): Promise<Tentang> {
  try {
    const formData = new FormData();

    // Tambahkan translations jika ada
    if (data.translations) {
      formData.append("translations", JSON.stringify(data.translations));
    }

    // Tambahkan foto jika ada
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await apiClient.put<TentangResponse>(
      `/api/tentang/${id}`,
      formData
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating tentang ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Data tentang tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate data tentang"
      );
    }
    throw new Error("Gagal mengupdate data tentang");
  }
}

/**
 * Delete tentang (requires authentication)
 */
export async function deleteTentang(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/tentang/${id}`);
  } catch (error: any) {
    console.error(`Error deleting tentang ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Data tentang tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus data tentang"
      );
    }
    throw new Error("Gagal menghapus data tentang");
  }
}
