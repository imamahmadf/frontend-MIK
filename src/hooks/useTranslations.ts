"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { getTranslations, Translations } from "@/lib/translations";

/**
 * Hook untuk mendapatkan terjemahan berdasarkan bahasa saat ini
 * Menggunakan searchParams untuk server-side compatibility
 */
export function useTranslations(): Translations {
  const searchParams = useSearchParams();
  // Initial state selalu default ke "id" untuk menghindari hydration mismatch
  const [translations, setTranslations] = useState<Translations>(() => {
    return getTranslations("id");
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Update translations setelah mount dan ketika searchParams berubah
    if (mounted && typeof window !== "undefined") {
      try {
        const langFromUrl = searchParams?.get("lang");
        const lang =
          langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
            ? (langFromUrl as LanguageCode)
            : getCurrentLanguage();
        setTranslations(getTranslations(lang));
      } catch {
        setTranslations(getTranslations(getCurrentLanguage()));
      }
    }
  }, [searchParams, mounted]);

  return translations;
}
