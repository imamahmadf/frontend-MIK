import Image from "next/image";
import Link from "next/link";
import { getAllGaleri } from "@/lib/api/galeri";
import { Galeri } from "@/types/galeri";
import GaleriCarouselClient from "./GaleriCarouselClient";

export default async function GaleriCarousel() {
  let galeriList: Galeri[] = [];

  try {
    const response = await getAllGaleri(1, 10, "");
    galeriList = response.data;
  } catch (err) {
    console.error("Error fetching galeri:", err);
    // Jika error, tetap render section dengan pesan kosong
  }

  // Jika tidak ada galeri, jangan render section
  if (galeriList.length === 0) {
    return null;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  return (
    <section
      id="galeri"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-primary-light/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border border-primary/30 dark:border-primary/50">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-primary-dark to-gray-900 dark:from-white dark:via-primary-light dark:to-white bg-clip-text text-transparent">
            Galeri Foto
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dokumentasi kegiatan dan pencapaian dalam bentuk foto.
          </p>
        </div>

        {/* Carousel Container */}
        <GaleriCarouselClient galeriList={galeriList} baseURL={baseURL} />

        {/* Link ke halaman galeri lengkap */}
        <div className="mt-12 text-center">
          <Link href="/galeri" className="btn btn-primary btn-lg btn-lift">
            <span>Lihat Semua Foto</span>
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
