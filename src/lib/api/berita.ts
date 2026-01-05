import apiClient from "@/lib/axios";
import {
  Berita,
  BeritaResponse,
  BeritaListResponse,
  CreateBeritaData,
  UpdateBeritaData,
} from "@/types/berita";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get all berita dengan pagination dan search
 */
export async function getAllBerita(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  lang?: LanguageCode
): Promise<BeritaListResponse> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<BeritaListResponse>("/api/berita", {
      params: { page, limit, search, lang: language },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching berita:", error);

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
        const response = await apiClient.get<BeritaListResponse>(
          "/api/berita",
          {
            params: { page, limit, search, lang: "id" },
          }
        );
        return response.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching berita dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data berita");
      }
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data berita"
      );
    }
    throw new Error("Gagal memuat data berita");
  }
}

/**
 * Get berita by ID
 */
export async function getBeritaById(
  id: number,
  lang?: LanguageCode
): Promise<Berita> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<BeritaResponse>(`/api/berita/${id}`, {
      params: { lang: language },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching berita ${id}:`, error);

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
        const response = await apiClient.get<BeritaResponse>(
          `/api/berita/${id}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching berita dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Berita tidak ditemukan");
        }
        throw new Error("Gagal memuat data berita");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    throw new Error("Gagal memuat data berita");
  }
}

/**
 * Get berita by slug
 */
export async function getBeritaBySlug(
  slug: string,
  lang?: LanguageCode
): Promise<Berita> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<BeritaResponse>(
      `/api/berita/slug/${slug}`,
      {
        params: { lang: language },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching berita by slug ${slug}:`, error);

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
        const response = await apiClient.get<BeritaResponse>(
          `/api/berita/slug/${slug}`,
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching berita dengan bahasa default:",
          retryError
        );
        if (retryError.response?.status === 404) {
          throw new Error("Berita tidak ditemukan");
        }
        throw new Error("Gagal memuat data berita");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    throw new Error("Gagal memuat data berita");
  }
}

/**
 * Create new berita (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function createBerita(data: CreateBeritaData): Promise<Berita> {
  try {
    const formData = new FormData();

    // Handle slug
    if (data.slug) {
      formData.append("slug", data.slug);
    }

    // Handle translations (format baru multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    } else if (data.judul && data.isi) {
      // Backward compatibility: format lama akan dikonversi ke translations
      const defaultLang = getCurrentLanguage();
      formData.append(
        "translations",
        JSON.stringify([
          {
            language_code: defaultLang,
            judul: data.judul,
            isi: data.isi,
          },
        ])
      );
    }

    // Foto utama
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    // Multiple foto
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((file) => {
        formData.append("fotos", file);
      });
    }

    const response = await apiClient.post<BeritaResponse>(
      "/api/berita",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating berita:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal membuat berita");
    }
    throw new Error("Gagal membuat berita");
  }
}

/**
 * Update berita (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function updateBerita(
  id: number,
  data: UpdateBeritaData
): Promise<Berita> {
  try {
    const formData = new FormData();

    // Handle slug
    if (data.slug !== undefined) {
      formData.append("slug", data.slug);
    }

    // Handle is_published
    if (data.is_published !== undefined) {
      formData.append("is_published", data.is_published.toString());
    }

    // Handle translations (format baru multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    } else if (data.judul || data.isi) {
      // Backward compatibility: format lama akan dikonversi ke translations
      const defaultLang = getCurrentLanguage();
      const translation: any = {
        language_code: defaultLang,
      };
      if (data.judul) translation.judul = data.judul;
      if (data.isi) translation.isi = data.isi;
      formData.append("translations", JSON.stringify([translation]));
    }

    // Foto utama
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    // Multiple foto
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((file) => {
        formData.append("fotos", file);
      });
    }

    const response = await apiClient.put<BeritaResponse>(
      `/api/berita/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating berita ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate berita"
      );
    }
    throw new Error("Gagal mengupdate berita");
  }
}

/**
 * Delete berita (requires authentication)
 */
export async function deleteBerita(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/berita/${id}`);
  } catch (error: any) {
    console.error(`Error deleting berita ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Berita tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal menghapus berita");
    }
    throw new Error("Gagal menghapus berita");
  }
}
