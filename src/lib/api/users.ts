import apiClient from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/**
 * Fetch semua users dari API
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    // Jika endpoint tidak tersedia (404), return empty array instead of throwing
    if (error?.response?.status === 404) {
      console.warn("Endpoint /users tidak tersedia. Mengembalikan array kosong.");
      return [];
    }
    throw new Error("Gagal memuat data users");
  }
}

/**
 * Fetch user berdasarkan ID
 */
export async function fetchUserById(id: number): Promise<User> {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching user ${id}:`, error);
    // Jika endpoint tidak tersedia (404), throw error untuk trigger notFound()
    if (error?.response?.status === 404) {
      throw new Error(`User dengan ID ${id} tidak ditemukan`);
    }
    throw new Error(`Gagal memuat data user dengan ID ${id}`);
  }
}
