"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createPengalaman } from "@/lib/api/pengalaman";
import {
  CreatePengalamanData,
  PengalamanTranslation,
  KegiatanPengalamanTranslation,
} from "@/types/pengalaman";
import { LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

interface KegiatanFormData {
  urutan: number;
  translations: Record<LanguageCode, KegiatanPengalamanTranslation>;
}

export default function TambahPengalamanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [durasi, setDurasi] = useState<string>("");

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, PengalamanTranslation>
  >({
    id: { language_code: "id", posisi: "", instansi: "" },
    en: { language_code: "en", posisi: "", instansi: "" },
    ru: { language_code: "ru", posisi: "", instansi: "" },
  });

  // State untuk kegiatans
  const [kegiatans, setKegiatans] = useState<KegiatanFormData[]>([]);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "posisi" | "instansi",
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleAddKegiatan = () => {
    const newKegiatan: KegiatanFormData = {
      urutan: kegiatans.length + 1,
      translations: {
        id: { language_code: "id", kegiatan: "" },
        en: { language_code: "en", kegiatan: "" },
        ru: { language_code: "ru", kegiatan: "" },
      },
    };
    setKegiatans([...kegiatans, newKegiatan]);
  };

  const handleRemoveKegiatan = (index: number) => {
    setKegiatans(kegiatans.filter((_, i) => i !== index));
    // Update urutan
    setKegiatans((prev) => prev.map((k, i) => ({ ...k, urutan: i + 1 })));
  };

  const handleKegiatanChange = (
    index: number,
    lang: LanguageCode,
    value: string
  ) => {
    setKegiatans((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        translations: {
          ...updated[index].translations,
          [lang]: {
            language_code: lang,
            kegiatan: value,
          },
        },
      };
      return updated;
    });
  };

  const handleMoveKegiatan = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === kegiatans.length - 1)
    ) {
      return;
    }

    const newKegiatans = [...kegiatans];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newKegiatans[index], newKegiatans[targetIndex]] = [
      newKegiatans[targetIndex],
      newKegiatans[index],
    ];

    // Update urutan
    newKegiatans.forEach((k, i) => {
      k.urutan = i + 1;
    });

    setKegiatans(newKegiatans);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi: minimal bahasa Indonesia harus diisi
    const idTranslation = translations.id;

    if (!idTranslation.posisi.trim()) {
      setError("Posisi untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setLoading(true);

      // Siapkan translations array
      const translationsArray: PengalamanTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.posisi.trim()) {
          translationsArray.push({
            language_code: trans.language_code,
            posisi: trans.posisi.trim(),
            instansi: trans.instansi?.trim() || undefined,
          });
        }
      });

      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      // Siapkan kegiatans array
      const kegiatansArray = kegiatans.map((kegiatan) => {
        const kegiatanTranslations: KegiatanPengalamanTranslation[] = [];
        Object.values(kegiatan.translations).forEach((trans) => {
          if (trans.kegiatan.trim()) {
            kegiatanTranslations.push({
              language_code: trans.language_code,
              kegiatan: trans.kegiatan.trim(),
            });
          }
        });

        return {
          urutan: kegiatan.urutan,
          translations: kegiatanTranslations,
        };
      });

      const formData: CreatePengalamanData = {
        durasi: durasi.trim() || undefined,
        translations: translationsArray,
        kegiatans: kegiatansArray.length > 0 ? kegiatansArray : undefined,
      };

      await createPengalaman(formData);
      router.push("/admin/pengalaman");
    } catch (err: any) {
      console.error("Error creating pengalaman:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal membuat pengalaman";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tambah Pengalaman Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Buat pengalaman baru dengan dukungan multi-bahasa dan kegiatan
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Durasi */}
        <div>
          <label
            htmlFor="durasi"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Durasi (Opsional)
          </label>
          <input
            type="text"
            id="durasi"
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
            placeholder="Contoh: 2020 - Sekarang"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Language Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4" aria-label="Tabs">
            {languages.map((lang) => {
              const translation = translations[lang.code];
              const hasContent = translation.posisi.trim();
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === lang.code
                      ? "border-primary text-primary dark:text-primary-light"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {hasContent && (
                      <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    {lang.code === "id" && (
                      <span className="ml-2 text-xs text-red-500">*</span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Translation Form untuk bahasa aktif */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label
              htmlFor={`posisi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Posisi {activeTab === "id" && "*"}
            </label>
            <input
              type="text"
              id={`posisi-${activeTab}`}
              value={translations[activeTab].posisi}
              onChange={(e) =>
                handleTranslationChange(activeTab, "posisi", e.target.value)
              }
              required={activeTab === "id"}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan posisi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`instansi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Instansi (Opsional)
            </label>
            <input
              type="text"
              id={`instansi-${activeTab}`}
              value={translations[activeTab].instansi || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "instansi", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan instansi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>
        </div>

        {/* Kegiatans Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Kegiatan
            </h2>
            <button
              type="button"
              onClick={handleAddKegiatan}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              + Tambah Kegiatan
            </button>
          </div>

          {kegiatans.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Belum ada kegiatan. Klik tombol "Tambah Kegiatan" untuk
              menambahkan.
            </p>
          ) : (
            <div className="space-y-4">
              {kegiatans.map((kegiatan, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Kegiatan #{kegiatan.urutan}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveKegiatan(index, "up")}
                        disabled={index === 0}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveKegiatan(index, "down")}
                        disabled={index === kegiatans.length - 1}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveKegiatan(index)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* Language Tabs untuk Kegiatan */}
                  <div className="border-b border-gray-200 dark:border-gray-700 mb-3">
                    <nav className="flex space-x-2">
                      {languages.map((lang) => {
                        const kegiatanTranslation =
                          kegiatan.translations[lang.code];
                        const hasContent = kegiatanTranslation.kegiatan.trim();
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setActiveTab(lang.code)}
                            className={`py-2 px-3 border-b-2 font-medium text-xs transition-colors ${
                              activeTab === lang.code
                                ? "border-primary text-primary dark:text-primary-light"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <span>{lang.flag}</span>
                              {hasContent && (
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Kegiatan Input */}
                  <textarea
                    value={kegiatan.translations[activeTab].kegiatan}
                    onChange={(e) =>
                      handleKegiatanChange(index, activeTab, e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Masukkan kegiatan dalam ${
                      languages.find((l) => l.code === activeTab)?.name
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Pengalaman"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
