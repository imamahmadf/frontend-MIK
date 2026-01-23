"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  getSosialMediaById,
  updateSosialMedia,
} from "@/lib/api/sosialMedia";
import { UpdateSosialMediaData, SosialMedia } from "@/types/sosialMedia";

export default function EditSosialMediaPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sosialMedia, setSosialMedia] = useState<SosialMedia | null>(null);
  const [formData, setFormData] = useState<UpdateSosialMediaData>({
    nama: "",
    icon: "",
    url: "",
    urutan: 0,
    aktif: true,
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchSosialMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSosialMediaById(id);
      setSosialMedia(data);
      setFormData({
        nama: data.nama,
        icon: data.icon || "",
        url: data.url,
        urutan: data.urutan,
        aktif: data.aktif,
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data sosial media");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch sosial media data
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchSosialMedia();
    }
  }, [isAuthenticated, id, fetchSosialMedia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nama?.trim()) {
      setError("Nama platform harus diisi");
      return;
    }

    if (!formData.url?.trim()) {
      setError("URL harus diisi");
      return;
    }

    // Validasi URL
    try {
      new URL(formData.url);
    } catch {
      setError("URL tidak valid. Pastikan URL dimulai dengan http:// atau https://");
      return;
    }

    try {
      setSaving(true);
      await updateSosialMedia(id, {
        nama: formData.nama,
        icon: formData.icon || null,
        url: formData.url,
        urutan: formData.urutan,
        aktif: formData.aktif,
      });
      router.push("/admin/sosial-media");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate sosial media");
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

  if (!sosialMedia) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-red-600 dark:text-red-400">
          Sosial media tidak ditemukan
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Sosial Media
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi sosial media
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
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nama Platform *
          </label>
          <input
            type="text"
            id="nama"
            value={formData.nama}
            onChange={(e) =>
              setFormData({ ...formData, nama: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Contoh: Facebook, Instagram, LinkedIn, Twitter, dll"
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            URL Link *
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://www.facebook.com/username"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pastikan URL dimulai dengan http:// atau https://
          </p>
        </div>

        <div>
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Icon (Opsional)
          </label>
          <input
            type="text"
            id="icon"
            value={formData.icon || ""}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nama icon atau URL icon (contoh: facebook, instagram, linkedin)"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nama icon dari library icon atau URL icon. Kosongkan jika tidak ada.
          </p>
        </div>

        <div>
          <label
            htmlFor="urutan"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Urutan
          </label>
          <input
            type="number"
            id="urutan"
            value={formData.urutan}
            onChange={(e) =>
              setFormData({
                ...formData,
                urutan: parseInt(e.target.value) || 0,
              })
            }
            min="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Urutan untuk sorting. Semakin kecil angkanya, semakin awal ditampilkan.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.aktif}
              onChange={(e) =>
                setFormData({ ...formData, aktif: e.target.checked })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktif (tampilkan di halaman kontak)
            </span>
          </label>
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



