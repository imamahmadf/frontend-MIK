"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getLogoById, updateLogo, getAllJenisLogo } from "@/lib/api/logo";
import { UpdateLogoData, Logo, JenisLogo } from "@/types/logo";
import { getApiBaseURL } from "@/lib/api-config";

export default function EditLogoPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [loadingJenis, setLoadingJenis] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<Logo | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [jenisLogoList, setJenisLogoList] = useState<JenisLogo[]>([]);
  const [formData, setFormData] = useState<UpdateLogoData>({
    jenisLogoId: undefined,
    gambarLogo: undefined,
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch jenis logo
  useEffect(() => {
    const fetchJenisLogo = async () => {
      try {
        setLoadingJenis(true);
        const data = await getAllJenisLogo();
        setJenisLogoList(data);
      } catch (err: any) {
        console.error("Error fetching jenis logo:", err);
      } finally {
        setLoadingJenis(false);
      }
    };

    if (isAuthenticated) {
      fetchJenisLogo();
    }
  }, [isAuthenticated]);

  const fetchLogo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLogoById(id);
      setLogo(data);
      setFormData({
        jenisLogoId: data.jenisLogoId,
      });
      // Set preview dengan gambarLogo yang ada
      const baseURL = getApiBaseURL();
      const imageUrl = data.gambarLogo.startsWith("http")
        ? data.gambarLogo
        : `${baseURL}${data.gambarLogo.startsWith("/") ? "" : "/"}${data.gambarLogo}`;
      setPreview(imageUrl);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data logo");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch logo data
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchLogo();
    }
  }, [isAuthenticated, id, fetchLogo]);

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

    try {
      setSaving(true);
      await updateLogo(id, {
        jenisLogoId: formData.jenisLogoId,
        gambarLogo: formData.gambarLogo,
      });
      router.push("/admin/logo");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate logo");
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

  if (error && !logo) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Logo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi logo yang sudah ada
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
            Jenis Logo {formData.jenisLogoId ? "(Opsional - kosongkan jika tidak ingin mengubah)" : "*"}
          </label>
          {loadingJenis ? (
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
              Memuat jenis logo...
            </div>
          ) : jenisLogoList.length === 0 ? (
            <div className="w-full px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              Tidak ada jenis logo tersedia.
            </div>
          ) : (
            <select
              id="jenisLogoId"
              value={formData.jenisLogoId || logo?.jenisLogoId || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jenisLogoId: parseInt(e.target.value) || undefined,
                })
              }
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
            Pilih jenis logo yang sesuai (opsional untuk update)
          </p>
        </div>

        <div>
          <label
            htmlFor="gambarLogo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Gambar Logo {formData.gambarLogo ? "(Baru)" : "(Opsional - kosongkan jika tidak ingin mengubah)"}
          </label>
          <input
            type="file"
            id="gambarLogo"
            accept="image/*"
            onChange={handleFileChange}
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
            Upload gambar logo baru (PNG, JPG, atau format gambar lainnya).
            Kosongkan jika tidak ingin mengubah gambar.
          </p>
        </div>

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

