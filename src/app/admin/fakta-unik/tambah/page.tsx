"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createFaktaUnik } from "@/lib/api/faktaUnik";
import { CreateFaktaUnikData, FaktaUnikTranslation } from "@/types/faktaUnik";
import { LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function TambahFaktaUnikPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [angka, setAngka] = useState<number>(0);

  // State untuk translations (3 bahasa) - sekarang satuan ada di setiap translation
  const [translations, setTranslations] = useState<
    Record<LanguageCode, FaktaUnikTranslation>
  >({
    id: { language_code: "id", satuan: "", isi: "" },
    en: { language_code: "en", satuan: "", isi: "" },
    ru: { language_code: "ru", satuan: "", isi: "" },
  });

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "satuan" | "isi",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi angka
    if (!angka || angka <= 0 || isNaN(angka)) {
      setError("Angka harus diisi dan lebih besar dari 0");
      return;
    }

    // Validasi: minimal bahasa Indonesia harus diisi
    const idTranslation = translations.id;

    if (!idTranslation.isi.trim()) {
      setError("Penjelasan untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setLoading(true);

      // Siapkan translations array (hanya kirim yang ada isinya)
      const translationsArray: FaktaUnikTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.isi.trim()) {
          translationsArray.push({
            language_code: trans.language_code,
            satuan: trans.satuan?.trim() || null,
            isi: trans.isi.trim(),
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: CreateFaktaUnikData = {
        angka,
        translations: translationsArray,
      };

      await createFaktaUnik(formData);
      router.push("/admin/fakta-unik");
    } catch (err: any) {
      console.error("Error creating fakta unik:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal membuat data fakta unik";
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
          Tambah Data Fakta Unik Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Buat data fakta unik baru dengan dukungan multi-bahasa (Indonesia,
          English, Русский)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Angka */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div>
            <label
              htmlFor="angka"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Angka *
            </label>
            <input
              type="number"
              id="angka"
              value={angka || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setAngka(0);
                } else {
                  const num = parseInt(value, 10);
                  setAngka(isNaN(num) ? 0 : num);
                }
              }}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Masukkan angka"
            />
          </div>
        </div>

        {/* Language Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4" aria-label="Tabs">
            {languages.map((lang) => {
              const translation = translations[lang.code];
              const hasContent =
                translation.isi.trim() || translation.satuan?.trim();
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
              htmlFor={`satuan-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Satuan (Opsional)
            </label>
            <input
              type="text"
              id={`satuan-${activeTab}`}
              value={translations[activeTab].satuan || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "satuan", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Contoh: +, %, tahun, dll"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor={`isi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Penjelasan {activeTab === "id" && "*"}
            </label>
            <textarea
              id={`isi-${activeTab}`}
              value={translations[activeTab].isi}
              onChange={(e) =>
                handleTranslationChange(activeTab, "isi", e.target.value)
              }
              required={activeTab === "id"}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              placeholder={`Masukkan penjelasan dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
            {activeTab === "id" && !translations[activeTab].isi.trim() && (
              <p className="mt-1 text-sm text-red-500">
                Penjelasan untuk Bahasa Indonesia harus diisi
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Data Fakta Unik"}
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
