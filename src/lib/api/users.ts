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
  } catch (error) {
    console.error("Error fetching users:", error);
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
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw new Error(`Gagal memuat data user dengan ID ${id}`);
  }
}
