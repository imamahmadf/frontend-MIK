"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getAllTestimoni, deleteTestimoni } from "@/lib/api/testimoni";
import { Testimoni } from "@/types/testimoni";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminTestimoniPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch testimoni
  useEffect(() => {
    if (isAuthenticated) {
      fetchTestimoni();
    }
  }, [page, isAuthenticated]);

  const fetchTestimoni = async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const response = await getAllTestimoni(page, 10, lang);
      setTestimoniList(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data testimoni");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteTestimoni(id);
      // Refresh list
      await fetchTestimoni();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus testimoni");
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
            Admin - Kelola Testimoni
          </h1>
          <Link
            href="/admin/testimoni/tambah"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Testimoni
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
      ) : testimoniList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada testimoni
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimoniList.map((testimoni) => (
              <div
                key={testimoni.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Foto */}
                {testimoni.foto && (
                  <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={`${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:7000"
                      }${testimoni.foto}`}
                      alt={testimoni.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {testimoni.nama}
                  </h3>
                  {testimoni.tempat && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {testimoni.tempat}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
                    {testimoni.isi}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/testimoni/${testimoni.id}/edit`}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(testimoni.id)}
                      disabled={deletingId === testimoni.id}
                      className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {deletingId === testimoni.id ? "Menghapus..." : "Hapus"}
                    </button>
                    <Link
                      href={`/testimoni/${testimoni.id}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                    >
                      Lihat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sebelumnya
              </button>
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
