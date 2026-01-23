import apiClient from "@/lib/axios";
import {
  Logo,
  LogoResponse,
  LogoListResponse,
  CreateLogoData,
  UpdateLogoData,
  JenisLogo,
  JenisLogoResponse,
} from "@/types/logo";

/**
 * Get all logo (public) - untuk menampilkan semua logo
 */
export async function getAllLogo(): Promise<Logo[]> {
  try {
    const response = await apiClient.get<LogoListResponse>("/api/logo");
    
    // Handle response format yang berbeda-beda
    if (response.data) {
      // Jika response.data adalah array langsung
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Jika response.data memiliki property data
      if (response.data.data) {
        return Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
      }
    }
    
    return [];
  } catch (error: any) {
    console.error("Error fetching logo:", error);
    
    // Jika endpoint belum tersedia (404), return empty array
    if (error.response?.status === 404) {
      console.warn("Logo endpoint belum tersedia (404)");
      return [];
    }
    
    // Untuk error lainnya, return empty array agar tidak crash
    return [];
  }
}

/**
 * Get logo aktif saja (public)
 * Karena backend tidak punya filter is_active, langsung ambil semua logo
 */
export async function getActiveLogo(): Promise<Logo[]> {
  try {
    // Langsung ambil semua logo karena backend tidak punya filter is_active
    return await getAllLogo();
  } catch (error: any) {
    console.error("Error fetching active logo:", error);
    return [];
  }
}

/**
 * Get logo by ID
 */
export async function getLogoById(id: number): Promise<Logo> {
  try {
    const response = await apiClient.get<LogoResponse>(`/api/logo/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching logo ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Logo tidak ditemukan");
    }
    throw new Error("Gagal memuat data logo");
  }
}

/**
 * Get all jenis logo (untuk dropdown di form)
 */
export async function getAllJenisLogo(): Promise<JenisLogo[]> {
  try {
    const response = await apiClient.get<JenisLogoResponse>("/api/jenis-logo");
    if (response.data.data) {
      return Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];
    }
    return [];
  } catch (error: any) {
    console.error("Error fetching jenis logo:", error);
    if (error.response?.status === 404) {
      console.warn("Jenis logo endpoint belum tersedia (404)");
      return [];
    }
    return [];
  }
}

/**
 * Create new logo (requires authentication)
 */
export async function createLogo(data: CreateLogoData): Promise<Logo> {
  try {
    const formData = new FormData();
    formData.append("jenisLogoId", data.jenisLogoId.toString());
    formData.append("gambarLogo", data.gambarLogo);

    const response = await apiClient.post<LogoResponse>(
      "/api/logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating logo:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal membuat logo");
    }
    throw new Error("Gagal membuat logo");
  }
}

/**
 * Update logo (requires authentication)
 */
export async function updateLogo(
  id: number,
  data: UpdateLogoData
): Promise<Logo> {
  try {
    const formData = new FormData();
    if (data.jenisLogoId !== undefined) {
      formData.append("jenisLogoId", data.jenisLogoId.toString());
    }
    if (data.gambarLogo) {
      formData.append("gambarLogo", data.gambarLogo);
    }

    const response = await apiClient.put<LogoResponse>(
      `/api/logo/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating logo ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Logo tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal mengupdate logo"
      );
    }
    throw new Error("Gagal mengupdate logo");
  }
}

/**
 * Delete logo (requires authentication)
 */
export async function deleteLogo(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/logo/${id}`);
  } catch (error: any) {
    console.error(`Error deleting logo ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Logo tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal menghapus logo");
    }
    throw new Error("Gagal menghapus logo");
  }
}

