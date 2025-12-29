"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Galeri } from "@/types/galeri";

interface GaleriGridProps {
  galeriList: Galeri[];
  baseURL: string;
}

export default function GaleriGrid({ galeriList, baseURL }: GaleriGridProps) {
  const [selectedImage, setSelectedImage] = useState<Galeri | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = (item: Galeri, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(galeriList[newIndex]);
    }
  };

  const goToNext = () => {
    if (currentIndex < galeriList.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(galeriList[newIndex]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  // Focus modal when opened for keyboard navigation
  useEffect(() => {
    if (selectedImage && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedImage]);

  if (galeriList.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Belum ada foto di galeri
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {galeriList.map((item, index) => (
          <article
            key={item.id}
            className="group relative rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            onClick={() => openModal(item, index)}
          >
            <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
              <Image
                src={`${baseURL}${item.foto}`}
                alt={item.judul}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-red-600 group-hover:bg-clip-text dark:group-hover:from-blue-400 dark:group-hover:to-red-400 transition-all duration-300">
                {item.judul}
              </h2>
              {item.deskripsi && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {item.deskripsi}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm outline-none"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            aria-label="Tutup modal"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Buttons */}
          {galeriList.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                  aria-label="Foto sebelumnya"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {currentIndex < galeriList.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                  aria-label="Foto berikutnya"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}

          {/* Image Container */}
          <div
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-7xl flex flex-col gap-4 my-auto">
              {/* Image */}
              <div className="relative w-full aspect-auto min-h-[50vh] max-h-[70vh] flex items-center justify-center">
                <Image
                  src={`${baseURL}${selectedImage.foto}`}
                  alt={selectedImage.judul}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Description Panel */}
              <div className="bg-black/60 backdrop-blur-lg rounded-lg p-4 md:p-6 border border-white/30 w-full shadow-2xl">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-white flex-1 break-words">
                    {selectedImage.judul}
                  </h3>
                  <span className="text-sm text-white/80 whitespace-nowrap flex-shrink-0 bg-white/10 px-2 py-1 rounded">
                    {currentIndex + 1} / {galeriList.length}
                  </span>
                </div>
                <div className="mb-3">
                  {selectedImage.deskripsi && selectedImage.deskripsi.trim() ? (
                    <p className="text-white text-sm md:text-base leading-relaxed break-words">
                      {selectedImage.deskripsi}
                    </p>
                  ) : (
                    <p className="text-white/60 text-sm md:text-base leading-relaxed italic">
                      Tidak ada deskripsi
                    </p>
                  )}
                </div>
                <p className="text-xs text-white/70 border-t border-white/20 pt-3">
                  {new Date(selectedImage.createdAt).toLocaleDateString(
                    "id-ID",
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
        </div>
      )}
    </>
  );
}
