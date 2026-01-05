/**
 * Utility functions untuk menangani bahasa multi-language
 */

export type LanguageCode = "id" | "en" | "ru";

/**
 * Mendapatkan bahasa saat ini dari berbagai sumber
 * Priority: query param > localStorage > default (id)
 */
export function getCurrentLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return "id"; // Default untuk SSR
  }

  // 1. Cek dari query parameter URL
  const urlParams = new URLSearchParams(window.location.search);
  const langFromQuery = urlParams.get("lang");
  if (langFromQuery && isValidLanguageCode(langFromQuery)) {
    return langFromQuery as LanguageCode;
  }

  // 2. Cek dari localStorage
  const langFromStorage = localStorage.getItem("language");
  if (langFromStorage && isValidLanguageCode(langFromStorage)) {
    return langFromStorage as LanguageCode;
  }

  // 3. Default ke bahasa Indonesia
  return "id";
}

/**
 * Menyimpan bahasa ke localStorage
 */
export function setLanguage(lang: LanguageCode): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lang);
  }
}

/**
 * Validasi apakah code bahasa valid
 */
function isValidLanguageCode(code: string): code is LanguageCode {
  return ["id", "en", "ru"].includes(code);
}

/**
 * Mendapatkan bahasa dari query parameter (untuk server components)
 */
export function getLanguageFromSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): LanguageCode {
  const lang = searchParams.lang;
  if (typeof lang === "string" && isValidLanguageCode(lang)) {
    return lang;
  }
  return "id";
}
