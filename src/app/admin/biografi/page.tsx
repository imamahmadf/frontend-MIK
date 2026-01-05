"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllBiografi, deleteBiografi } from "@/lib/api/biografi";
import { Biografi } from "@/types/biografi";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminBiografiPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [biografiList, setBiografiList] = useState<Biografi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch biografi
  useEffect(() => {
    if (isAuthenticated) {
      fetchBiografi();
    }
  }, [isAuthenticated]);

  const fetchBiografi = async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const biografis = await getAllBiografi(lang);
      setBiografiList(biografis);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data biografi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus biografi ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteBiografi(id);
      // Refresh list
      await fetchBiografi();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus biografi");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin - Kelola Biografi
          </h1>
          <Link
            href="/admin/biografi/tambah"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Biografi
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
      ) : biografiList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Belum ada biografi</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Judul
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Slogan
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Tanggal Dibuat
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {biografiList.map((biografi) => (
                <tr
                  key={biografi.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {biografi.judul}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {biografi.isi.replace(/<[^>]*>/g, "").substring(0, 100)}
                      ...
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {biografi.slogan || "-"}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {new Date(biografi.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/biografi/${biografi.id}/edit`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(biografi.id)}
                        disabled={deletingId === biografi.id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deletingId === biografi.id ? "Menghapus..." : "Hapus"}
                      </button>
                      <Link
                        href="/biografi"
                        target="_blank"
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                      >
                        Lihat
                      </Link>
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
