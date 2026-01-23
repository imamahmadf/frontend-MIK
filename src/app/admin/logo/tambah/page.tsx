"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createLogo, getAllJenisLogo } from "@/lib/api/logo";
import { CreateLogoData, JenisLogo } from "@/types/logo";

export default function TambahLogoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [loadingJenis, setLoadingJenis] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [jenisLogoList, setJenisLogoList] = useState<JenisLogo[]>([]);
  const [formData, setFormData] = useState<CreateLogoData>({
    jenisLogoId: 0,
    gambarLogo: null as any,
  });

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch jenis logo
  useEffect(() => {
    const fetchJenisLogo = async () => {
      try {
        setLoadingJenis(true);
        const data = await getAllJenisLogo();
        setJenisLogoList(data);
      } catch (err: any) {
        console.error("Error fetching jenis logo:", err);
        setError("Gagal memuat jenis logo");
      } finally {
        setLoadingJenis(false);
      }
    };

    if (isAuthenticated) {
      fetchJenisLogo();
    }
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, gambarLogo: file });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.jenisLogoId || formData.jenisLogoId === 0) {
      setError("Jenis Logo harus dipilih");
      return;
    }

    if (!formData.gambarLogo) {
      setError("Gambar logo harus diupload");
      return;
    }

    try {
      setLoading(true);
      await createLogo({
        jenisLogoId: formData.jenisLogoId,
        gambarLogo: formData.gambarLogo,
      });
      router.push("/admin/logo");
    } catch (err: any) {
      setError(err.message || "Gagal membuat logo");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tambah Logo Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tambahkan logo baru untuk ditampilkan di halaman utama
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="jenisLogoId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Jenis Logo *
          </label>
          {loadingJenis ? (
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
              Memuat jenis logo...
            </div>
          ) : jenisLogoList.length === 0 ? (
            <div className="w-full px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              Tidak ada jenis logo tersedia. Silakan buat jenis logo terlebih dahulu.
            </div>
          ) : (
            <select
              id="jenisLogoId"
              value={formData.jenisLogoId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jenisLogoId: parseInt(e.target.value),
                })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="0">Pilih Jenis Logo</option>
              {jenisLogoList.map((jenis) => (
                <option key={jenis.id} value={jenis.id}>
                  {jenis.nama}
                </option>
              ))}
            </select>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pilih jenis logo yang sesuai
          </p>
        </div>

        <div>
          <label
            htmlFor="gambarLogo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Gambar Logo *
          </label>
          <input
            type="file"
            id="gambarLogo"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Preview:
              </p>
              <div className="w-48 h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload gambar logo (PNG, JPG, atau format gambar lainnya)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Logo"}
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

