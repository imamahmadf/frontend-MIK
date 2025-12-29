"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const startTimeRef = useRef<number | null>(null);
  const MIN_DURATION = 800; // Durasi minimal 0.8 detik

  useEffect(() => {
    // Hanya tampilkan loading jika pathname benar-benar berubah
    if (prevPathnameRef.current !== pathname) {
      setShowOverlay(true);
      setIsLoading(true);
      startTimeRef.current = Date.now();
      prevPathnameRef.current = pathname;

      // Fungsi untuk menghitung sisa waktu dan menutup loading
      const closeLoading = () => {
        const elapsed = Date.now() - (startTimeRef.current || 0);
        const remaining = Math.max(0, MIN_DURATION - elapsed);

        setTimeout(() => {
          setIsLoading(false);
          // Tunggu animasi fade out selesai sebelum hide overlay
          setTimeout(() => {
            setShowOverlay(false);
          }, 300);
        }, remaining);
      };

      // Tunggu minimal durasi sebelum menutup loading
      closeLoading();
    }
  }, [pathname]);

  return (
    <>
      {showOverlay && <LoadingOverlay isLoading={isLoading} />}
      <div
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}

function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[9998] bg-white dark:bg-neutral-900 flex items-center justify-center transition-opacity duration-300 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Spinner dengan efek modern */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 border-4 border-neutral-200 dark:border-neutral-700 rounded-full" />

          {/* Animated ring */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" />

          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-primary-light to-accent rounded-full animate-progress" />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-neutral-900 dark:text-white animate-pulse">
            Memuat halaman...
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
