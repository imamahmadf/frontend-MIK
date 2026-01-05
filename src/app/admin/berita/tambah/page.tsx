"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createBerita } from "@/lib/api/berita";
import { CreateBeritaData, BeritaTranslation } from "@/types/berita";
import { LanguageCode } from "@/lib/language";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function TambahBeritaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [slug, setSlug] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [previewFotos, setPreviewFotos] = useState<string[]>([]);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, BeritaTranslation>
  >({
    id: { language_code: "id", judul: "", isi: "", slug: "" },
    en: { language_code: "en", judul: "", isi: "", slug: "" },
    ru: { language_code: "ru", judul: "", isi: "", slug: "" },
  });

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Auto-generate slug dari judul bahasa aktif
  useEffect(() => {
    const currentTranslation = translations[activeTab];
    if (currentTranslation.judul && !slug) {
      const generatedSlug = currentTranslation.judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
      // Update slug untuk semua bahasa
      setTranslations((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((lang) => {
          updated[lang as LanguageCode] = {
            ...updated[lang as LanguageCode],
            slug: generatedSlug,
          };
        });
        return updated;
      });
    }
  }, [translations[activeTab].judul, activeTab, slug]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "judul" | "isi" | "slug",
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

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFotos(files);
      // Create previews
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setPreviewFotos(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFoto = (index: number) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    const newPreviews = previewFotos.filter((_, i) => i !== index);
    setFotos(newFotos);
    setPreviewFotos(newPreviews);
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
      const translationsArray: BeritaTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        const textContent = trans.isi.replace(/<[^>]*>/g, "").trim();
        if (trans.judul.trim() && textContent) {
          translationsArray.push({
            ...trans,
            slug: trans.slug || slug || undefined,
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: CreateBeritaData = {
        slug: slug || undefined,
        foto: foto || undefined,
        fotos: fotos.length > 0 ? fotos : undefined,
        translations: translationsArray,
      };

      await createBerita(formData);
      router.push("/admin/berita");
    } catch (err: any) {
      setError(err.message || "Gagal membuat berita");
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
          Tambah Berita Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Buat berita baru dengan dukungan multi-bahasa (Indonesia, English,
          Русский)
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
                translation.judul.trim() || translation.isi.trim();
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
              Judul Berita {activeTab === "id" && "*"}
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
              placeholder={`Masukkan judul berita dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`isi-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Isi Berita {activeTab === "id" && "*"}
            </label>
            <ReactQuillEditor
              value={translations[activeTab].isi}
              onChange={(value) =>
                handleTranslationChange(activeTab, "isi", value)
              }
              placeholder={`Masukkan isi berita dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
            {activeTab === "id" &&
              !translations[activeTab].isi.replace(/<[^>]*>/g, "").trim() && (
                <p className="mt-1 text-sm text-red-500">
                  Isi berita untuk Bahasa Indonesia harus diisi
                </p>
              )}
          </div>
        </div>

        {/* Slug (Global) */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Slug (URL)
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Slug akan otomatis dibuat dari judul Bahasa Indonesia"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Slug akan digunakan di URL. Jika kosong, akan dibuat otomatis dari
            judul Bahasa Indonesia.
          </p>
        </div>

        {/* Foto Berita */}
        <div>
          <label
            htmlFor="fotos"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto Berita (Bisa Multiple)
          </label>
          <input
            type="file"
            id="fotos"
            accept="image/*"
            multiple
            onChange={handleFotosChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {previewFotos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewFotos.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeFoto(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    title="Hapus foto"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload satu atau lebih foto untuk berita (opsional). Format yang
            didukung: JPG, PNG, GIF. Anda bisa memilih multiple foto sekaligus.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Berita"}
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
