"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllPengalaman, deletePengalaman } from "@/lib/api/pengalaman";
import { Pengalaman } from "@/types/pengalaman";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminPengalamanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [pengalamanList, setPengalamanList] = useState<Pengalaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, router]);

  // Fetch pengalaman
  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchPengalaman();
    }
  }, [mounted, isAuthenticated]);

  const fetchPengalaman = async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const data = await getAllPengalaman(lang);
      setPengalamanList(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pengalaman");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengalaman ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deletePengalaman(id);
      await fetchPengalaman();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pengalaman");
    } finally {
      setDeletingId(null);
    }
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin - Kelola Pengalaman
          </h1>
          <Link
            href="/admin/pengalaman/tambah"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Tambah Pengalaman
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      ) : pengalamanList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada pengalaman
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Posisi
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Instansi
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Durasi
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Jumlah Kegiatan
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {pengalamanList.map((pengalaman) => (
                <tr
                  key={pengalaman.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {pengalaman.posisi}
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {pengalaman.instansi || "-"}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {pengalaman.durasi || "-"}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {pengalaman.kegiatans?.length || 0}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/pengalaman/${pengalaman.id}/edit`}
                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(pengalaman.id)}
                        disabled={deletingId === pengalaman.id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deletingId === pengalaman.id
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
  );
}
