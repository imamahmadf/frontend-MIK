"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getTentangById, updateTentang } from "@/lib/api/tentang";
import { UpdateTentangData, TentangTranslation } from "@/types/tentang";
import { LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function EditTentangPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [currentFotoUrl, setCurrentFotoUrl] = useState<string | null>(null);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, TentangTranslation>
  >({
    id: { language_code: "id", judul: "", isi: "" },
    en: { language_code: "en", judul: "", isi: "" },
    ru: { language_code: "ru", judul: "", isi: "" },
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch tentang data untuk semua bahasa
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchTentang();
    }
  }, [isAuthenticated, id]);

  const fetchTentang = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua translations untuk 3 bahasa
      const [idData, enData, ruData] = await Promise.all([
        getTentangById(id, "id").catch(() => null),
        getTentangById(id, "en").catch(() => null),
        getTentangById(id, "ru").catch(() => null),
      ]);

      // Set foto URL jika ada
      if (idData?.foto) {
        const fotoUrl = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"
        }${idData.foto}`;
        setCurrentFotoUrl(fotoUrl);
        setFotoPreview(fotoUrl);
      }

      // Set translations untuk setiap bahasa
      setTranslations({
        id: idData
          ? {
              language_code: "id",
              judul: idData.judul || "",
              isi: idData.isi || "",
            }
          : { language_code: "id", judul: "", isi: "" },
        en: enData
          ? {
              language_code: "en",
              judul: enData.judul || "",
              isi: enData.isi || "",
            }
          : { language_code: "en", judul: "", isi: "" },
        ru: ruData
          ? {
              language_code: "ru",
              judul: ruData.judul || "",
              isi: ruData.isi || "",
            }
          : { language_code: "ru", judul: "", isi: "" },
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data tentang");
    } finally {
      setLoading(false);
    }
  };

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

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    setFotoFile(null);
    setFotoPreview(currentFotoUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi: minimal bahasa Indonesia harus diisi
    const idTranslation = translations.id;
    const textContent = idTranslation.isi.trim();

    if (!idTranslation.judul.trim() || !textContent) {
      setError("Judul dan isi untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setSaving(true);

      // Siapkan translations array (kirim semua, termasuk yang kosong untuk update)
      const translationsArray: TentangTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        const textContent = trans.isi.trim();
        if (trans.judul.trim() && textContent) {
          translationsArray.push({
            language_code: trans.language_code,
            judul: trans.judul.trim(),
            isi: trans.isi.trim(),
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: UpdateTentangData = {
        translations: translationsArray,
        foto: fotoFile || undefined,
      };

      await updateTentang(id, formData);
      router.push("/admin/tentang");
    } catch (err: any) {
      console.error("Error updating tentang:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengupdate data tentang";
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
          Edit Data Tentang
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi tentang dengan dukungan multi-bahasa
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <label
            htmlFor="foto"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto (Opsional)
          </label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            onChange={handleFotoChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {fotoPreview && (
            <div className="mt-4">
              <div className="relative w-64 h-64 rounded-lg overflow-hidden">
                {fotoPreview.startsWith("data:") ||
                fotoPreview.startsWith("http") ? (
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={fotoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized={fotoPreview.startsWith("http")}
                  />
                )}
              </div>
              {fotoFile && (
                <button
                  type="button"
                  onClick={handleRemoveFoto}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Hapus Foto Baru
                </button>
              )}
            </div>
          )}
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={`Masukkan judul dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`isi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Isi {activeTab === "id" && "*"}
            </label>
            <textarea
              id={`isi-${activeTab}`}
              value={translations[activeTab].isi}
              onChange={(e) =>
                handleTranslationChange(activeTab, "isi", e.target.value)
              }
              required={activeTab === "id"}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              placeholder={`Masukkan isi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
            {activeTab === "id" && !translations[activeTab].isi.trim() && (
              <p className="mt-1 text-sm text-red-500">
                Isi untuk Bahasa Indonesia harus diisi
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
