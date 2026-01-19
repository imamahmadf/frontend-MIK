"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getTentang } from "@/lib/api/tentang";
import type { Tentang } from "@/types/tentang";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { useTranslations } from "@/hooks/useTranslations";

function AboutFallback() {
  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-neutral-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
          <span className="inline-block h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </h2>
        <div className="space-y-8">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutContent() {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [tentangData, setTentangData] = useState<Tentang | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tentang data ketika bahasa berubah
  useEffect(() => {
    const fetchTentang = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dapatkan bahasa dari URL atau localStorage
        const langFromUrl = searchParams?.get("lang");
        const lang: LanguageCode =
          langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
            ? (langFromUrl as LanguageCode)
            : getCurrentLanguage();

        const data = await getTentang(lang);
        setTentangData(data);
      } catch (err: any) {
        console.error("Error fetching tentang:", err);
        setError(err.message || t.about.error);
      } finally {
        setLoading(false);
      }
    };

    fetchTentang();
  }, [searchParams, t.about.error]);

  // Get foto URL
  const fotoUrl = tentangData?.foto
    ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"}${
        tentangData.foto
      }`
    : null;

  // Split isi menjadi paragraf jika ada
  const paragraphs = tentangData?.isi
    ? tentangData.isi.split("\n\n").filter((p) => p.trim())
    : [];

  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-neutral-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
          {loading ? (
            <span className="inline-block h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : error ? (
            t.about.title
          ) : (
            tentangData?.judul || t.about.title
          )}
        </h2>

        {loading ? (
          <div className="space-y-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                  Energi, bagi Iksan, bukan sekadar persoalan sumber daya.
                  Energi adalah masa depan, kemandirian, dan keberlanjutan
                  bangsa. Keyakinan itulah yang membawanya menempuh pendidikan
                  hingga ribuan kilometer jauhnya, melintasi batas negara dan
                  budaya.
                </p>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                  Saya adalah seorang anak muda Indonesia yang menempuh S1 dan
                  S2 di Rusia, belajar langsung dari ekosistem teknologi dan
                  energi yang inovatif. Pengalaman lintas budaya membantu saya
                  berpikir global dan bertindak adaptif.
                </p>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                  Saya aktif di berbagai organisasi internasional, membangun
                  jejaring dan kolaborasi lintas negara untuk isu-isu strategis
                  di sektor energi dan pengembangan berkelanjutan.
                </p>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Hari ini, perjalanan itu belum selesai. Justru, ia terus
                  bergerak—menginspirasi, membangun, dan mengajak generasi muda
                  untuk ikut terlibat. Saat ini saya mengabdi sebagai tenaga
                  ahli menteri di Kementerian Energi dan Sumber Daya Mineral,
                  fokus pada inisiatif kebijakan dan program yang berdampak bagi
                  masyarakat.
                </p>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
                  {t.about.information}
                </h3>
                <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
                  <li>
                    <strong className="text-primary dark:text-primary-light">
                      {t.about.location}:
                    </strong>{" "}
                    Jakarta, Indonesia
                  </li>
                  <li>
                    <strong className="text-primary dark:text-primary-light">
                      {t.about.email}:
                    </strong>{" "}
                    email@example.com
                  </li>
                  <li>
                    <strong className="text-primary dark:text-primary-light">
                      {t.about.focus}:
                    </strong>{" "}
                    Kebijakan energi, kerja sama internasional
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : tentangData ? (
          <>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                    {tentangData.isi}
                  </p>
                )}
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-neutral-700">
                {fotoUrl && (
                  <div className="mb-6">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src={fotoUrl}
                        alt={tentangData.judul || t.about.title}
                        fill
                        className="object-cover"
                        unoptimized={fotoUrl.startsWith("http")}
                      />
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
                  {t.about.information}
                </h3>
                <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
                  <li>
                    <strong className="text-primary dark:text-primary-light">
                      {t.about.location}:
                    </strong>{" "}
                    Jakarta, Indonesia
                  </li>
                  <li>
                    <strong className="text-primary dark:text-primary-light">
                      {t.about.email}:
                    </strong>{" "}
                    email@example.com
                  </li>
                  <li>
                    <strong className="text-primary dark:text-primary-light">
                      {t.about.focus}:
                    </strong>{" "}
                    Kebijakan energi, kerja sama internasional
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              {t.about.error}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function About() {
  return (
    <Suspense fallback={<AboutFallback />}>
      <AboutContent />
    </Suspense>
  );
}
