import apiClient from "@/lib/axios";
import {
  Publikasi,
  PublikasiResponse,
  PublikasiListResponse,
  CreatePublikasiData,
  UpdatePublikasiData,
} from "@/types/publikasi";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all publikasi dengan pagination dan filter tema
 */
export async function getAllPublikasi(
  page: number = 1,
  limit: number = 10,
  temaId?: number | null,
  lang?: LanguageCode
): Promise<PublikasiListResponse> {
  try {
    const language = lang || getCurrentLanguage();
    const params: any = { page, limit, lang: language };
    if (temaId) {
      params.temaId = temaId;
    }
    const response = await apiClient.get<PublikasiListResponse>(
      "/api/publikasi",
      {
        params,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching publikasi:", error);

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
        const params: any = { page, limit, lang: "id" };
        if (temaId) {
          params.temaId = temaId;
        }
        const response = await apiClient.get<PublikasiListResponse>(
          "/api/publikasi",
          {
            params,
          }
        );
        return response.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching publikasi dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data publikasi");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data publikasi"
      );
    }
    throw new Error("Gagal memuat data publikasi");
  }
}

/**
 * Get publikasi by ID
 */
export async function getPublikasiById(
  id: number,
  lang?: LanguageCode
): Promise<Publikasi> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<PublikasiResponse>(
      `/api/publikasi/${id}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching publikasi ${id}:`, error);

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
        const response = await apiClient.get<PublikasiResponse>(
          `/api/publikasi/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching publikasi dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Publikasi tidak ditemukan");
        }
        throw new Error("Gagal memuat data publikasi");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Publikasi tidak ditemukan");
    }
    throw new Error("Gagal memuat data publikasi");
  }
}

/**
 * Create new publikasi (requires authentication)
 */
export async function createPublikasi(
  data: CreatePublikasiData
): Promise<Publikasi> {
  try {
    const formData = new FormData();

    // Handle translations
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    }

    // Handle foto
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    // Handle tanggal
    if (data.tanggal) {
      formData.append("tanggal", data.tanggal);
    }

    // Handle temaId
    if (data.temaId) {
      formData.append("temaId", data.temaId.toString());
    }

    // Handle link
    if (data.link) {
      formData.append("link", data.link);
    }

    const response = await apiClient.post<PublikasiResponse>(
      "/api/publikasi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating publikasi:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat publikasi"
      );
    }
    throw new Error("Gagal membuat publikasi");
  }
}

/**
 * Update publikasi (requires authentication)
 */
export async function updatePublikasi(
  id: number,
  data: UpdatePublikasiData
): Promise<Publikasi> {
  try {
    const formData = new FormData();

    // Handle translations
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    }

    // Handle foto
    if (data.foto) {
      formData.append("foto", data.foto);
    } else if (data.foto === null) {
      formData.append("foto", "");
    }

    // Handle tanggal
    if (data.tanggal !== undefined) {
      formData.append("tanggal", data.tanggal || "");
    }

    // Handle temaId
    if (data.temaId !== undefined) {
      formData.append("temaId", data.temaId ? data.temaId.toString() : "");
    }

    // Handle link
    if (data.link !== undefined) {
      formData.append("link", data.link || "");
    }

    const response = await apiClient.put<PublikasiResponse>(
      `/api/publikasi/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating publikasi ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Publikasi tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate publikasi"
      );
    }
    throw new Error("Gagal mengupdate publikasi");
  }
}

/**
 * Delete publikasi (requires authentication)
 */
export async function deletePublikasi(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/publikasi/${id}`);
  } catch (error: any) {
    console.error(`Error deleting publikasi ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Publikasi tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus publikasi"
      );
    }
    throw new Error("Gagal menghapus publikasi");
  }
}
