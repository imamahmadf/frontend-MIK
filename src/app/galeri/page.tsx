import type { Metadata } from "next";
import { getAllGaleri } from "@/lib/api/galeri";
import { Galeri } from "@/types/galeri";
import GaleriGrid from "@/components/galeri/GaleriGrid";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Kumpulan dokumentasi foto dan video.",
};

export default async function GaleriPage() {
  let galeriList: Galeri[] = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    const response = await getAllGaleri(1, 20, "");
    galeriList = response.data;
    currentPage = response.pagination.page;
    totalPages = response.pagination.totalPages;
  } catch (err) {
    console.error("Error fetching galeri:", err);
    // Jika error, tetap render section dengan pesan kosong
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-red-500/10 dark:from-blue-500/20 dark:to-red-500/20 border border-blue-200/50 dark:border-blue-800/50">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-semibold text-primary dark:text-primary-light">
              Dokumentasi
            </span>
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
          Galeri Foto
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Kumpulan dokumentasi foto yang merekam aktivitas dan pencapaian.
        </p>
      </div>

      <GaleriGrid galeriList={galeriList} baseURL={baseURL} />
    </section>
  );
}
