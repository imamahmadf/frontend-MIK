"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllBerita } from "@/lib/api/berita";
import { Berita } from "@/types/berita";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { useTranslations } from "@/hooks/useTranslations";

function BeritaContent() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const langFromUrl = searchParams?.get("lang");
      const lang: LanguageCode =
        langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();

      const response = await getAllBerita(1, 20, "", lang);
      setBeritaList(response.data);
    } catch (err) {
      setError(t.berita.error);
      console.error("Error fetching berita:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, t.berita.error]);

  useEffect(() => {
    if (mounted) {
      fetchBerita();
    }
  }, [mounted, searchParams, fetchBerita]);

  // Helper function untuk membuat href dengan lang parameter
  const createHref = (path: string) => {
    const lang = searchParams?.get("lang");
    return lang ? `${path}?lang=${lang}` : path;
  };

  const langFromUrl = searchParams?.get("lang");
  const lang: LanguageCode =
    langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
      ? (langFromUrl as LanguageCode)
      : getCurrentLanguage();

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  // Ambil gambar pertama dari berita untuk background (jika ada)
  const heroImage = beritaList.length > 0 
    ? (beritaList[0].fotos && beritaList[0].fotos.length > 0
        ? `${baseURL}${beritaList[0].fotos[0].foto}`
        : beritaList[0].foto
        ? `${baseURL}${beritaList[0].foto}`
        : null)
    : null;

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] min-h-[400px] max-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: heroImage 
              ? `url(${heroImage})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay untuk readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
        
        {/* Gradient overlay untuk depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/20 backdrop-blur-md border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span className="text-sm font-semibold text-white">
                {t.berita.badge}
              </span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            {t.berita.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t.berita.description}
          </p>
          {beritaList.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80">
              <div className="h-1 w-12 bg-gradient-to-r from-white to-white/50 rounded-full"></div>
              <span>
                {beritaList.length} {t.berita.available}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-light/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-red-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/5 rounded-full blur-2xl"></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-7xl">

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {t.berita.loading}
            </p>
          </div>
        ) : error ? (
          <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-800 dark:text-red-200 font-semibold">
                {error}
              </p>
            </div>
          </div>
        ) : beritaList.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-6 shadow-lg">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t.berita.empty}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t.berita.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {beritaList.map((item, index) => {
              // Format tanggal berdasarkan bahasa
              const localeMap: Record<LanguageCode, string> = {
                id: "id-ID",
                en: "en-US",
                ru: "ru-RU",
              };
              const tanggal = new Date(item.createdAt).toLocaleDateString(
                localeMap[lang],
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              // Strip HTML tags untuk ringkasan
              const plainText = item.isi.replace(/<[^>]*>/g, "");
              const ringkasan =
                plainText.length > 120
                  ? plainText.substring(0, 120) + "..."
                  : plainText;

              const baseURL =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
              // Prioritaskan foto pertama dari array fotos, fallback ke foto utama
              const fotoUrl =
                item.fotos && item.fotos.length > 0
                  ? `${baseURL}${item.fotos[0].foto}`
                  : item.foto
                  ? `${baseURL}${item.foto}`
                  : null;

              // Preserve lang parameter in link
              const linkHref = createHref(`/berita/${item.slug}`);

              return (
                <Link
                  key={item.id}
                  href={linkHref}
                  className="group block h-full"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <article className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] relative">
                    {/* Gradient Overlay pada Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-red-500/0 group-hover:from-blue-500/5 group-hover:to-red-500/5 transition-all duration-500 pointer-events-none"></div>

                    {/* Decorative Corner Element dengan News Icon */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-red-600 dark:text-red-400 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>

                    {/* Accent Line di Top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {fotoUrl ? (
                      <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                        <Image
                          src={fotoUrl}
                          alt={item.judul}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 to-transparent group-hover:from-blue-500/20 transition-all duration-500"></div>

                        {/* Date Badge Overlay */}
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-primary dark:text-primary-light"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {tanggal}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-red-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-red-500/20 flex items-center justify-center">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        <svg
                          className="w-16 h-16 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-primary dark:text-primary-light"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {tanggal}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-6 md:p-7 flex-1 flex flex-col relative z-10">
                      {!fotoUrl && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {tanggal}
                          </p>
                        </div>
                      )}

                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-red-600 group-hover:bg-clip-text dark:group-hover:from-blue-400 dark:group-hover:to-red-400 transition-all duration-300">
                        {item.judul}
                      </h2>

                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 flex-1 leading-relaxed">
                        {ringkasan}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-red-600 dark:from-blue-400 dark:to-red-400 bg-clip-text text-transparent group-hover:gap-3 transition-all">
                          <span>{t.berita.readMore}</span>
                          <svg
                            className="w-5 h-5 text-primary dark:text-primary-light group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg
                            className="w-4 h-4 text-primary dark:text-primary-light"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </section>
    </>
  );
}

export default function BeritaPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </section>
      }
    >
      <BeritaContent />
    </Suspense>
  );
}
