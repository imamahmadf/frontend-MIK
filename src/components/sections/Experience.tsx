"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllPengalaman } from "@/lib/api/pengalaman";
import { Pengalaman } from "@/types/pengalaman";
import {
  getCurrentLanguage,
  getLanguageFromSearchParams,
  LanguageCode,
} from "@/lib/language";

function ExperienceContent() {
  const [pengalamanList, setPengalamanList] = useState<Pengalaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchPengalaman();
    }
  }, [mounted, searchParams]);

  const fetchPengalaman = async () => {
    try {
      setLoading(true);
      setError(null);

      const langFromUrl = searchParams?.get("lang");
      const lang: LanguageCode =
        langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();

      const data = await getAllPengalaman(lang);
      setPengalamanList(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pengalaman");
      console.error("Error fetching pengalaman:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <section
        id="experience"
        className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Pengalaman
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Pengalaman
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="inline-block p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        ) : pengalamanList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Belum ada pengalaman yang tersedia
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pengalamanList.map((pengalaman) => (
              <div
                key={pengalaman.id}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {pengalaman.posisi}
                    </h3>
                    {pengalaman.instansi && (
                      <p className="text-lg text-primary dark:text-primary-light">
                        {pengalaman.instansi}
                      </p>
                    )}
                  </div>
                  {pengalaman.durasi && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 md:mt-0">
                      {pengalaman.durasi}
                    </p>
                  )}
                </div>
                {pengalaman.kegiatans && pengalaman.kegiatans.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {pengalaman.kegiatans
                      .sort((a, b) => a.urutan - b.urutan)
                      .map((kegiatan, idx) => (
                        <li key={kegiatan.id || idx}>{kegiatan.kegiatan}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Experience() {
  return (
    <Suspense
      fallback={
        <section
          id="experience"
          className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Pengalaman
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
            </div>
          </div>
        </section>
      }
    >
      <ExperienceContent />
    </Suspense>
  );
}
