"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getBiografiById, updateBiografi } from "@/lib/api/biografi";
import { UpdateBiografiData, BiografiTranslation } from "@/types/biografi";
import { LanguageCode } from "@/lib/language";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function EditBiografiPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, BiografiTranslation>
  >({
    id: { language_code: "id", judul: "", isi: "", slogan: "" },
    en: { language_code: "en", judul: "", isi: "", slogan: "" },
    ru: { language_code: "ru", judul: "", isi: "", slogan: "" },
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchBiografi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua translations untuk 3 bahasa
      const [idData, enData, ruData] = await Promise.all([
        getBiografiById(id, "id").catch(() => null),
        getBiografiById(id, "en").catch(() => null),
        getBiografiById(id, "ru").catch(() => null),
      ]);

      // Set translations untuk setiap bahasa
      setTranslations({
        id: idData
          ? {
              language_code: "id",
              judul: idData.judul || "",
              isi: idData.isi || "",
              slogan: idData.slogan || "",
            }
          : { language_code: "id", judul: "", isi: "", slogan: "" },
        en: enData
          ? {
              language_code: "en",
              judul: enData.judul || "",
              isi: enData.isi || "",
              slogan: enData.slogan || "",
            }
          : { language_code: "en", judul: "", isi: "", slogan: "" },
        ru: ruData
          ? {
              language_code: "ru",
              judul: ruData.judul || "",
              isi: ruData.isi || "",
              slogan: ruData.slogan || "",
            }
          : { language_code: "ru", judul: "", isi: "", slogan: "" },
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data biografi");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch biografi data untuk semua bahasa
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchBiografi();
    }
  }, [isAuthenticated, id, fetchBiografi]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "judul" | "isi" | "slogan",
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
      setSaving(true);

      // Siapkan translations array (kirim semua, termasuk yang kosong untuk update)
      const translationsArray: BiografiTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        const textContent = trans.isi.replace(/<[^>]*>/g, "").trim();
        if (trans.judul.trim() && textContent) {
          translationsArray.push({
            language_code: trans.language_code,
            judul: trans.judul.trim(),
            isi: trans.isi,
            slogan: trans.slogan?.trim() || undefined,
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: UpdateBiografiData = {
        translations: translationsArray,
      };

      await updateBiografi(id, formData);
      router.push("/admin/biografi");
    } catch (err: any) {
      console.error("Error updating biografi:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengupdate biografi";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Biografi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi biografi dengan dukungan multi-bahasa
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4" aria-label="Tabs">
            {languages.map((lang) => {
              const translation = translations[lang.code];
              const hasContent =
                translation.judul.trim() ||
                translation.isi.trim() ||
                translation.slogan?.trim();
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
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
              Judul Biografi {activeTab === "id" && "*"}
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
              placeholder={`Masukkan judul biografi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`slogan-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Slogan (Opsional)
            </label>
            <input
              type="text"
              id={`slogan-${activeTab}`}
              value={translations[activeTab].slogan || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "slogan", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan slogan dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`isi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Isi Biografi {activeTab === "id" && "*"}
            </label>
            <ReactQuillEditor
              key={`isi-${activeTab}`}
              value={translations[activeTab].isi}
              onChange={(value) =>
                handleTranslationChange(activeTab, "isi", value)
              }
              placeholder={`Masukkan isi biografi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
            {activeTab === "id" &&
              !translations[activeTab].isi.replace(/<[^>]*>/g, "").trim() && (
                <p className="mt-1 text-sm text-red-500">
                  Isi biografi untuk Bahasa Indonesia harus diisi
                </p>
              )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
