"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import fotoProfile from "@/assets/kakIksan.png";
import { getHero } from "@/lib/api/hero";
import type { Hero } from "@/types/hero";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

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

export default function Hero() {
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
    ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"}${
        heroData.foto
      }`
    : typeof fotoProfile === "string"
    ? fotoProfile
    : fotoProfile.src;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary-light/10 rounded-full blur-3xl animate-blob" />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/10 dark:bg-accent-light/10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s", animationDuration: "8s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-primary-light/5 dark:bg-primary/10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        />
      </div>

      {/* Diagonal Lines Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              currentColor 2px,
              currentColor 4px
            )`,
            backgroundSize: "40px 40px",
          }}
        />
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
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
