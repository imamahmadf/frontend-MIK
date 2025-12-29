"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import fotoProfile from "@/assets/kakIksan.png";

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
              <span className="text-primary dark:text-primary-light">
                <TypingText text="Muhammad" speed={100} />
              </span>
            </h1>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
              <span className="text-primary dark:text-primary-light">
                <TypingText text="Iksan Kiat" speed={100} delay={900} />
              </span>
            </h1>
          </div>

          {/* Foto di kanan */}
          <div className="order-1 md:order-2">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 group">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 via-accent/20 to-primary-light/30 rounded-lg blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse" />

              {/* Image container */}
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={fotoProfile}
                  alt="Muhammad Iksan Kiat"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                {/* Overlay gradient untuk depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi di bawah */}
        <div className="mt-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
            Sebuah Perjalanan Anak Muda dan Energi untuk Indonesia
          </h2>
          <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-10 leading-relaxed">
            Dari sebuah pulau di timur Indonesia, Pulau Buru di Provinsi Maluku,
            perjalanan itu dimulai. Di tempat yang jauh dari hiruk-pikuk kota
            besar, Muhamad Iksan Kiat tumbuh dengan satu keyakinan sederhana:
            anak muda harus berani bermimpi dan pulang membawa manfaat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Hubungi Saya
            </a>
            <a
              href="/biografi"
              className="px-8 py-3.5 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border-2 border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
