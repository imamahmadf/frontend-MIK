"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getHeroById, updateHero } from "@/lib/api/hero";
import { UpdateHeroData, HeroTranslation } from "@/types/hero";
import { LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function EditHeroPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>("id");
  const [foto, setFoto] = useState<File | null>(null);
  const [existingFoto, setExistingFoto] = useState<string | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, HeroTranslation>
  >({
    id: { language_code: "id", nama: "", slogan: "", isi: "" },
    en: { language_code: "en", nama: "", slogan: "", isi: "" },
    ru: { language_code: "ru", nama: "", slogan: "", isi: "" },
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchHero = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua translations untuk 3 bahasa
      const [idData, enData, ruData] = await Promise.all([
        getHeroById(id, "id").catch(() => null),
        getHeroById(id, "en").catch(() => null),
        getHeroById(id, "ru").catch(() => null),
      ]);

      // Set foto yang sudah ada
      const firstData = idData || enData || ruData;
      if (firstData) {
        setIsActive(firstData.is_active);
        const baseURL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
        if (firstData.foto) {
          setExistingFoto(`${baseURL}${firstData.foto}`);
        }
      }

      // Set translations untuk setiap bahasa
      setTranslations({
        id: idData
          ? {
              language_code: "id",
              nama: idData.nama || "",
              slogan: idData.slogan || "",
              isi: idData.isi || "",
            }
          : { language_code: "id", nama: "", slogan: "", isi: "" },
        en: enData
          ? {
              language_code: "en",
              nama: enData.nama || "",
              slogan: enData.slogan || "",
              isi: enData.isi || "",
            }
          : { language_code: "en", nama: "", slogan: "", isi: "" },
        ru: ruData
          ? {
              language_code: "ru",
              nama: ruData.nama || "",
              slogan: ruData.slogan || "",
              isi: ruData.isi || "",
            }
          : { language_code: "ru", nama: "", slogan: "", isi: "" },
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data hero");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch hero data untuk semua bahasa
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchHero();
    }
  }, [isAuthenticated, id, fetchHero]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "nama" | "slogan" | "isi",
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
    if (!idTranslation.nama.trim()) {
      setError("Nama untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setSaving(true);

      // Siapkan translations array (hanya kirim yang ada isinya)
      const translationsArray: HeroTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.nama.trim()) {
          translationsArray.push(trans);
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: UpdateHeroData = {
        foto: foto || undefined,
        is_active: isActive,
        translations: translationsArray,
      };

      await updateHero(id, formData);
      router.push("/admin/hero");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate hero");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Hero
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit hero dengan dukungan multi-bahasa (Indonesia, English, Русский)
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
              const hasContent = translation.nama.trim();
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
              Deskripsi (Opsional)
            </label>
            <textarea
              id={`isi-${activeTab}`}
              value={translations[activeTab].isi || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "isi", e.target.value)
              }
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan deskripsi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
          </div>
        </div>

        {/* Foto Hero */}
        <div>
          <label
            htmlFor="foto"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto Hero
          </label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            onChange={handleFotoChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {(previewFoto || existingFoto) && (
            <div className="mt-4 relative w-64 h-64">
              <Image
                src={previewFoto || existingFoto || ""}
                alt="Preview"
                fill
                className="object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                sizes="256px"
              />
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload foto baru untuk mengganti foto yang sudah ada (opsional).
            Format yang didukung: JPG, PNG, GIF.
          </p>
        </div>

        {/* Status Aktif */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktifkan hero ini
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Hero yang aktif akan ditampilkan di halaman beranda.
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
