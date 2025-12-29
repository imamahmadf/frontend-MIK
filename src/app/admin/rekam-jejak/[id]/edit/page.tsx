"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getRekamJejakById, updateRekamJejak } from "@/lib/api/rekamJejak";
import { UpdateRekamJejakData, RekamJejak } from "@/types/rekamJejak";

export default function EditRekamJejakPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rekamJejak, setRekamJejak] = useState<RekamJejak | null>(null);
  const [formData, setFormData] = useState<UpdateRekamJejakData>({
    judul: "",
    detail: "",
    urutan: undefined,
  });

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch rekam jejak data
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchRekamJejak();
    }
  }, [isAuthenticated, id]);

  const fetchRekamJejak = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRekamJejakById(id);
      setRekamJejak(data);
      setFormData({
        judul: data.judul,
        detail: data.detail,
        urutan: data.urutan,
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat data rekam jejak");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi dengan trim untuk menghindari whitespace
    const judulTrimmed = formData.judul?.trim() || "";
    const detailTrimmed = formData.detail?.trim() || "";

    if (!judulTrimmed) {
      setError("Judul harus diisi");
      return;
    }

    if (!detailTrimmed) {
      setError("Detail harus diisi");
      return;
    }

    try {
      setSaving(true);
      const submitData: UpdateRekamJejakData = {
        judul: judulTrimmed,
        detail: detailTrimmed,
      };
      if (formData.urutan !== undefined && formData.urutan !== null) {
        submitData.urutan = formData.urutan;
      }

      // Log data yang akan dikirim untuk debugging
      console.log("Data yang akan dikirim:", submitData);

      await updateRekamJejak(id, submitData);
      router.push("/admin/rekam-jejak");
    } catch (err: any) {
      console.error("Error updating rekam jejak:", err);
      // Tampilkan error response dari backend jika ada
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengupdate rekam jejak";
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

  if (!rekamJejak) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-red-600 dark:text-red-400">
          Rekam jejak tidak ditemukan
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Rekam Jejak
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi rekam jejak
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
            htmlFor="urutan"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Urutan (Opsional)
          </label>
          <input
            type="number"
            id="urutan"
            value={formData.urutan || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                urutan: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan urutan (opsional)"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Urutan menentukan posisi rekam jejak di timeline. Kosongkan untuk
            menggunakan urutan default.
          </p>
        </div>

        <div>
          <label
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Judul *
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
            placeholder="Masukkan judul rekam jejak"
          />
        </div>

        <div>
          <label
            htmlFor="detail"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Detail *
          </label>
          <textarea
            id="detail"
            value={formData.detail}
            onChange={(e) =>
              setFormData({ ...formData, detail: e.target.value })
            }
            rows={6}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan detail rekam jejak"
          />
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
