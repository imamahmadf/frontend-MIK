"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Galeri } from "@/types/galeri";
import { LanguageCode } from "@/lib/language";
import { useTranslations } from "@/hooks/useTranslations";

interface GaleriCarouselClientProps {
  galeriList: Galeri[];
  baseURL: string;
  lang: LanguageCode;
}

export default function GaleriCarouselClient({
  galeriList,
  baseURL,
  lang,
}: GaleriCarouselClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<Galeri | null>(null);
  const t = useTranslations();

  // Format tanggal berdasarkan bahasa
  const localeMap: Record<LanguageCode, string> = {
    id: "id-ID",
    en: "en-US",
    ru: "ru-RU",
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || galeriList.length === 0) return;

    let animationId: number;
    let isPaused = false;
    let singleSetWidth = 0;

    // Wait for layout to be ready
    const initScroll = () => {
      const firstItem = container.querySelector(
        ".carousel-item"
      ) as HTMLElement;
      if (!firstItem) {
        requestAnimationFrame(initScroll);
        return;
      }

      // Calculate single set width (width of one complete set of items)
      const itemWidth = firstItem.offsetWidth;
      const gap = 24; // gap-6 = 1.5rem = 24px
      singleSetWidth = galeriList.length * (itemWidth + gap);

      // Start from the beginning of the second duplicate set
      // This allows seamless looping - when we reach the end, we reset to start of second set
      container.scrollLeft = singleSetWidth;

      // Auto scroll function
      const scroll = () => {
        if (container && !isPaused && singleSetWidth > 0) {
          container.scrollLeft += 0.5;

          // Seamless loop: when we've scrolled past one complete set,
          // reset to the start of the second set (which looks identical)
          // This creates a seamless infinite loop without visible jump
          if (container.scrollLeft >= singleSetWidth * 2) {
            container.scrollLeft = singleSetWidth;
          }
        }
        animationId = requestAnimationFrame(scroll);
      };

      // Start scrolling
      animationId = requestAnimationFrame(scroll);
    };

    // Pause on hover handlers
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Initialize scroll after a short delay to ensure layout is ready
    const timeoutId = setTimeout(initScroll, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [galeriList]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Duplicate items multiple times for seamless infinite scroll
  // We duplicate 3 times to ensure smooth looping
  const duplicatedItems = [...galeriList, ...galeriList, ...galeriList];

  return (
    <>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex gap-6 pb-4 scrollbar-hide"
          style={{
            scrollBehavior: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="carousel-item flex-shrink-0 w-80 md:w-96 group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative w-full h-96 overflow-hidden rounded-lg">
                <Image
                  src={`${baseURL}${item.foto}`}
                  alt={item.judul}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 320px, 384px"
                />
                {/* Overlay gelap saat hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-6">
                  {/* Judul dan deskripsi muncul saat hover */}
                  <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.judul}
                    </h3>
                    {item.deskripsi && (
                      <p className="text-sm text-gray-200 line-clamp-3">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal untuk menampilkan foto besar */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol tutup */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label={t.galeri.closeModal}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Foto besar */}
            <div className="relative w-full h-[70vh] bg-gray-800">
              <Image
                src={`${baseURL}${selectedImage.foto}`}
                alt={selectedImage.judul}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>

            {/* Informasi foto */}
            <div className="p-6 bg-gray-900 border-t border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-3">
                {selectedImage.judul}
              </h3>
              {selectedImage.deskripsi && (
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {selectedImage.deskripsi}
                </p>
              )}
              <p className="text-sm text-gray-400">
                {new Date(selectedImage.createdAt).toLocaleDateString(
                  localeMap[lang],
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
