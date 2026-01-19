"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import fotoProfile from "@/assets/kakIksan.png";
import { getHero } from "@/lib/api/hero";
import type { Hero } from "@/types/hero";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { getApiBaseURL } from "@/lib/api-config";

function HeroFallback() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white via-primary/5 to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:via-primary/10 dark:to-neutral-900"
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="text-center md:text-right order-2 md:order-1">
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        <div className="mt-12 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroContent() {

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

function TypingText({
  text,
  speed = 200,
  delay = 0,
  className = "",
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (isStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, isStarted]);

  const isComplete = currentIndex >= text.length;

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

  const searchParams = useSearchParams();
  const [heroData, setHeroData] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero data ketika bahasa berubah
  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dapatkan bahasa dari URL atau localStorage
        const langFromUrl = searchParams?.get("lang");
        const lang: LanguageCode =
          langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
            ? (langFromUrl as LanguageCode)
            : getCurrentLanguage();

        const data = await getHero(lang);
        setHeroData(data);
      } catch (err: any) {
        console.error("Error fetching hero:", err);
        setError(err.message || "Gagal memuat data hero");
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [searchParams]);

  // Split nama menjadi dua bagian untuk efek typing
  const namaParts = heroData?.nama
    ? heroData.nama.split(" ").filter((part) => part.trim())
    : ["Muhammad", "Iksan Kiat"];

  const firstName = namaParts[0] || "Muhammad";
  const lastName = namaParts.slice(1).join(" ") || "Iksan Kiat";

  // Get foto URL
  const fotoUrl = heroData?.foto
    ? `${getApiBaseURL()}${heroData.foto}`
    : typeof fotoProfile === "string"
    ? fotoProfile
    : fotoProfile.src;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white via-primary/5 to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:via-primary/10 dark:to-neutral-900"
    >
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent via-accent/5 to-primary-light/8 dark:from-primary/15 dark:via-transparent dark:via-accent/8 dark:to-primary-light/15" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/3 to-primary/5 dark:from-transparent dark:via-accent/6 dark:to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-light/5 via-transparent to-accent/4 dark:from-primary-light/8 dark:via-transparent dark:to-accent/6" />
      </div>

      {/* Enhanced Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-primary-light/15 to-transparent dark:from-primary/25 dark:via-primary-light/20 rounded-full blur-3xl animate-blob opacity-60" />
        <div
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-accent/20 via-accent-light/15 to-transparent dark:from-accent/25 dark:via-accent-light/20 rounded-full blur-3xl animate-blob opacity-60"
          style={{ animationDelay: "2s", animationDuration: "8s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-light/15 via-accent/10 to-transparent dark:from-primary-light/20 dark:via-accent/15 rounded-full blur-3xl animate-blob opacity-50"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-tr from-accent-light/12 via-primary/8 to-transparent dark:from-accent-light/18 dark:via-primary/12 rounded-full blur-3xl animate-blob opacity-40"
          style={{ animationDelay: "6s", animationDuration: "12s" }}
        />
      </div>

      {/* Geometric Pattern - Hexagons */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated Circles Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/10 dark:border-primary/20 rounded-full animate-float" />
        <div
          className="absolute bottom-32 right-20 w-24 h-24 border border-accent/10 dark:border-accent/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-20 w-16 h-16 border border-primary-light/10 dark:border-primary-light/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-20 h-20 border border-accent-light/10 dark:border-accent-light/20 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Radial Gradient Overlay untuk Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.01)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Nama di kiri foto */}
          <div className="text-center md:text-right order-2 md:order-1">
            {loading ? (
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400">
                <p className="text-sm">{error}</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4 mt-4">
                  <span className="text-primary dark:text-primary-light">
                    <TypingText text={firstName} speed={100} />
                  </span>
                </h1>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
                  <span className="text-primary dark:text-primary-light">
                    <TypingText text={lastName} speed={100} delay={900} />
                  </span>
                </h1>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
                  <span className="text-primary dark:text-primary-light">
                    <TypingText text={firstName} speed={100} />
                  </span>
                </h1>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
                  <span className="text-primary dark:text-primary-light">
                    <TypingText text={lastName} speed={100} delay={900} />
                  </span>
                </h1>
              </>
            )}
          </div>

          {/* Foto di kanan */}
          <div className="order-1 md:order-2">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 group">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 via-accent/20 to-primary-light/30 rounded-lg blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse" />

              {/* Image container */}
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                {loading ? (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                  <Image
                    src={fotoUrl}
                    alt={heroData?.nama || "Muhammad Iksan Kiat"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                    unoptimized={
                      typeof fotoUrl === "string" && fotoUrl.startsWith("http")
                    }
                  />
                )}
                {/* Overlay gradient untuk depth */}
                <div className="absolute inset-0 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi di bawah */}
        <div className="mt-12 text-center max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ) : (
            <>
              {heroData?.slogan && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                  {heroData.slogan}
                </h2>
              )}
              {heroData?.isi && (
                <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-10 leading-relaxed">
                  {heroData.isi}
                </p>
              )}
              {!heroData?.slogan && !heroData?.isi && !error && (
                <>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                    Sebuah Perjalanan Anak Muda dan Energi untuk Indonesia
                  </h2>
                  <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-10 leading-relaxed">
                    Dari sebuah pulau di timur Indonesia, Pulau Buru di Provinsi
                    Maluku, perjalanan itu dimulai. Di tempat yang jauh dari
                    hiruk-pikuk kota besar, Muhamad Iksan Kiat tumbuh dengan
                    satu keyakinan sederhana: anak muda harus berani bermimpi
                    dan pulang membawa manfaat.
                  </p>
                </>
              )}
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn btn-primary btn-lg btn-lift">
              Hubungi Saya
            </a>
            <a href="/biografi" className="btn btn-secondary btn-lg">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <Suspense fallback={<HeroFallback />}>
      <HeroContent />
    </Suspense>
  );
}
