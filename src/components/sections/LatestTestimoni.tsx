import Link from "next/link";
import Image from "next/image";
import { getAllTestimoni } from "@/lib/api/testimoni";
import { Testimoni } from "@/types/testimoni";
import { getLanguageFromSearchParams } from "@/lib/language";

interface LatestTestimoniProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function LatestTestimoni({
  searchParams,
}: LatestTestimoniProps) {
  let testimoniList: Testimoni[] = [];
  // Gunakan bahasa dari searchParams atau default ke "id"
  const lang = searchParams ? getLanguageFromSearchParams(searchParams) : "id";

  try {
    const response = await getAllTestimoni(1, 3, lang);
    testimoniList = response.data;
  } catch (err) {
    console.error("Error fetching latest testimoni:", err);
    // Jika error, tetap render section dengan pesan kosong
  }

  // Jika tidak ada testimoni, jangan render section
  if (testimoniList.length === 0) {
    return null;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  return (
    <section
      id="testimoni"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 border border-primary/30 dark:border-primary/50">
              <svg
                className="w-5 h-5 text-primary dark:text-primary-light"
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
              <span className="text-sm font-semibold text-primary dark:text-primary-light">
                Kata Mereka
              </span>
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
            Testimoni Terbaru
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dengarkan apa kata mereka tentang pengalaman mereka.
          </p>
        </div>

        {/* Testimoni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimoniList.map((item) => {
            // Preserve lang parameter in link
            const linkHref =
              lang && lang !== "id"
                ? `/testimoni/${item.id}?lang=${lang}`
                : `/testimoni/${item.id}`;

            // Truncate isi untuk preview
            const isiPreview =
              item.isi.length > 150
                ? item.isi.substring(0, 150) + "..."
                : item.isi;

            return (
              <Link
                key={item.id}
                href={linkHref}
                className="group block h-full"
              >
                <article className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {item.foto ? (
                    <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <Image
                        src={`${baseURL}${item.foto}`}
                        alt={item.nama}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-accent/10 dark:from-primary/20 dark:via-purple-500/20 dark:to-accent/20 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:bg-clip-text dark:group-hover:from-primary-light dark:group-hover:to-purple-400 transition-all duration-300">
                          {item.nama}
                        </h3>
                        {item.tempat && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {item.tempat}
                          </p>
                        )}
                      </div>
                      <div className="text-blue-500 dark:text-primary-light opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-5 line-clamp-4 flex-1 leading-relaxed">
                      {isiPreview}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-primary to-purple-600 dark:from-primary-light dark:to-purple-400 bg-clip-text text-transparent group-hover:gap-3 transition-all">
                        <span>Baca Selengkapnya</span>
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
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Link ke halaman testimoni lengkap */}
        <div className="mt-12 text-center">
          <Link
            href={
              lang && lang !== "id" ? `/testimoni?lang=${lang}` : "/testimoni"
            }
            className="btn btn-gradient-full btn-md btn-scale inline-flex items-center gap-2"
          >
            <span>Lihat Semua Testimoni</span>
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
