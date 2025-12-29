import Link from "next/link";
import Image from "next/image";
import { getAllBerita } from "@/lib/api/berita";
import { Berita } from "@/types/berita";

export default async function LatestNews() {
  let beritaList: Berita[] = [];

  try {
    const response = await getAllBerita(1, 3, "");
    beritaList = response.data;
  } catch (err) {
    console.error("Error fetching latest news:", err);
    // Jika error, tetap render section dengan pesan kosong
  }

  // Jika tidak ada berita, jangan render section
  if (beritaList.length === 0) {
    return null;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  return (
    <section
      id="berita"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-red-500/10 dark:from-blue-500/20 dark:to-red-500/20 border border-blue-200/50 dark:border-blue-800/50">
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Informasi Terkini
              </span>
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
            Berita Terbaru
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dapatkan informasi terbaru tentang kegiatan dan pengumuman terkini.
          </p>
        </div>

        {/* Berita Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {beritaList.map((item, index) => {
            const tanggal = new Date(item.createdAt).toLocaleDateString(
              "id-ID",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );

            // Strip HTML tags untuk ringkasan
            const plainText = item.isi.replace(/<[^>]*>/g, "");
            const ringkasan =
              plainText.length > 100
                ? plainText.substring(0, 100) + "..."
                : plainText;

            // Prioritaskan foto pertama dari array fotos, fallback ke foto utama
            const fotoUrl =
              item.fotos && item.fotos.length > 0
                ? `${baseURL}${item.fotos[0].foto}`
                : item.foto
                ? `${baseURL}${item.foto}`
                : null;

            return (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="group block h-full"
              >
                <article className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {fotoUrl ? (
                    <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <Image
                        src={fotoUrl}
                        alt={item.judul}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
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
                    <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-red-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-red-500/20 flex items-center justify-center">
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
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

                  <div className="p-6 flex-1 flex flex-col">
                    {!fotoUrl && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {tanggal}
                        </p>
                      </div>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-red-600 group-hover:bg-clip-text dark:group-hover:from-blue-400 dark:group-hover:to-red-400 transition-all duration-300">
                      {item.judul}
                    </h3>

                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 flex-1 leading-relaxed">
                      {ringkasan}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-red-600 dark:from-blue-400 dark:to-red-400 bg-clip-text text-transparent group-hover:gap-3 transition-all">
                        <span>Baca Selengkapnya</span>
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Link ke halaman berita lengkap */}
        <div className="mt-12 text-center">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Lihat Semua Berita</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
