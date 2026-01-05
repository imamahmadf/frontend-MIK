"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createRekamJejak } from "@/lib/api/rekamJejak";
import {
  CreateRekamJejakData,
  RekamJejakTranslation,
} from "@/types/rekamJejak";
import { LanguageCode } from "@/lib/language";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function TambahRekamJejakPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [urutan, setUrutan] = useState<number | undefined>(undefined);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, RekamJejakTranslation>
  >({
    id: { language_code: "id", judul: "", isi: "" },
    en: { language_code: "en", judul: "", isi: "" },
    ru: { language_code: "ru", judul: "", isi: "" },
  });

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "judul" | "isi",
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

    // Validasi: minimal bahasa Indonesia harus diisi
    const idTranslation = translations.id;
    const textContent = idTranslation.isi.replace(/<[^>]*>/g, "").trim();

    if (!idTranslation.judul.trim() || !textContent) {
      setError("Judul dan isi untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setLoading(true);

      // Siapkan translations array (hanya kirim yang ada isinya)
      const translationsArray: RekamJejakTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        const textContent = trans.isi.replace(/<[^>]*>/g, "").trim();
        if (trans.judul.trim() && textContent) {
          // Hanya kirim field yang diperlukan: language_code, judul, isi
          translationsArray.push({
            language_code: trans.language_code,
            judul: trans.judul.trim(),
            isi: trans.isi,
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: CreateRekamJejakData = {
        translations: translationsArray,
        urutan: urutan,
      };

      // Debug: log data yang akan dikirim
      console.log("Data yang akan dikirim ke API:", {
        translations: translationsArray,
        urutan: urutan,
        jumlah_bahasa: translationsArray.length,
        bahasa: translationsArray.map((t) => t.language_code),
      });

      await createRekamJejak(formData);
      router.push("/admin/rekam-jejak");
    } catch (err: any) {
      console.error("Error creating rekam jejak:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal membuat rekam jejak";
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
          Tambah Rekam Jejak Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tambahkan rekam jejak baru dengan dukungan multi-bahasa (Indonesia,
          English, Русский)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Urutan */}
        <div>
          <label
            htmlFor="urutan"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Urutan (Opsional)
          </label>
          <input
            type="number"
            id="urutan"
            value={urutan || ""}
            onChange={(e) =>
              setUrutan(e.target.value ? parseInt(e.target.value) : undefined)
            }
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan urutan (opsional)"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Urutan menentukan posisi rekam jejak di timeline. Kosongkan untuk
            menggunakan urutan default.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4" aria-label="Tabs">
            {languages.map((lang) => {
              const translation = translations[lang.code];
              const hasContent =
                translation.judul.trim() || translation.isi.trim();
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    // Simpan perubahan sebelum pindah tab
                    // ReactQuill akan otomatis menyimpan melalui onChange
                    setActiveTab(lang.code);
                  }}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === lang.code
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
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
              htmlFor={`judul-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Judul {activeTab === "id" && "*"}
            </label>
            <input
              type="text"
              id={`judul-${activeTab}`}
              value={translations[activeTab].judul}
              onChange={(e) =>
                handleTranslationChange(activeTab, "judul", e.target.value)
              }
              required={activeTab === "id"}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan judul rekam jejak dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`isi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Isi/Konten {activeTab === "id" && "*"}
            </label>
            <ReactQuillEditor
              key={`isi-${activeTab}`}
              value={translations[activeTab].isi}
              onChange={(value) =>
                handleTranslationChange(activeTab, "isi", value)
              }
              placeholder={`Masukkan isi rekam jejak dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
            {activeTab === "id" &&
              !translations[activeTab].isi.replace(/<[^>]*>/g, "").trim() && (
                <p className="mt-1 text-sm text-red-500">
                  Isi rekam jejak untuk Bahasa Indonesia harus diisi
                </p>
              )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Rekam Jejak"}
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
