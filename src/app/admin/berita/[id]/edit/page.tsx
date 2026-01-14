"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getBeritaById, updateBerita } from "@/lib/api/berita";
import { UpdateBeritaData, BeritaTranslation } from "@/types/berita";
import { LanguageCode } from "@/lib/language";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [slug, setSlug] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [existingFotos, setExistingFotos] = useState<string[]>([]);
  const [previewFotos, setPreviewFotos] = useState<string[]>([]);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, BeritaTranslation>
  >({
    id: { language_code: "id", judul: "", isi: "", slug: "" },
    en: { language_code: "en", judul: "", isi: "", slug: "" },
    ru: { language_code: "ru", judul: "", isi: "", slug: "" },
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch berita data untuk semua bahasa
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchBerita();
    }
  }, [isAuthenticated, id]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua translations untuk 3 bahasa
      const [idData, enData, ruData] = await Promise.all([
        getBeritaById(id, "id").catch(() => null),
        getBeritaById(id, "en").catch(() => null),
        getBeritaById(id, "ru").catch(() => null),
      ]);

      // Set slug dari data pertama yang ada
      const firstData = idData || enData || ruData;
      if (firstData) {
        setSlug(firstData.slug);

        // Set preview foto yang sudah ada
        const baseURL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
        const existing: string[] = [];
        if (firstData.fotos && firstData.fotos.length > 0) {
          firstData.fotos.forEach((foto: any) => {
            existing.push(`${baseURL}${foto.foto}`);
          });
        }
        setExistingFotos(existing);
      }

      // Set translations untuk setiap bahasa
      setTranslations({
        id: idData
          ? {
              language_code: "id",
              judul: idData.judul || "",
              isi: idData.isi || "",
              slug: idData.slug || "",
              meta_title: idData.meta_title,
              meta_description: idData.meta_description,
            }
          : { language_code: "id", judul: "", isi: "", slug: "" },
        en: enData
          ? {
              language_code: "en",
              judul: enData.judul || "",
              isi: enData.isi || "",
              slug: enData.slug || "",
              meta_title: enData.meta_title,
              meta_description: enData.meta_description,
            }
          : { language_code: "en", judul: "", isi: "", slug: "" },
        ru: ruData
          ? {
              language_code: "ru",
              judul: ruData.judul || "",
              isi: ruData.isi || "",
              slug: ruData.slug || "",
              meta_title: ruData.meta_title,
              meta_description: ruData.meta_description,
            }
          : { language_code: "ru", judul: "", isi: "", slug: "" },
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data berita");
    } finally {
      setLoading(false);
    }
  };

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

  const removeNewFoto = (index: number) => {
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
      setSaving(true);

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

      const formData: UpdateBeritaData = {
        slug: slug || undefined,
        foto: foto || undefined,
        fotos: fotos.length > 0 ? fotos : undefined,
        translations: translationsArray,
      };

      await updateBerita(id, formData);
      router.push("/admin/berita");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate berita");
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
          Edit Berita
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi berita dengan dukungan multi-bahasa
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
              key={`editor-${activeTab}`}
              value={translations[activeTab].isi || ""}
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
            placeholder="Slug untuk URL"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ubah slug dengan hati-hati karena akan mempengaruhi URL berita.
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
          {existingFotos.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Foto yang sudah ada:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingFotos.map((fotoUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={fotoUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            id="fotos"
            accept="image/*"
            multiple
            onChange={handleFotosChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {previewFotos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Preview foto baru:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewFotos.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFoto(index)}
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
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload foto baru untuk ditambahkan ke berita (opsional). Format yang
            didukung: JPG, PNG, GIF. Anda bisa memilih multiple foto sekaligus.
          </p>
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
