"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllBerita, deleteBerita } from "@/lib/api/berita";
import { Berita } from "@/types/berita";

export default function AdminBeritaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
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

  // Fetch berita
  useEffect(() => {
    if (isAuthenticated) {
      fetchBerita();
    }
  }, [page, search, isAuthenticated]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBerita(page, 10, search);
      setBeritaList(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data berita");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteBerita(id);
      // Refresh list
      await fetchBerita();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus berita");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBerita();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin - Kelola Berita
          </h1>
          <Link
            href="/admin/berita/tambah"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Berita
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berita..."
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
      ) : beritaList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {search ? "Tidak ada berita yang ditemukan" : "Belum ada berita"}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                    Judul
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                    Slug
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
                {beritaList.map((berita) => (
                  <tr
                    key={berita.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {berita.judul}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {berita.isi.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                      {berita.slug}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                      {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/berita/${berita.id}/edit`}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(berita.id)}
                          disabled={deletingId === berita.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {deletingId === berita.id ? "Menghapus..." : "Hapus"}
                        </button>
                        <Link
                          href={`/berita/${berita.slug}`}
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
