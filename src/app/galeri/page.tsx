"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllGaleri } from "@/lib/api/galeri";
import { Galeri } from "@/types/galeri";
import GaleriGrid from "@/components/galeri/GaleriGrid";
import { useTranslations } from "@/hooks/useTranslations";

function GaleriContent() {
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchGaleri();
    }
  }, [mounted, searchParams]);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllGaleri(1, 20, "");
      setGaleriList(response.data);
    } catch (err) {
      setError("Gagal memuat data galeri");
      console.error("Error fetching galeri:", err);
    } finally {
      setLoading(false);
    }
  };

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  // Ambil gambar pertama dari galeri untuk background (jika ada)
  const heroImage = galeriList.length > 0 ? `${baseURL}${galeriList[0].foto}` : null;

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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-semibold text-white">
                {t.galeri.badge}
              </span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            {t.galeri.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t.galeri.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t.berita.loading}
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <GaleriGrid
          galeriList={galeriList}
          baseURL={baseURL}
          translations={t.galeri}
        />
      )}
      </section>
    </>
  );
}

export default function GaleriPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <div className="inline-block mb-4">
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </section>
      }
    >
      <GaleriContent />
    </Suspense>
  );
}
