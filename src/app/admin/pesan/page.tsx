"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  getAllPesan,
  deletePesan,
  markAsRead,
  markAsReplied,
  getPesanById,
} from "@/lib/api/pesan";
import { Pesan, PesanStatus } from "@/types/pesan";

export default function AdminPesanPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [pesanList, setPesanList] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PesanStatus | "">("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedPesan, setSelectedPesan] = useState<Pesan | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch pesan
  useEffect(() => {
    if (isAuthenticated) {
      fetchPesan();
    }
  }, [page, search, statusFilter, isAuthenticated]);

  const fetchPesan = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPesan(
        page,
        10,
        statusFilter || undefined,
        search || undefined
      );
      setPesanList(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pesan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deletePesan(id);
      await fetchPesan();
      if (selectedPesan?.id === id) {
        setSelectedPesan(null);
        setShowDetail(false);
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pesan");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      await fetchPesan();
      if (selectedPesan?.id === id) {
        const updated = await getPesanById(id);
        setSelectedPesan(updated);
      }
    } catch (err: any) {
      console.error("Error in handleMarkAsRead:", err);
      alert(err.message || "Gagal menandai pesan sebagai dibaca");
    }
  };

  const handleMarkAsReplied = async (id: number) => {
    try {
      await markAsReplied(id);
      await fetchPesan();
      if (selectedPesan?.id === id) {
        const updated = await getPesanById(id);
        setSelectedPesan(updated);
      }
    } catch (err: any) {
      console.error("Error in handleMarkAsReplied:", err);
      alert(err.message || "Gagal menandai pesan sebagai dibalas");
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const pesan = await getPesanById(id);
      setSelectedPesan(pesan);
      setShowDetail(true);
      // Auto mark as read jika status masih new
      if (pesan.status === "new") {
        await handleMarkAsRead(id);
      }
    } catch (err: any) {
      alert(err.message || "Gagal memuat detail pesan");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPesan();
  };

  const getStatusBadgeColor = (status: PesanStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusLabel = (status: PesanStatus) => {
    switch (status) {
      case "new":
        return "Baru";
      case "read":
        return "Dibaca";
      case "replied":
        return "Sudah Dibalas";
      default:
        return status;
    }
  };

  if (!isAuthenticated || !mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Admin - Kelola Pesan
        </h1>

        {/* Search dan Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pesan (nama, email, judul, pesan)..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cari
            </button>
          </form>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PesanStatus | "");
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="new">Baru</option>
            <option value="read">Dibaca</option>
            <option value="replied">Sudah Dibalas</option>
          </select>
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Pesan */}
          <div className="lg:col-span-2">
            {pesanList.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  {search || statusFilter
                    ? "Tidak ada pesan yang ditemukan"
                    : "Belum ada pesan"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pesanList.map((pesan) => (
                  <div
                    key={pesan.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg border ${
                      selectedPesan?.id === pesan.id
                        ? "border-blue-500 dark:border-blue-400 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    } transition-all cursor-pointer`}
                    onClick={() => handleViewDetail(pesan.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {pesan.judul || "Tanpa Judul"}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pesan.nama} ({pesan.email})
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(
                            pesan.status
                          )}`}
                        >
                          {getStatusLabel(pesan.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                        {pesan.pesan}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {mounted
                            ? new Date(pesan.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : new Date(pesan.createdAt)
                                .toISOString()
                                .split("T")[0]}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(pesan.id);
                            }}
                            disabled={deletingId === pesan.id}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                          >
                            {deletingId === pesan.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
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
          </div>

          {/* Detail Pesan */}
          <div className="lg:col-span-1">
            {showDetail && selectedPesan ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Detail Pesan
                  </h2>
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      setSelectedPesan(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded border ${getStatusBadgeColor(
                        selectedPesan.status
                      )}`}
                    >
                      {getStatusLabel(selectedPesan.status)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPesan.nama}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <a
                      href={`mailto:${selectedPesan.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedPesan.email}
                    </a>
                  </div>

                  {selectedPesan.kontak && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kontak
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedPesan.kontak}
                      </p>
                    </div>
                  )}

                  {selectedPesan.judul && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Judul
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedPesan.judul}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pesan
                    </label>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedPesan.pesan}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dikirim Pada
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mounted
                        ? new Date(selectedPesan.createdAt).toLocaleString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : new Date(selectedPesan.createdAt).toISOString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-2">
                      {selectedPesan.status === "new" && (
                        <button
                          onClick={() => handleMarkAsRead(selectedPesan.id)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                        >
                          Tandai sebagai Dibaca
                        </button>
                      )}
                      {selectedPesan.status !== "replied" && (
                        <button
                          onClick={() => handleMarkAsReplied(selectedPesan.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Tandai sebagai Sudah Dibalas
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selectedPesan.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Hapus Pesan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Pilih pesan untuk melihat detail
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
