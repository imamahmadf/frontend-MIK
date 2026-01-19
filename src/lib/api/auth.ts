import apiClient from "@/lib/axios";
import { LoginCredentials, AuthResponse, User } from "@/types/auth";

/**
 * Login user dengan API backend
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    // Menggunakan apiClient yang sudah dikonfigurasi dengan baseURL
    const baseURL = apiClient.defaults.baseURL || "http://localhost:7000";
    const url = `${baseURL}/api/auth/login`;

    console.log("🔐 Attempting login to:", url);
    console.log("📤 Request payload:", {
      username: credentials.username,
      password: "***",
    });

    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );

    console.log("✅ Login successful:", response.data);
    // Response dari backend sudah sesuai format AuthResponse
    return response.data;
  } catch (error: any) {
    // Handle error dari backend
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.message || "Terjadi kesalahan saat login";
      console.error(
        "❌ Server error:",
        error.response.status,
        error.response.data
      );
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      const baseURL = apiClient.defaults.baseURL || "http://localhost:7000";
      console.error("❌ Network error - No response from server");
      console.error("📍 Attempted URL:", `${baseURL}/api/auth/login`);
      console.error("🔍 Error details:", error.message);
      console.error("💡 Tips: Pastikan backend berjalan di", baseURL);
      throw new Error(
        `Tidak dapat terhubung ke server. Pastikan backend berjalan di ${baseURL}`
      );
    } else {
      // Something else happened
      console.error("❌ Error:", error.message);
      throw new Error(error.message || "Terjadi kesalahan saat login");
    }
  }
}

/**
 * Get current user dari API backend
 */
export async function getCurrentUserFromAPI(): Promise<User | null> {
  try {
    const response = await apiClient.get<{ user: User }>("/api/auth/me");
    return response.data.user;
  } catch (error) {
    return null;
  }
}

/**
 * Logout - clear storage
 */
export function logout(): void {
  // localStorage akan di-clear di Redux slice
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}
