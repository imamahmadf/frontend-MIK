"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllFaktaUnik } from "@/lib/api/faktaUnik";
import type { FaktaUnik } from "@/types/faktaUnik";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { useTranslations } from "@/hooks/useTranslations";

function FaktaUnikContent() {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [faktaUnikData, setFaktaUnikData] = useState<FaktaUnik[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch fakta unik data ketika bahasa berubah
  useEffect(() => {
    const fetchFaktaUnik = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dapatkan bahasa dari URL atau localStorage
        const langFromUrl = searchParams?.get("lang");
        const lang: LanguageCode =
          langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
            ? (langFromUrl as LanguageCode)
            : getCurrentLanguage();

        const data = await getAllFaktaUnik(lang);
        setFaktaUnikData(data);
      } catch (err: any) {
        console.error("Error fetching fakta unik:", err);
        setError(err.message || "Gagal memuat data fakta unik");
      } finally {
        setLoading(false);
      }
    };

    fetchFaktaUnik();
  }, [searchParams]);

  // Intersection Observer untuk trigger animasi saat section masuk viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fakta-unik"
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
          {t.faktaUnik.title}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg animate-pulse"
              >
                <div className="text-center">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          </div>
        ) : faktaUnikData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              Belum ada data fakta unik tersedia
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faktaUnikData.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  animation: isVisible
                    ? `slide-in-right 0.8s ease-out ${index * 150}ms forwards`
                    : "none",
                  transform: isVisible ? "translateX(0)" : "translateX(100px)",
                }}
              >
                <div className="text-center">
                  {/* Angka dan Satuan */}
                  <div className="mb-4">
                    <span className="text-5xl md:text-6xl font-bold text-primary dark:text-primary-light">
                      {item.angka}
                    </span>
                    {item.satuan && (
                      <span className="text-2xl md:text-3xl font-semibold text-primary dark:text-primary-light ml-1">
                        {item.satuan}
                      </span>
                    )}
                  </div>

                  {/* Penjelasan */}
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
                    {item.isi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function FaktaUnik() {
  return (
    <Suspense
      fallback={
        <section
          id="fakta-unik"
          className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
              Fakta Unik
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg animate-pulse"
                >
                  <div className="text-center">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }
    >
      <FaktaUnikContent />
    </Suspense>
  );
}
