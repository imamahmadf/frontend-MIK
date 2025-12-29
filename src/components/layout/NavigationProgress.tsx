"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_DURATION = 800; // Durasi minimal 0.8 detik

  useEffect(() => {
    // Deteksi klik pada semua Link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      // Cek apakah link adalah internal link (Next.js Link)
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);

          // Hanya tampilkan loading untuk navigasi internal
          if (
            url.origin === currentUrl.origin &&
            url.pathname !== currentUrl.pathname
          ) {
            setIsLoading(true);
            setProgress(0);
            startTimeRef.current = Date.now();

            // Clear interval sebelumnya jika ada
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }

            // Simulasi progress yang berjalan selama minimal durasi
            let currentProgress = 0;
            progressIntervalRef.current = setInterval(() => {
              currentProgress += 3;
              if (currentProgress >= 90) {
                setProgress(90);
                if (progressIntervalRef.current) {
                  clearInterval(progressIntervalRef.current);
                }
              } else {
                setProgress(currentProgress);
              }
            }, MIN_DURATION / 30); // Membagi 90% progress ke dalam 30 langkah
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      }
    };

    // Reset loading saat pathname berubah (halaman sudah dimuat)
    if (isLoading) {
      // Pastikan progress bar selesai dengan durasi minimal
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const remaining = Math.max(0, MIN_DURATION - elapsed);

      // Clear interval progress jika masih berjalan
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Set progress ke 100%
      setProgress(100);

      // Tunggu sisa waktu minimal sebelum menutup
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        startTimeRef.current = null;
      }, remaining + 200); // Tambah 200ms untuk animasi fade out

      return () => clearTimeout(timer);
    }

    // Tambahkan event listener dengan capture phase untuk menangkap lebih awal
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [pathname, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-neutral-200 dark:bg-neutral-700">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary-light to-accent transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
