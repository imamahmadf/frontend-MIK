"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { getCurrentLanguage, setLanguage, LanguageCode } from "@/lib/language";
import flagId from "@/assets/id.png";
import flagEn from "@/assets/eng.png";
import flagRu from "@/assets/ru.png";

const languages: {
  code: LanguageCode;
  name: string;
  flag: string;
  flagImage: StaticImageData;
}[] = [
  { code: "id", name: "Indonesia", flag: "🇮🇩", flagImage: flagId },
  { code: "en", name: "English", flag: "🇬🇧", flagImage: flagEn },
  { code: "ru", name: "Русский", flag: "🇷🇺", flagImage: flagRu },
];

function LanguageSwitcherContent() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("id");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get current language from URL params or localStorage
    const langFromUrl = searchParams.get("lang");
    if (langFromUrl && languages.some((l) => l.code === langFromUrl)) {
      setCurrentLang(langFromUrl as LanguageCode);
      setLanguage(langFromUrl as LanguageCode);
    } else {
      const lang = getCurrentLanguage();
      setCurrentLang(lang);
    }
  }, [searchParams]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);

    // Update URL dengan query parameter lang
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", langCode);

    // Navigate dengan query parameter baru
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  const currentLanguage =
    languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium text-neutral-700 dark:text-neutral-300"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <div className="relative w-5 h-5 rounded-sm overflow-hidden flex-shrink-0">
          <Image
            src={currentLanguage.flagImage}
            alt={currentLanguage.name}
            fill
            className="object-cover"
            sizes="20px"
          />
        </div>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay untuk menutup dropdown saat klik di luar */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl py-1 z-50 border border-neutral-200 dark:border-neutral-700">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors ${
                  currentLang === lang.code
                    ? "bg-primary/10 text-primary dark:text-primary-light font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
                <div className="relative w-6 h-6 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                  <Image
                    src={lang.flagImage}
                    alt={lang.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
                <span className="flex-1">{lang.name}</span>
                {currentLang === lang.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary dark:text-primary-light"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LanguageSwitcher() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm">
          <div className="w-5 h-5 bg-neutral-300 dark:bg-neutral-600 rounded-sm animate-pulse"></div>
          <span className="hidden sm:inline">Loading...</span>
        </div>
      }
    >
      <LanguageSwitcherContent />
    </Suspense>
  );
}
