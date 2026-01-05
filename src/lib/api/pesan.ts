import apiClient from "@/lib/axios";
import {
  Pesan,
  PesanResponse,
  PesanListResponse,
  CreatePesanData,
  UpdatePesanData,
  PesanStatus,
} from "@/types/pesan";

/**
 * Get all pesan dengan pagination dan filter (requires authentication)
 */
export async function getAllPesan(
  page: number = 1,
  limit: number = 10,
  status?: PesanStatus,
  search?: string
): Promise<PesanListResponse> {
  try {
    const params: any = { page, limit };
    if (status) {
      params.status = status;
    }
    if (search) {
      params.search = search;
    }
    const response = await apiClient.get<PesanListResponse>("/api/pesan", {
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching pesan:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data pesan"
      );
    }
    throw new Error("Gagal memuat data pesan");
  }
}

/**
 * Get pesan by ID (requires authentication)
 */
export async function getPesanById(id: number): Promise<Pesan> {
  try {
    const response = await apiClient.get<PesanResponse>(`/api/pesan/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching pesan ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Pesan tidak ditemukan");
    }
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Gagal memuat data pesan"
      );
    }
    throw new Error("Gagal memuat data pesan");
  }
}

/**
 * Create new pesan (public endpoint untuk contact form)
 */
export async function createPesan(data: CreatePesanData): Promise<Pesan> {
  try {
    const response = await apiClient.post<PesanResponse>("/api/pesan", data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating pesan:", error);
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal mengirim pesan");
    }
    throw new Error("Gagal mengirim pesan");
  }
}

/**
 * Update pesan (requires authentication)
 */
export async function updatePesan(
  id: number,
  data: UpdatePesanData
): Promise<Pesan> {
  try {
    const response = await apiClient.put<PesanResponse>(
      `/api/pesan/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error updating pesan ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Pesan tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal mengupdate pesan");
    }
    throw new Error("Gagal mengupdate pesan");
  }
}

/**
 * Delete pesan (requires authentication)
 */
export async function deletePesan(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/pesan/${id}`);
  } catch (error: any) {
    console.error(`Error deleting pesan ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Pesan tidak ditemukan");
    }
    if (error.response) {
      throw new Error(error.response.data?.message || "Gagal menghapus pesan");
    }
    throw new Error("Gagal menghapus pesan");
  }
}

/**
 * Mark pesan as read (requires authentication)
 */
export async function markAsRead(id: number): Promise<Pesan> {
  try {
    const response = await apiClient.patch<PesanResponse>(
      `/api/pesan/${id}/read`
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error marking pesan ${id} as read:`, error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error request:", error.request);

    if (error.response) {
      // Server responded with error status
      if (error.response.status === 404) {
        throw new Error("Pesan tidak ditemukan");
      }
      if (error.response.status === 401) {
        throw new Error("Tidak terautentikasi. Silakan login kembali.");
      }
      if (error.response.status === 405) {
        throw new Error(
          "Method tidak didukung. Pastikan backend server sudah di-restart setelah perubahan route."
        );
      }
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Gagal menandai pesan sebagai dibaca (Status: ${error.response.status})`;
      throw new Error(errorMessage);
    }
    if (error.request) {
      // Request was made but no response received
      console.error("No response received. Request details:", error.request);
      throw new Error(
        "Tidak dapat terhubung ke server. Pastikan backend server sedang berjalan."
      );
    }
    throw new Error(error.message || "Gagal menandai pesan sebagai dibaca");
  }
}

/**
 * Mark pesan as replied (requires authentication)
 */
export async function markAsReplied(id: number): Promise<Pesan> {
  try {
    const response = await apiClient.patch<PesanResponse>(
      `/api/pesan/${id}/replied`
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error marking pesan ${id} as replied:`, error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error request:", error.request);

    if (error.response) {
      // Server responded with error status
      if (error.response.status === 404) {
        throw new Error("Pesan tidak ditemukan");
      }
      if (error.response.status === 401) {
        throw new Error("Tidak terautentikasi. Silakan login kembali.");
      }
      if (error.response.status === 405) {
        throw new Error(
          "Method tidak didukung. Pastikan backend server sudah di-restart setelah perubahan route."
        );
      }
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Gagal menandai pesan sebagai dibalas (Status: ${error.response.status})`;
      throw new Error(errorMessage);
    }
    if (error.request) {
      // Request was made but no response received
      console.error("No response received. Request details:", error.request);
      throw new Error(
        "Tidak dapat terhubung ke server. Pastikan backend server sedang berjalan."
      );
    }
    throw new Error(error.message || "Gagal menandai pesan sebagai dibalas");
  }
}
