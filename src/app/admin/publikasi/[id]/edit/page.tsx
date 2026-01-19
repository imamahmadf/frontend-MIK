"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getPublikasiById, updatePublikasi } from "@/lib/api/publikasi";
import { getAllTemaPublikasi } from "@/lib/api/temaPublikasi";
import {
  UpdatePublikasiData,
  PublikasiTranslation,
  TemaPublikasi,
} from "@/types/publikasi";
import { LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function EditPublikasiPage() {
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
  const [tanggal, setTanggal] = useState<string>("");
  const [temaId, setTemaId] = useState<number | null>(null);
  const [link, setLink] = useState<string>("");
  const [temaList, setTemaList] = useState<TemaPublikasi[]>([]);

  // State untuk translations (3 bahasa)
  const [translations, setTranslations] = useState<
    Record<LanguageCode, PublikasiTranslation>
  >({
    id: { language_code: "id", judul: "", ringkasan: "" },
    en: { language_code: "en", judul: "", ringkasan: "" },
    ru: { language_code: "ru", judul: "", ringkasan: "" },
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchTemaList = useCallback(async () => {
    try {
      const temas = await getAllTemaPublikasi("id");
      setTemaList(temas);
    } catch (err) {
      console.error("Error fetching tema:", err);
    }
  }, []);

  const fetchPublikasi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua translations untuk 3 bahasa
      const [idData, enData, ruData] = await Promise.all([
        getPublikasiById(id, "id").catch(() => null),
        getPublikasiById(id, "en").catch(() => null),
        getPublikasiById(id, "ru").catch(() => null),
      ]);

      // Set data dari data pertama yang ada
      const firstData = idData || enData || ruData;
      if (firstData) {
        setCurrentFoto(firstData.foto || null);
        setTemaId(firstData.temaId);
        setLink(firstData.link || "");
        if (firstData.tanggal) {
          const date = new Date(firstData.tanggal);
          setTanggal(date.toISOString().split("T")[0]);
        }
      }

      // Set translations untuk setiap bahasa
      setTranslations({
        id: idData
          ? {
              language_code: "id",
              judul: idData.judul || "",
              ringkasan: idData.ringkasan || "",
            }
          : { language_code: "id", judul: "", ringkasan: "" },
        en: enData
          ? {
              language_code: "en",
              judul: enData.judul || "",
              ringkasan: enData.ringkasan || "",
            }
          : { language_code: "en", judul: "", ringkasan: "" },
        ru: ruData
          ? {
              language_code: "ru",
              judul: ruData.judul || "",
              ringkasan: ruData.ringkasan || "",
            }
          : { language_code: "ru", judul: "", ringkasan: "" },
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data publikasi");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch tema list
  useEffect(() => {
    if (isAuthenticated) {
      fetchTemaList();
    }
  }, [isAuthenticated, fetchTemaList]);

  // Fetch publikasi data untuk semua bahasa
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchPublikasi();
    }
  }, [isAuthenticated, id, fetchPublikasi]);

  const handleTranslationChange = (
    lang: LanguageCode,
    field: "judul" | "ringkasan",
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

    if (!idTranslation.judul.trim()) {
      setError("Judul untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setSaving(true);

      // Siapkan translations array
      const translationsArray: PublikasiTranslation[] = [];
      Object.values(translations).forEach((trans) => {
        if (trans.judul.trim()) {
          translationsArray.push({
            language_code: trans.language_code,
            judul: trans.judul.trim(),
            ringkasan: trans.ringkasan?.trim() || undefined,
          });
        }
      });

      // Pastikan minimal ada bahasa Indonesia
      if (translationsArray.length === 0) {
        setError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      const formData: UpdatePublikasiData = {
        foto: foto || undefined,
        tanggal: tanggal || undefined,
        temaId: temaId || undefined,
        link: link || undefined,
        translations: translationsArray,
      };

      await updatePublikasi(id, formData);
      router.push("/admin/publikasi");
    } catch (err: any) {
      console.error("Error updating publikasi:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengupdate publikasi";
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
          Edit Publikasi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi publikasi dengan dukungan multi-bahasa
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
            Foto Publikasi (Opsional)
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
        </div>

        {/* Tema */}
        <div>
          <label
            htmlFor="temaId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tema Publikasi (Opsional)
          </label>
          <select
            id="temaId"
            value={temaId || ""}
            onChange={(e) =>
              setTemaId(e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Pilih Tema --</option>
            {temaList.map((tema) => (
              <option key={tema.id} value={tema.id}>
                {tema.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label
            htmlFor="tanggal"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tanggal Publikasi (Opsional)
          </label>
          <input
            type="date"
            id="tanggal"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Link */}
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Link Publikasi (Opsional)
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Language Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4" aria-label="Tabs">
            {languages.map((lang) => {
              const translation = translations[lang.code];
              const hasContent =
                translation.judul.trim() || translation.ringkasan?.trim();
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
              Judul Publikasi {activeTab === "id" && "*"}
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
              placeholder={`Masukkan judul publikasi dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }`}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`ringkasan-${activeTab}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Ringkasan (Opsional)
            </label>
            <textarea
              id={`ringkasan-${activeTab}`}
              value={translations[activeTab].ringkasan || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "ringkasan", e.target.value)
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Masukkan ringkasan dalam ${
                languages.find((l) => l.code === activeTab)?.name
              }...`}
            />
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
