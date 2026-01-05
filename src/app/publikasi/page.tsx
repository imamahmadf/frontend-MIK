"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPublikasi } from "@/lib/api/publikasi";
import { getAllTemaPublikasi } from "@/lib/api/temaPublikasi";
import { Publikasi, TemaPublikasi } from "@/types/publikasi";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

function PublikasiContent() {
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [temaList, setTemaList] = useState<TemaPublikasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedTema, setSelectedTema] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const temaIdFromUrl = searchParams?.get("tema");
      if (temaIdFromUrl) {
        setSelectedTema(parseInt(temaIdFromUrl));
      }
      fetchTemaList();
    }
  }, [mounted, searchParams]);

  useEffect(() => {
    if (mounted) {
      fetchPublikasi();
    }
  }, [mounted, selectedTema, page, searchParams]);

  const fetchTemaList = async () => {
    try {
      const langFromUrl = searchParams?.get("lang");
      const lang: LanguageCode =
        langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();
      const temas = await getAllTemaPublikasi(lang);
      setTemaList(temas);
    } catch (err) {
      console.error("Error fetching tema:", err);
    }
  };

  const fetchPublikasi = async () => {
    try {
      setLoading(true);
      setError(null);

      const langFromUrl = searchParams?.get("lang");
      const lang: LanguageCode =
        langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();

      const response = await getAllPublikasi(
        page,
        12,
        selectedTema || undefined,
        lang
      );
      setPublikasiList(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data publikasi");
      console.error("Error fetching publikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function untuk membuat href dengan lang parameter
  const createHref = (path: string, temaId?: number | null) => {
    const lang = searchParams?.get("lang");
    const params = new URLSearchParams();
    if (lang) params.set("lang", lang);
    if (temaId) params.set("tema", temaId.toString());
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const handleTemaChange = (temaId: number | null) => {
    setSelectedTema(temaId);
    setPage(1);
    // Update URL tanpa reload
    const newHref = createHref("/publikasi", temaId);
    window.history.pushState({}, "", newHref);
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Karya Tulis & Riset
              </span>
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
            Publikasi
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Daftar karya tulis, riset, atau artikel yang telah diterbitkan.
          </p>
        </div>

        {/* Filter Tema */}
        {temaList.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleTemaChange(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedTema === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Semua Tema
            </button>
            {temaList.map((tema) => (
              <button
                key={tema.id}
                onClick={() => handleTemaChange(tema.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedTema === tema.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {tema.nama}
              </button>
            ))}
          </div>
        )}

        {/* Publikasi Grid */}
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
        ) : publikasiList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTema
                ? "Tidak ada publikasi untuk tema ini"
                : "Belum ada publikasi yang tersedia"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {publikasiList.map((publikasi) => (
                <article
                  key={publikasi.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-400 border-r border-t border-b border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-blue-500 dark:bg-blue-600 rounded-lg p-2 shadow-lg">
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Foto */}
                  {publikasi.foto && (
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <Image
                        src={`${
                          process.env.NEXT_PUBLIC_API_URL ||
                          "http://localhost:7000"
                        }${publikasi.foto}`}
                        alt={publikasi.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Gradient overlay untuk accent */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 group-hover:to-blue-500/20 transition-all duration-300"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Tema */}
                    {publikasi.tema && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          {publikasi.tema.nama}
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {publikasi.judul}
                    </h3>

                    {publikasi.ringkasan && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {publikasi.ringkasan}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {publikasi.tanggal && (
                        <span className="flex items-center gap-1.5">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(publikasi.tanggal).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>

                    {publikasi.link && (
                      <a
                        href={publikasi.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm group/link"
                      >
                        Baca Selengkapnya
                        <svg
                          className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default function PublikasiPage() {
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
      <PublikasiContent />
    </Suspense>
  );
}
