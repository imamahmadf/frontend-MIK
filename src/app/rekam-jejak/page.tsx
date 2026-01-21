"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAllRekamJejak } from "@/lib/api/rekamJejak";
import { getHero } from "@/lib/api/hero";
import { RekamJejak } from "@/types/rekamJejak";
import { Hero } from "@/types/hero";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { getApiBaseURL } from "@/lib/api-config";
import { useTranslations } from "@/hooks/useTranslations";
import HeroImage from "@/components/biografi/HeroImage";

function RekamJejakContent() {
  const [rekamJejak, setRekamJejak] = useState<RekamJejak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRekamJejak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get language from searchParams or default
      const langFromUrl = searchParams?.get("lang");
      const lang: LanguageCode =
        langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();

      const response = await getAllRekamJejak(1, 100, "", lang);
      // Sort by urutan if available, otherwise by id
      const sorted = response.data.sort((a, b) => {
        if (a.urutan !== undefined && b.urutan !== undefined) {
          return a.urutan - b.urutan;
        }
        return a.id - b.id;
      });
      setRekamJejak(sorted);
    } catch (err: any) {
      setError(err.message || t.rekamJejak.error);
      console.error("Error fetching rekam jejak:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, t.rekamJejak.error]);

  useEffect(() => {
    if (mounted) {
      fetchRekamJejak();
    }
  }, [mounted, searchParams, fetchRekamJejak]);

  // Ambil hero data untuk background image
  const [heroData, setHeroData] = useState<Hero | null>(null);
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const langFromUrl = searchParams?.get("lang");
        const lang: LanguageCode =
          langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
            ? (langFromUrl as LanguageCode)
            : getCurrentLanguage();
        const hero = await getHero(lang);
        setHeroData(hero);
      } catch (err) {
        // Jika hero tidak ditemukan, gunakan fallback gradient
        console.log("Hero tidak ditemukan, menggunakan gradient fallback");
      }
    };
    if (mounted) {
      fetchHero();
    }
  }, [mounted, searchParams]);

  // Calculate hero image URL - hanya setelah mounted untuk menghindari hydration mismatch
  const baseURL = mounted ? getApiBaseURL() : '';
  const heroImage = mounted && heroData?.foto ? `${baseURL}${heroData.foto}` : null;

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative h-[35vh] min-h-[280px] max-h-[450px] flex items-center justify-center overflow-hidden"
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
          suppressHydrationWarning
        />
        
        {/* Overlay untuk readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
        
        {/* Gradient overlay untuk depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto h-full">
          {/* Text Content - Tetap di tengah layar sebagai patokan */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center w-full max-w-2xl mx-auto">
              <div className="inline-block mb-4 animate-fade-in-up" style={{ animationDelay: '1.7s', animationFillMode: 'both' }}>
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-white">
                    {t.nav.timeline}
                  </span>
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white animate-fade-in-up" style={{ animationDelay: '1.9s', animationFillMode: 'both' }}>
                {t.rekamJejak.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '2.1s', animationFillMode: 'both' }}>
                {t.rekamJejak.description}
              </p>
            </div>
          </div>

          {/* Image - Di samping kanan text, rapat ke bagian paling bawah hero, tinggi memenuhi hero */}
          <div className="absolute right-4 md:right-8 lg:right-16 xl:right-24 top-16 md:top-20 lg:top-24 bottom-0 hidden md:block">
            <HeroImage alt={t.rekamJejak.title || "Rekam Jejak"} fullHeight={true} />
          </div>
          
          {/* Image untuk mobile - di tengah bawah */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:hidden">
            <HeroImage alt={t.rekamJejak.title || "Rekam Jejak"} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-5xl">
        {/* Timeline Container */}
        <div className="relative pl-12 md:pl-16">
          {/* Garis Timeline Vertikal */}
          <div className="absolute left-4 md:left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500"></div>

          {/* Timeline Items */}
          {!mounted || loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {t.rekamJejak.loading}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : rekamJejak.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {t.rekamJejak.empty}
              </p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {rekamJejak.map((item, index) => (
                <div key={item.id} className="relative flex items-start">
                  {/* Bulatan Indikator */}
                  <div className="absolute -left-8 md:-left-10 top-0 z-10 flex-shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900">
                      <span className="text-white font-bold text-xs md:text-sm">
                        {item.urutan !== undefined ? item.urutan : index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1">
                    <article className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-primary transition-all duration-200">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2.5 leading-tight">
                        {item.judul}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.isi || item.detail || ""}
                      </p>
                    </article>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Footer Message */}
      <div className="mt-12 md:mt-16 text-center">
        <div className="inline-block px-5 py-4 md:px-8 md:py-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed italic">
            {t.rekamJejak.footerMessage}
          </p>
        </div>
      </div>
      </section>
    </>
  );
}

export default function RekamJejakPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-5xl">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </section>
      }
    >
      <RekamJejakContent />
    </Suspense>
  );
}
