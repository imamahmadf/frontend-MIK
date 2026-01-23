"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Logo, JenisLogo } from "@/types/logo";

interface LogoCarouselClientProps {
  logos: Logo[];
  jenisLogo: JenisLogo;
  baseURL: string;
}

export default function LogoCarouselClient({
  logos,
  jenisLogo,
  baseURL,
}: LogoCarouselClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || logos.length === 0) return;

    let animationId: number;
    let isPaused = false;
    let singleSetWidth = 0;
    let scrollSpeed = 0.5; // Kecepatan scroll

    // Wait for layout to be ready
    const initScroll = () => {
      const firstItem = container.querySelector(
        ".logo-carousel-item"
      ) as HTMLElement;
      if (!firstItem) {
        requestAnimationFrame(initScroll);
        return;
      }

      // Calculate single set width (width of one complete set of items)
      const itemWidth = firstItem.offsetWidth;
      const gap = 32; // gap-8 = 2rem = 32px
      singleSetWidth = logos.length * (itemWidth + gap);

      // Pastikan singleSetWidth valid
      if (singleSetWidth <= 0) {
        requestAnimationFrame(initScroll);
        return;
      }

      // Start from the beginning of the second duplicate set
      // Ini memungkinkan seamless looping
      container.scrollLeft = singleSetWidth;

      // Auto scroll function - akan terus berjalan
      const scroll = () => {
        if (container && !isPaused && singleSetWidth > 0) {
          // Scroll terus menerus
          container.scrollLeft += scrollSpeed;

          // Seamless loop: ketika sudah scroll melewati 2 set (set kedua),
          // reset ke awal set kedua (yang identik dengan set pertama)
          // Ini menciptakan infinite loop tanpa terlihat jump
          if (container.scrollLeft >= singleSetWidth * 2) {
            container.scrollLeft = singleSetWidth;
          }
        }
        // Selalu request frame berikutnya untuk animasi terus berjalan
        animationId = requestAnimationFrame(scroll);
      };

      // Start scrolling - animasi akan terus berjalan
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
  }, [logos]);

  // Duplicate items multiple times for seamless infinite scroll
  // Duplikasi 3 kali untuk memastikan infinite loop yang smooth
  // Set pertama: visible, Set kedua: untuk seamless reset, Set ketiga: buffer
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto flex gap-8 pb-4 scrollbar-hide"
        style={{
          scrollBehavior: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {duplicatedLogos.map((logo, index) => {
          // Handle berbagai format URL
          let imageUrl = logo.gambarLogo;
          if (!logo.gambarLogo.startsWith("http") && !logo.gambarLogo.startsWith("/")) {
            imageUrl = `${baseURL}${logo.gambarLogo.startsWith("/") ? "" : "/"}${logo.gambarLogo}`;
          } else if (!logo.gambarLogo.startsWith("http") && logo.gambarLogo.startsWith("/")) {
            imageUrl = `${baseURL}${logo.gambarLogo}`;
          }

          const logoName = jenisLogo.nama || `Logo ${logo.id}`;

          return (
            <div
              key={`${logo.id}-${index}`}
              className="logo-carousel-item flex-shrink-0 flex items-center justify-center w-48 h-32 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              title={logoName}
            >
              <Image
                src={imageUrl}
                alt={logoName}
                width={200}
                height={100}
                className="object-contain max-w-full max-h-full"
                unoptimized={imageUrl.startsWith("http")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

