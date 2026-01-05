"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getTestimoniById, updateTestimoni } from "@/lib/api/testimoni";
import { UpdateTestimoniData, TestimoniTranslation } from "@/types/testimoni";
import { LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function EditTestimoniPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [currentFoto, setCurrentFoto] = useState<string | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, TestimoniTranslation>
  >({
    id: { language_code: "id", nama: "", isi: "", tempat: "" },
    en: { language_code: "en", nama: "", isi: "", tempat: "" },
    ru: { language_code: "ru", nama: "", isi: "", tempat: "" },
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch testimoni data untuk semua bahasa
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchTestimoni();
    }
  }, [isAuthenticated, id]);

  const fetchTestimoni = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua translations untuk 3 bahasa
      const [idData, enData, ruData] = await Promise.all([
        getTestimoniById(id, "id").catch(() => null),
        getTestimoniById(id, "en").catch(() => null),
        getTestimoniById(id, "ru").catch(() => null),
      ]);

      // Set foto dari data pertama yang ada
      const firstData = idData || enData || ruData;
      if (firstData) {
        setCurrentFoto(firstData.foto || null);
      }

      // Set translations untuk setiap bahasa
      setTranslations({
        id: idData
          ? {
              language_code: "id",
              nama: idData.nama || "",
              isi: idData.isi || "",
              tempat: idData.tempat || "",
            }
          : { language_code: "id", nama: "", isi: "", tempat: "" },
        en: enData
          ? {
              language_code: "en",
              nama: enData.nama || "",
              isi: enData.isi || "",
              tempat: enData.tempat || "",
            }
          : { language_code: "en", nama: "", isi: "", tempat: "" },
        ru: ruData
          ? {
              language_code: "ru",
              nama: ruData.nama || "",
              isi: ruData.isi || "",
              tempat: ruData.tempat || "",
            }
          : { language_code: "ru", nama: "", isi: "", tempat: "" },
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data testimoni");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "nama" | "isi" | "tempat",
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
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi: minimal bahasa Indonesia harus diisi
    const idTranslation = translations.id;

    if (!idTranslation.nama.trim() || !idTranslation.isi.trim()) {
      setError("Nama dan isi untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setSaving(true);

      // Siapkan translations array (kirim semua, termasuk yang kosong untuk update)
      const translationsArray: TestimoniTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.nama.trim() && trans.isi.trim()) {
          translationsArray.push({
            language_code: trans.language_code,
            nama: trans.nama.trim(),
            isi: trans.isi.trim(),
            tempat: trans.tempat?.trim() || undefined,
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: UpdateTestimoniData = {
        foto: foto || undefined,
        translations: translationsArray,
      };

      await updateTestimoni(id, formData);
      router.push("/admin/testimoni");
    } catch (err: any) {
      console.error("Error updating testimoni:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengupdate testimoni";
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

  const fotoToShow = previewFoto || currentFoto;

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Testimoni
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi testimoni dengan dukungan multi-bahasa
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto */}
        <div>
          <label
            htmlFor="foto"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto Testimoni (Opsional)
          </label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            onChange={handleFotoChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {fotoToShow && (
            <div className="mt-4">
              <Image
                src={
                  previewFoto
                    ? fotoToShow
                    : `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:7000"
                      }${fotoToShow}`
                }
                alt="Preview"
                width={192}
                height={192}
                className="w-48 h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload foto baru untuk mengganti foto yang sudah ada (opsional).
            Format yang didukung: JPG, PNG, GIF.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4" aria-label="Tabs">
            {languages.map((lang) => {
              const translation = translations[lang.code];
              const hasContent =
                translation.nama.trim() ||
                translation.isi.trim() ||
                translation.tempat?.trim();
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
              htmlFor={`nama-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nama {activeTab === "id" && "*"}
            </label>
            <input
              type="text"
              id={`nama-${activeTab}`}
              value={translations[activeTab].nama}
              onChange={(e) =>
                handleTranslationChange(activeTab, "nama", e.target.value)
              }
              required={activeTab === "id"}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan nama dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`tempat-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tempat/Instansi (Opsional)
            </label>
            <input
              type="text"
              id={`tempat-${activeTab}`}
              value={translations[activeTab].tempat || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "tempat", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan tempat/instansi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`isi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Isi Testimoni {activeTab === "id" && "*"}
            </label>
            <textarea
              id={`isi-${activeTab}`}
              value={translations[activeTab].isi}
              onChange={(e) =>
                handleTranslationChange(activeTab, "isi", e.target.value)
              }
              required={activeTab === "id"}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan isi testimoni dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
            {activeTab === "id" && !translations[activeTab].isi.trim() && (
              <p className="mt-1 text-sm text-red-500">
                Isi testimoni untuk Bahasa Indonesia harus diisi
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
