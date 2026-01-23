"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllSosialMedia, deleteSosialMedia } from "@/lib/api/sosialMedia";
import { SosialMedia } from "@/types/sosialMedia";

export default function AdminSosialMediaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [sosialMediaList, setSosialMediaList] = useState<SosialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      const response = await getAllSosialMedia();
      // Sort by urutan
      const sorted = response.sort((a, b) => a.urutan - b.urutan);
      setSosialMediaList(sorted);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data sosial media");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sosial media
  useEffect(() => {
    if (isAuthenticated) {
      fetchSosialMedia();
    }
  }, [isAuthenticated, fetchSosialMedia]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sosial media ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteSosialMedia(id);
      // Refresh list
      await fetchSosialMedia();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus sosial media");
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
            Admin - Kelola Sosial Media
          </h1>
          <Link
            href="/admin/sosial-media/tambah"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Tambah Sosial Media
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
      ) : sosialMediaList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada sosial media
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Urutan
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Nama Platform
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  URL
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {sosialMediaList.map((sosialMedia) => (
                <tr
                  key={sosialMedia.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {sosialMedia.urutan}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {sosialMedia.nama}
                    </div>
                    {sosialMedia.icon && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Icon: {sosialMedia.icon}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <a
                      href={sosialMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                    >
                      {sosialMedia.url}
                    </a>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        sosialMedia.aktif
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {sosialMedia.aktif ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/sosial-media/${sosialMedia.id}/edit`}
                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(sosialMedia.id)}
                        disabled={deletingId === sosialMedia.id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deletingId === sosialMedia.id ? "Menghapus..." : "Hapus"}
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

