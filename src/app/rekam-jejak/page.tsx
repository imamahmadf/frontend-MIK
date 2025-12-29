"use client";

import { useState, useEffect } from "react";
import { getAllRekamJejak } from "@/lib/api/rekamJejak";
import { RekamJejak } from "@/types/rekamJejak";

export default function RekamJejakPage() {
  const [rekamJejak, setRekamJejak] = useState<RekamJejak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRekamJejak();
  }, []);

  const fetchRekamJejak = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllRekamJejak(1, 100);
      // Sort by urutan if available, otherwise by id
      const sorted = response.data.sort((a, b) => {
        if (a.urutan !== undefined && b.urutan !== undefined) {
          return a.urutan - b.urutan;
        }
        return a.id - b.id;
      });
      setRekamJejak(sorted);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data rekam jejak");
      console.error("Error fetching rekam jejak:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-5xl">
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
          Potongan Perjalanan yang Membentuk Arah
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Setiap poin ini adalah bagian dari perjalanan yang membentuk visi dan
          dedikasi untuk energi dan Indonesia.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-12 md:pl-16">
        {/* Garis Timeline Vertikal */}
        <div className="absolute left-4 md:left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500"></div>

        {/* Timeline Items */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : rekamJejak.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Belum ada rekam jejak yang tersedia
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
                  <article className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2.5 leading-tight">
                      {item.judul}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.isi}
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
            Perjalanan ini belum selesai. Selama masih ada anak muda yang mau
            belajar, bergerak, dan peduli pada energi, harapan itu akan selalu
            hidup.
          </p>
        </div>
      </div>
    </section>
  );
}
