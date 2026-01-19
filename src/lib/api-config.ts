/**
 * Konfigurasi API Base URL
 * 
 * Helper function untuk mendapatkan base URL API yang konsisten
 * di seluruh aplikasi.
 * 
 * Prioritas:
 * 1. NEXT_PUBLIC_API_URL (environment variable)
 * 2. Production: https://api.muhammadiksankiat.id
 * 3. Development: http://localhost:7000
 */

export function getApiBaseURL(): string {
  // Jika ada environment variable, gunakan itu
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Jika production, gunakan URL production
  if (process.env.NODE_ENV === "production") {
    return "https://api.muhammadiksankiat.id";
  }
  
  // Default untuk development
  return "http://localhost:7000";
}

