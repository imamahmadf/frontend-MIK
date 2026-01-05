import apiClient from "@/lib/axios";
import {
  RekamJejak,
  RekamJejakResponse,
  RekamJejakListResponse,
  CreateRekamJejakData,
  UpdateRekamJejakData,
} from "@/types/rekamJejak";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all rekam jejak dengan pagination dan search
 */
export async function getAllRekamJejak(
  page: number = 1,
  limit: number = 100,
  search: string = "",
  lang?: LanguageCode
): Promise<RekamJejakListResponse> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<RekamJejakListResponse>(
      "/api/rekam-jejak",
      {
        params: { page, limit, search, lang: language },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching rekam jejak:", error);

    // Jika error karena bahasa tidak ditemukan, coba dengan bahasa default
    if (
      error.response?.status === 400 &&
      error.response?.data?.message === "Bahasa tidak ditemukan"
    ) {
      console.warn(
        `Bahasa ${
          lang || getCurrentLanguage()
        } tidak ditemukan, fallback ke bahasa default (id)`
      );
      // Retry dengan bahasa default
      try {
        const response = await apiClient.get<RekamJejakListResponse>(
          "/api/rekam-jejak",
          {
            params: { page, limit, search, lang: "id" },
          }
        );
        return response.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching rekam jejak dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data rekam jejak");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data rekam jejak"
      );
    }
    throw new Error("Gagal memuat data rekam jejak");
  }
}

/**
 * Get rekam jejak by ID
 */
export async function getRekamJejakById(
  id: number,
  lang?: LanguageCode
): Promise<RekamJejak> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<RekamJejakResponse>(
      `/api/rekam-jejak/${id}`,
      {
        params: { lang: language },
      }
    );
    const data = response.data.data;
    // Map isi ke detail untuk backward compatibility
    if (data.isi && !data.detail) {
      data.detail = data.isi;
    }
    return data;
  } catch (error: any) {
    console.error(`Error fetching rekam jejak ${id}:`, error);

    // Jika error karena bahasa tidak ditemukan, coba dengan bahasa default
    if (
      error.response?.status === 400 &&
      error.response?.data?.message === "Bahasa tidak ditemukan"
    ) {
      console.warn(
        `Bahasa ${
          lang || getCurrentLanguage()
        } tidak ditemukan, fallback ke bahasa default (id)`
      );
      // Retry dengan bahasa default
      try {
        const response = await apiClient.get<RekamJejakResponse>(
          `/api/rekam-jejak/${id}`,
          {
            params: { lang: "id" },
          }
        );
        const data = response.data.data;
        // Map isi ke detail untuk backward compatibility
        if (data.isi && !data.detail) {
          data.detail = data.isi;
        }
        return data;
      } catch (retryError: any) {
        console.error(
          "Error fetching rekam jejak dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Rekam jejak tidak ditemukan");
        }
        throw new Error("Gagal memuat data rekam jejak");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Rekam jejak tidak ditemukan");
    }
    throw new Error("Gagal memuat data rekam jejak");
  }
}

/**
 * Create new rekam jejak (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function createRekamJejak(
  data: CreateRekamJejakData
): Promise<RekamJejak> {
  try {
    const formData = new FormData();

    // Handle slug (jika ada, meskipun rekam jejak biasanya tidak menggunakan slug)
    if (data.slug) {
      formData.append("slug", data.slug);
    }

    // Handle urutan
    if (data.urutan !== undefined && data.urutan !== null) {
      formData.append("urutan", data.urutan.toString());
    }

    // Handle translations (format baru multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
      console.log("Mengirim translations ke API:", {
        jumlah: data.translations.length,
        bahasa: data.translations.map((t) => t.language_code),
      });
    } else if (data.judul && (data.isi || data.detail)) {
      // Backward compatibility: format lama akan dikonversi ke translations
      const defaultLang = getCurrentLanguage();
      formData.append(
        "translations",
        JSON.stringify([
          {
            language_code: defaultLang,
            judul: data.judul,
            isi: data.isi || data.detail || "",
          },
        ])
      );
    }

    // Foto (jika ada, meskipun rekam jejak biasanya tidak menggunakan foto)
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await apiClient.post<RekamJejakResponse>(
      "/api/rekam-jejak",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const result = response.data.data;
    // Map isi ke detail untuk backward compatibility
    if (result.isi && !result.detail) {
      result.detail = result.isi;
    }
    return result;
  } catch (error: any) {
    console.error("Error creating rekam jejak:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal membuat rekam jejak"
      );
    }
    throw new Error("Gagal membuat rekam jejak");
  }
}

/**
 * Update rekam jejak (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function updateRekamJejak(
  id: number,
  data: UpdateRekamJejakData
): Promise<RekamJejak> {
  try {
    const formData = new FormData();

    // Handle slug
    if (data.slug !== undefined) {
      formData.append("slug", data.slug);
    }

    // Handle translations (format baru multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    } else if (data.judul || data.isi || data.detail) {
      // Backward compatibility: format lama akan dikonversi ke translations
      const defaultLang = getCurrentLanguage();
      const translation: any = {
        language_code: defaultLang,
      };
      if (data.judul) translation.judul = data.judul;
      if (data.isi) translation.isi = data.isi;
      if (data.detail) translation.isi = data.detail;
      formData.append("translations", JSON.stringify([translation]));
    }

    // Foto
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await apiClient.put<RekamJejakResponse>(
      `/api/rekam-jejak/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const result = response.data.data;
    // Map isi ke detail untuk backward compatibility
    if (result.isi && !result.detail) {
      result.detail = result.isi;
    }
    return result;
  } catch (error: any) {
    console.error(`Error updating rekam jejak ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Rekam jejak tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate rekam jejak"
      );
    }
    throw new Error("Gagal mengupdate rekam jejak");
  }
}

/**
 * Delete rekam jejak (requires authentication)
 */
export async function deleteRekamJejak(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/rekam-jejak/${id}`);
  } catch (error: any) {
    console.error(`Error deleting rekam jejak ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Rekam jejak tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal menghapus rekam jejak"
      );
    }
    throw new Error("Gagal menghapus rekam jejak");
  }
}
