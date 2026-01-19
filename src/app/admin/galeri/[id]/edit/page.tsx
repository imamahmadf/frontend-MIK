"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getGaleriById, updateGaleri } from "@/lib/api/galeri";
import { UpdateGaleriData, Galeri } from "@/types/galeri";

export default function EditGaleriPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galeri, setGaleri] = useState<Galeri | null>(null);
  const [formData, setFormData] = useState<UpdateGaleriData>({
    judul: "",
    deskripsi: "",
    foto: undefined,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchGaleri = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGaleriById(id);
      setGaleri(data);
      setFormData({
        judul: data.judul,
        deskripsi: data.deskripsi || "",
        foto: undefined,
      });
      setPreview(`${baseURL}${data.foto}`);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data galeri");
    } finally {
      setLoading(false);
    }
  }, [id, baseURL]);

  // Fetch galeri data
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchGaleri();
    }
  }, [isAuthenticated, id, fetchGaleri]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
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

    if (!formData.judul?.trim()) {
      setError("Judul harus diisi");
      return;
    }

    try {
      setSaving(true);
      await updateGaleri(id, formData);
      router.push("/admin/galeri");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate galeri");
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

  if (!galeri) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-red-600 dark:text-red-400">Galeri tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Foto Galeri
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi foto galeri
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
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Judul Foto *
          </label>
          <input
            type="text"
            id="judul"
            value={formData.judul}
            onChange={(e) =>
              setFormData({ ...formData, judul: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan judul foto"
          />
        </div>

        <div>
          <label
            htmlFor="deskripsi"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Deskripsi (Opsional)
          </label>
          <textarea
            id="deskripsi"
            value={formData.deskripsi}
            onChange={(e) =>
              setFormData({ ...formData, deskripsi: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan deskripsi foto (opsional)"
          />
        </div>

        <div>
          <label
            htmlFor="foto"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto (Opsional - Kosongkan jika tidak ingin mengubah foto)
          </label>
          {preview && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {formData.foto ? "Preview foto baru:" : "Foto saat ini:"}
              </p>
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          )}
          <input
            type="file"
            id="foto"
            accept="image/*"
            onChange={handleFotoChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload foto baru untuk mengganti foto yang ada (opsional). Format
            yang didukung: JPG, PNG, GIF.
          </p>
        </div>

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
