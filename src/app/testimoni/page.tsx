"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllTestimoni } from "@/lib/api/testimoni";
import { Testimoni } from "@/types/testimoni";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

function TestimoniContent() {
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchTestimoni();
    }
  }, [mounted, searchParams]);

  const fetchTestimoni = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get language from searchParams or default
      const langFromUrl = searchParams?.get("lang");
      const lang: LanguageCode =
        langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();

      const response = await getAllTestimoni(1, 100, lang);
      setTestimoniList(response.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data testimoni");
      console.error("Error fetching testimoni:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function untuk membuat href dengan lang parameter
  const createHref = (path: string) => {
    const lang = searchParams?.get("lang");
    return lang ? `${path}?lang=${lang}` : path;
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 md:mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200/50 dark:border-blue-800/50">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Kata Mereka
              </span>
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
            Testimoni
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Dengarkan apa kata mereka tentang pengalaman mereka
          </p>
        </div>

        {/* Testimoni Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        ) : testimoniList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Belum ada testimoni yang tersedia
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimoniList.map((testimoni) => (
              <Link
                key={testimoni.id}
                href={createHref(`/testimoni/${testimoni.id}`)}
                className="group"
              >
                <article className="h-full relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
                  {/* Quote Icon di Background */}
                  <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <svg
                      className="w-24 h-24 text-purple-500 dark:text-purple-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Foto dengan Circular Badge */}
                  {testimoni.foto && (
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <Image
                        src={`${
                          process.env.NEXT_PUBLIC_API_URL ||
                          "http://localhost:7000"
                        }${testimoni.foto}`}
                        alt={testimoni.nama}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Gradient overlay dengan accent purple */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent group-hover:from-purple-500/30 transition-all duration-300"></div>
                      {/* Quote Icon Badge */}
                      <div className="absolute bottom-4 left-4 bg-purple-500 dark:bg-purple-600 rounded-full p-2 shadow-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 relative">
                    {/* Quote Icon di atas konten */}
                    <div className="absolute -top-3 left-6 bg-purple-100 dark:bg-purple-900/30 rounded-full p-2">
                      <svg
                        className="w-4 h-4 text-purple-600 dark:text-purple-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {testimoni.nama}
                    </h3>
                    {testimoni.tempat && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {testimoni.tempat}
                      </p>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-4 italic relative pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                      {testimoni.isi}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
                      <span>Baca lebih lanjut</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function TestimoniPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
          </div>
        </section>
      }
    >
      <TestimoniContent />
    </Suspense>
  );
}
