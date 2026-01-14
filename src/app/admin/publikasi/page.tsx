"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getAllPublikasi, deletePublikasi } from "@/lib/api/publikasi";
import {
  getAllTemaPublikasi,
  getTemaPublikasiById,
  deleteTemaPublikasi,
  createTemaPublikasi,
  updateTemaPublikasi,
} from "@/lib/api/temaPublikasi";
import {
  Publikasi,
  TemaPublikasi,
  CreateTemaPublikasiData,
  UpdateTemaPublikasiData,
  TemaPublikasiTranslation,
} from "@/types/publikasi";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function AdminPublikasiPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"publikasi" | "tema">("publikasi");

  // Publikasi states
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [publikasiLoading, setPublikasiLoading] = useState(true);
  const [publikasiError, setPublikasiError] = useState<string | null>(null);
  const [publikasiPage, setPublikasiPage] = useState(1);
  const [publikasiTotalPages, setPublikasiTotalPages] = useState(1);
  const [deletingPublikasiId, setDeletingPublikasiId] = useState<number | null>(
    null
  );

  // Tema states
  const [temaList, setTemaList] = useState<TemaPublikasi[]>([]);
  const [temaLoading, setTemaLoading] = useState(true);
  const [temaError, setTemaError] = useState<string | null>(null);
  const [deletingTemaId, setDeletingTemaId] = useState<number | null>(null);
  const [showTemaForm, setShowTemaForm] = useState(false);
  const [editingTema, setEditingTema] = useState<TemaPublikasi | null>(null);
  const [temaFormLoading, setTemaFormLoading] = useState(false);
  const [temaActiveTab, setTemaActiveTab] = useState<LanguageCode>("id");
  const [temaTranslations, setTemaTranslations] = useState<
    Record<LanguageCode, TemaPublikasiTranslation>
  >({
    id: { language_code: "id", nama: "" },
    en: { language_code: "en", nama: "" },
    ru: { language_code: "ru", nama: "" },
  });

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!publikasiLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, publikasiLoading, router]);

  // Fetch publikasi
  useEffect(() => {
    if (isAuthenticated && activeTab === "publikasi") {
      fetchPublikasi();
    }
  }, [publikasiPage, isAuthenticated, activeTab]);

  // Fetch tema
  useEffect(() => {
    if (isAuthenticated && activeTab === "tema") {
      fetchTema();
    }
  }, [isAuthenticated, activeTab]);

  const fetchPublikasi = async () => {
    try {
      setPublikasiLoading(true);
      setPublikasiError(null);
      const lang = getCurrentLanguage();
      const response = await getAllPublikasi(
        publikasiPage,
        10,
        undefined,
        lang
      );
      setPublikasiList(response.data);
      setPublikasiTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setPublikasiError(err.message || "Gagal memuat data publikasi");
    } finally {
      setPublikasiLoading(false);
    }
  };

  const fetchTema = async () => {
    try {
      setTemaLoading(true);
      setTemaError(null);
      const lang = getCurrentLanguage();
      const temas = await getAllTemaPublikasi(lang);
      setTemaList(temas);
    } catch (err: any) {
      setTemaError(err.message || "Gagal memuat data tema");
    } finally {
      setTemaLoading(false);
    }
  };

  const handleDeletePublikasi = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus publikasi ini?")) {
      return;
    }

    try {
      setDeletingPublikasiId(id);
      await deletePublikasi(id);
      await fetchPublikasi();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus publikasi");
    } finally {
      setDeletingPublikasiId(null);
    }
  };

  const handleDeleteTema = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tema ini?")) {
      return;
    }

    try {
      setDeletingTemaId(id);
      await deleteTemaPublikasi(id);
      await fetchTema();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus tema");
    } finally {
      setDeletingTemaId(null);
    }
  };

  const handleTemaTranslationChange = (
    lang: LanguageCode,
    field: "nama",
    value: string
  ) => {
    setTemaTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleSaveTema = async () => {
    setTemaError(null);

    // Validasi: minimal bahasa Indonesia harus diisi
    const idTranslation = temaTranslations.id;

    if (!idTranslation.nama.trim()) {
      setTemaError("Nama untuk Bahasa Indonesia wajib diisi");
      return;
    }

    try {
      setTemaFormLoading(true);

      // Siapkan translations array
      const translationsArray: TemaPublikasiTranslation[] = [];
      Object.values(temaTranslations).forEach((trans) => {
        if (trans.nama.trim()) {
          translationsArray.push({
            language_code: trans.language_code,
            nama: trans.nama.trim(),
          });
        }
      });

      if (translationsArray.length === 0) {
        setTemaError("Minimal harus ada terjemahan untuk Bahasa Indonesia");
        return;
      }

      if (editingTema) {
        // Update
        const data: UpdateTemaPublikasiData = {
          translations: translationsArray,
        };
        await updateTemaPublikasi(editingTema.id, data);
      } else {
        // Create
        const data: CreateTemaPublikasiData = {
          translations: translationsArray,
        };
        await createTemaPublikasi(data);
      }

      // Reset form
      setShowTemaForm(false);
      setEditingTema(null);
      setTemaTranslations({
        id: { language_code: "id", nama: "" },
        en: { language_code: "en", nama: "" },
        ru: { language_code: "ru", nama: "" },
      });
      await fetchTema();
    } catch (err: any) {
      console.error("Error saving tema:", err);
      setTemaError(err.message || "Gagal menyimpan tema");
    } finally {
      setTemaFormLoading(false);
    }
  };

  const handleEditTema = async (tema: TemaPublikasi) => {
    setEditingTema(tema);
    setShowTemaForm(true);

    // Fetch translations untuk semua bahasa
    try {
      const [idData, enData, ruData] = await Promise.all([
        getTemaPublikasiById(tema.id, "id").catch(() => null),
        getTemaPublikasiById(tema.id, "en").catch(() => null),
        getTemaPublikasiById(tema.id, "ru").catch(() => null),
      ]);

      setTemaTranslations({
        id: {
          language_code: "id",
          nama: idData?.nama || "",
        },
        en: {
          language_code: "en",
          nama: enData?.nama || "",
        },
        ru: {
          language_code: "ru",
          nama: ruData?.nama || "",
        },
      });
    } catch (err) {
      console.error("Error fetching tema translations:", err);
    }
  };

  const handleCancelTemaForm = () => {
    setShowTemaForm(false);
    setEditingTema(null);
    setTemaTranslations({
      id: { language_code: "id", nama: "" },
      en: { language_code: "en", nama: "" },
      ru: { language_code: "ru", nama: "" },
    });
    setTemaError(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Admin - Kelola Publikasi & Tema
        </h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("publikasi")}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "publikasi"
                  ? "border-primary text-primary dark:text-primary-light"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Publikasi
            </button>
            <button
              onClick={() => setActiveTab("tema")}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "tema"
                  ? "border-primary text-primary dark:text-primary-light"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Tema Publikasi
            </button>
          </nav>
        </div>
      </div>

      {/* Publikasi Tab */}
      {activeTab === "publikasi" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Daftar Publikasi
            </h2>
            <Link
              href="/admin/publikasi/tambah"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              + Tambah Publikasi
            </Link>
          </div>

          {publikasiError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{publikasiError}</p>
            </div>
          )}

          {publikasiLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
            </div>
          ) : publikasiList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada publikasi
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                        Judul
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                        Tema
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                        Tanggal
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {publikasiList.map((publikasi) => (
                      <tr
                        key={publikasi.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {publikasi.judul}
                          </div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                          {publikasi.tema?.nama || "-"}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                          {publikasi.tanggal
                            ? new Date(publikasi.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/publikasi/${publikasi.id}/edit`}
                              className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDeletePublikasi(publikasi.id)
                              }
                              disabled={deletingPublikasiId === publikasi.id}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                            >
                              {deletingPublikasiId === publikasi.id
                                ? "Menghapus..."
                                : "Hapus"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {publikasiTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPublikasiPage((p) => Math.max(1, p - 1))}
                    disabled={publikasiPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    Halaman {publikasiPage} dari {publikasiTotalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPublikasiPage((p) =>
                        Math.min(publikasiTotalPages, p + 1)
                      )
                    }
                    disabled={publikasiPage === publikasiTotalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tema Tab */}
      {activeTab === "tema" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Daftar Tema Publikasi
            </h2>
            <button
              onClick={() => {
                setEditingTema(null);
                setTemaTranslations({
                  id: { language_code: "id", nama: "" },
                  en: { language_code: "en", nama: "" },
                  ru: { language_code: "ru", nama: "" },
                });
                setShowTemaForm(true);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              + Tambah Tema
            </button>
          </div>

          {temaError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{temaError}</p>
            </div>
          )}

          {showTemaForm && (
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingTema ? "Edit Tema" : "Tambah Tema Baru"}
              </h3>

              {/* Language Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="flex space-x-4">
                  {languages.map((lang) => {
                    const translation = temaTranslations[lang.code];
                    const hasContent = translation.nama.trim();
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setTemaActiveTab(lang.code)}
                        className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                          temaActiveTab === lang.code
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

              {/* Form */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Tema {temaActiveTab === "id" && "*"}
                </label>
                <input
                  type="text"
                  value={temaTranslations[temaActiveTab].nama}
                  onChange={(e) =>
                    handleTemaTranslationChange(
                      temaActiveTab,
                      "nama",
                      e.target.value
                    )
                  }
                  required={temaActiveTab === "id"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Masukkan nama tema dalam ${
                    languages.find((l) => l.code === temaActiveTab)?.name
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSaveTema}
                  disabled={temaFormLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {temaFormLoading
                    ? "Menyimpan..."
                    : editingTema
                    ? "Update Tema"
                    : "Simpan Tema"}
                </button>
                <button
                  onClick={handleCancelTemaForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {temaLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
            </div>
          ) : temaList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Belum ada tema</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                      Nama
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {temaList.map((tema) => (
                    <tr
                      key={tema.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white">
                        {tema.nama}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTema(tema)}
                            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTema(tema.id)}
                            disabled={deletingTemaId === tema.id}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingTemaId === tema.id
                              ? "Menghapus..."
                              : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
