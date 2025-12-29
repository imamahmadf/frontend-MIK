"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "Jejak Pendidikan di Rusia",
    description:
      "Menempuh studi S1 dan S2 di Rusia, menyerap ilmu dan pengalaman dari lingkungan akademik internasional.",
  },
  {
    title: "Aktif di Organisasi Internasional",
    description:
      "Berperan aktif dalam berbagai forum dan organisasi lintas negara untuk isu-isu energi dan pembangunan berkelanjutan.",
  },
  {
    title: "Mengabdi di Kementerian ESDM",
    description:
      "Kini berkontribusi sebagai tenaga ahli menteri di Kementerian Energi dan Sumber Daya Mineral.",
  },
];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[current];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Sekilas Perjalanan
        </h2>
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-lg p-8">
          <div className="transition-opacity duration-500 ease-in-out">
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              {activeSlide.title}
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {activeSlide.description}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === current
                    ? "bg-blue-600 dark:bg-blue-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
