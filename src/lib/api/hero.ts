import apiClient from "@/lib/axios";
import {
  Hero,
  HeroResponse,
  HeroListResponse,
  CreateHeroData,
  UpdateHeroData,
} from "@/types/hero";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

/**
 * Get hero aktif untuk beranda (public)
 */
export async function getHero(lang?: LanguageCode): Promise<Hero> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<HeroResponse>("/api/hero", {
      params: { lang: language },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching hero:", error);

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
        const response = await apiClient.get<HeroResponse>("/api/hero", {
          params: { lang: "id" },
        });
        return response.data.data;
      } catch (retryError: any) {
        console.error("Error fetching hero dengan bahasa default:", retryError);
        throw new Error("Gagal memuat data hero");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Hero tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal memuat data hero");
    }
    throw new Error("Gagal memuat data hero");
  }
}

/**
 * Get all hero (admin)
 */
export async function getAllHero(lang?: LanguageCode): Promise<Hero[]> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<HeroListResponse>("/api/hero/all", {
      params: { lang: language },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all hero:", error);

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
        const response = await apiClient.get<HeroListResponse>(
          "/api/hero/all",
          {
            params: { lang: "id" },
          }
        );
        return response.data.data;
      } catch (retryError: any) {
        console.error(
          "Error fetching all hero dengan bahasa default:",
          retryError
        );
        throw new Error("Gagal memuat data hero");
      }
    }

    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal memuat data hero");
    }
    throw new Error("Gagal memuat data hero");
  }
}

/**
 * Get hero by ID
 */
export async function getHeroById(
  id: number,
  lang?: LanguageCode
): Promise<Hero> {
  try {
    const language = lang || getCurrentLanguage();
    const response = await apiClient.get<HeroResponse>(`/api/hero/${id}`, {
      params: { lang: language },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching hero ${id}:`, error);

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
        const response = await apiClient.get<HeroResponse>(`/api/hero/${id}`, {
          params: { lang: "id" },
        });
        return response.data.data;
      } catch (retryError: any) {
        console.error("Error fetching hero dengan bahasa default:", retryError);
        if (retryError.response?.status === 404) {
          throw new Error("Hero tidak ditemukan");
        }
        throw new Error("Gagal memuat data hero");
      }
    }

    if (error.response?.status === 404) {
      throw new Error("Hero tidak ditemukan");
    }
    throw new Error("Gagal memuat data hero");
  }
}

/**
 * Create new hero (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function createHero(data: CreateHeroData): Promise<Hero> {
  try {
    const formData = new FormData();

    // Handle translations (format baru multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    } else if (data.nama) {
      // Backward compatibility: format lama akan dikonversi ke translations
      const defaultLang = getCurrentLanguage();
      formData.append(
        "translations",
        JSON.stringify([
          {
            language_code: defaultLang,
            nama: data.nama,
            slogan: data.slogan || "",
            isi: data.isi || "",
          },
        ])
      );
    }

    // Handle foto upload
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    // Handle is_active
    if (data.is_active !== undefined) {
      formData.append("is_active", data.is_active.toString());
    }

    const response = await apiClient.post<HeroResponse>("/api/hero", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating hero:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal membuat hero");
    }
    throw new Error("Gagal membuat hero");
  }
}

/**
 * Update hero (requires authentication)
 * Mendukung format multi-language dengan translations array
 */
export async function updateHero(
  id: number,
  data: UpdateHeroData
): Promise<Hero> {
  try {
    const formData = new FormData();

    // Handle translations (format baru multi-language)
    if (data.translations && data.translations.length > 0) {
      formData.append("translations", JSON.stringify(data.translations));
    } else if (data.nama || data.slogan || data.isi) {
      // Backward compatibility: format lama akan dikonversi ke translations
      const defaultLang = getCurrentLanguage();
      const translation: any = {
        language_code: defaultLang,
      };
      if (data.nama) translation.nama = data.nama;
      if (data.slogan !== undefined) translation.slogan = data.slogan;
      if (data.isi !== undefined) translation.isi = data.isi;
      formData.append("translations", JSON.stringify([translation]));
    }

    // Handle foto upload
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    // Handle is_active
    if (data.is_active !== undefined) {
      formData.append("is_active", data.is_active.toString());
    }

    const response = await apiClient.put<HeroResponse>(
      `/api/hero/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating hero ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Hero tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal mengupdate hero");
    }
    throw new Error("Gagal mengupdate hero");
  }
}

/**
 * Delete hero (requires authentication)
 */
export async function deleteHero(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/hero/${id}`);
  } catch (error: any) {
    console.error(`Error deleting hero ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Hero tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal menghapus hero");
    }
    throw new Error("Gagal menghapus hero");
  }
}
