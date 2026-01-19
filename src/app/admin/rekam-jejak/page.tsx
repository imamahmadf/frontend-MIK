"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllRekamJejak, deleteRekamJejak } from "@/lib/api/rekamJejak";
import { RekamJejak } from "@/types/rekamJejak";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminRekamJejakPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [rekamJejakList, setRekamJejakList] = useState<RekamJejak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchRekamJejak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const response = await getAllRekamJejak(page, 10, search, lang);
      // Sort by urutan if available, otherwise by id
      const sorted = response.data.sort((a, b) => {
        if (a.urutan !== undefined && b.urutan !== undefined) {
          return a.urutan - b.urutan;
        }
        return a.id - b.id;
      });
      setRekamJejakList(sorted);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data rekam jejak");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Fetch rekam jejak
  useEffect(() => {
    if (isAuthenticated) {
      fetchRekamJejak();
    }
  }, [page, search, isAuthenticated, fetchRekamJejak]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus rekam jejak ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteRekamJejak(id);
      // Refresh list
      await fetchRekamJejak();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus rekam jejak");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRekamJejak();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin - Kelola Rekam Jejak
          </h1>
          <Link
            href="/admin/rekam-jejak/tambah"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Tambah Rekam Jejak
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari rekam jejak..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
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
      ) : rekamJejakList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {search
              ? "Tidak ada rekam jejak yang ditemukan"
              : "Belum ada rekam jejak"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {rekamJejakList.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {item.urutan !== undefined && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                          Urutan: {item.urutan}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {item.isi || item.detail || ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Dibuat:{" "}
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/rekam-jejak/${item.id}/edit`}
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {deletingId === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
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
