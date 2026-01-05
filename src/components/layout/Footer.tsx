"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { getTranslations, Translations } from "@/lib/translations";

function FooterContent() {
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const [t, setT] = useState<Translations>(() => getTranslations("id"));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        const langFromUrl = searchParams?.get("lang");
        const lang = langFromUrl
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();
        setT(getTranslations(lang));
      } catch {
        setT(getTranslations(getCurrentLanguage()));
      }
    }
  }, [searchParams, mounted]);

  return (
    <footer className="bg-neutral-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 mb-4 md:mb-0 font-medium">
            © {currentYear} Muhammad Iksan Kiat. {t.footer.rightsReserved}
          </p>
          <div className="flex space-x-6">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-accent transition-colors font-medium"
              aria-label="GitHub"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-accent transition-colors font-medium"
              aria-label="LinkedIn"
            >
              LinkedIn
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-accent transition-colors font-medium"
              aria-label="Twitter"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense
      fallback={
        <footer className="bg-neutral-900 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </footer>
      }
    >
      <FooterContent />
    </Suspense>
  );
}
