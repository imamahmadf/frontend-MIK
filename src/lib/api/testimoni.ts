import apiClient from "@/lib/axios";
import {
  Testimoni,
  TestimoniResponse,
  TestimoniListResponse,
  CreateTestimoniData,
  UpdateTestimoniData,
} from "@/types/testimoni";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all testimoni dengan pagination
 */
export async function getAllTestimoni(
  page: number = 1,
  limit: number = 10,
  lang?: LanguageCode
): Promise<TestimoniListResponse> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TestimoniListResponse>(
      "/api/testimoni",
      {
        params: { page, limit, lang: language },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching testimoni:", error);

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
        const response = await apiClient.get<TestimoniListResponse>(
          "/api/testimoni",
          {
            params: { page, limit, lang: "id" },
          }
        );
        return response.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching testimoni dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data testimoni");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data testimoni"
      );
    }
    throw new Error("Gagal memuat data testimoni");
  }
}

/**
 * Get testimoni by ID
 */
export async function getTestimoniById(
  id: number,
  lang?: LanguageCode
): Promise<Testimoni> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<TestimoniResponse>(
      `/api/testimoni/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching testimoni ${id}:`, error);

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
        const response = await apiClient.get<TestimoniResponse>(
          `/api/testimoni/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching testimoni dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Testimoni tidak ditemukan");
        }
        throw new Error("Gagal memuat data testimoni");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Testimoni tidak ditemukan");
    }
    throw new Error("Gagal memuat data testimoni");
  }
}

/**
 * Create new testimoni (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function createTestimoni(
  data: CreateTestimoniData
): Promise<Testimoni> {
  try {
    const formData = new FormData();

    // Handle translations (format multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    }

    // Foto
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await apiClient.post<TestimoniResponse>(
      "/api/testimoni",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating testimoni:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat testimoni"
      );
    }
    throw new Error("Gagal membuat testimoni");
  }
}

/**
 * Update testimoni (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function updateTestimoni(
  id: number,
  data: UpdateTestimoniData
): Promise<Testimoni> {
  try {
    const formData = new FormData();

    // Handle translations (format multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    }

    // Foto
    if (data.foto) {
      formData.append("foto", data.foto);
    } else if (data.foto === null) {
      // Explicit null untuk menghapus foto
      formData.append("foto", "");
    }

    const response = await apiClient.put<TestimoniResponse>(
      `/api/testimoni/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating testimoni ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Testimoni tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate testimoni"
      );
    }
    throw new Error("Gagal mengupdate testimoni");
  }
}

/**
 * Delete testimoni (requires authentication)
 */
export async function deleteTestimoni(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/testimoni/${id}`);
  } catch (error: any) {
    console.error(`Error deleting testimoni ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Testimoni tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus testimoni"
      );
    }
    throw new Error("Gagal menghapus testimoni");
  }
}
