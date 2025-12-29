import apiClient from "@/lib/axios";
import {
  RekamJejak,
  RekamJejakResponse,
  RekamJejakListResponse,
  CreateRekamJejakData,
  UpdateRekamJejakData,
} from "@/types/rekamJejak";

/**
 * Get all rekam jejak dengan pagination dan search
 */
export async function getAllRekamJejak(
  page: number = 1,
  limit: number = 100,
  search: string = ""
): Promise<RekamJejakListResponse> {
  try {
    const response = await apiClient.get<RekamJejakListResponse>(
      "/api/rekam-jejak",
      {
        params: { page, limit, search },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching rekam jejak:", error);
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
export async function getRekamJejakById(id: number): Promise<RekamJejak> {
  try {
    const response = await apiClient.get<RekamJejakResponse>(
      `/api/rekam-jejak/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching rekam jejak ${id}:`, error);
    if (error.response?.status === 404) {
      throw new Error("Rekam jejak tidak ditemukan");
    }
    throw new Error("Gagal memuat data rekam jejak");
  }
}

/**
 * Create new rekam jejak (requires authentication)
 */
export async function createRekamJejak(
  data: CreateRekamJejakData
): Promise<RekamJejak> {
  try {
    // Map detail ke isi karena backend mengharapkan isi
    const payload: any = {
      judul: data.judul,
      isi: data.detail, // Backend mengharapkan field isi
    };
    if (data.urutan !== undefined && data.urutan !== null) {
      payload.urutan = data.urutan;
    }

    console.log(
      "📤 Sending data to backend:",
      JSON.stringify(payload, null, 2)
    );
    const response = await apiClient.post<RekamJejakResponse>(
      "/api/rekam-jejak",
      payload
    );
    console.log("✅ Response from backend:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error creating rekam jejak:", error);
    console.error("Error response:", error.response?.data);
    if (error.response) {
      const errorMessage =
        error.response.data?.message || "Gagal membuat rekam jejak";
      throw new Error(errorMessage);
    }
    throw new Error("Gagal membuat rekam jejak");
  }
}

/**
 * Update rekam jejak (requires authentication)
 */
export async function updateRekamJejak(
  id: number,
  data: UpdateRekamJejakData
): Promise<RekamJejak> {
  try {
    // Map detail ke isi karena backend mengharapkan isi
    const payload: any = {};
    if (data.judul !== undefined) {
      payload.judul = data.judul;
    }
    if (data.detail !== undefined) {
      payload.isi = data.detail; // Backend mengharapkan field isi
    }
    if (data.urutan !== undefined && data.urutan !== null) {
      payload.urutan = data.urutan;
    }

    console.log(
      `📤 Sending update data for ID ${id}:`,
      JSON.stringify(payload, null, 2)
    );
    const response = await apiClient.put<RekamJejakResponse>(
      `/api/rekam-jejak/${id}`,
      payload
    );
    console.log("✅ Response from backend:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error(`❌ Error updating rekam jejak ${id}:`, error);
    console.error("Error response:", error.response?.data);
    if (error.response?.status === 404) {
      throw new Error("Rekam jejak tidak ditemukan");
    }
    if (error.response) {
      const errorMessage =
        error.response.data?.message || "Gagal mengupdate rekam jejak";
      throw new Error(errorMessage);
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
