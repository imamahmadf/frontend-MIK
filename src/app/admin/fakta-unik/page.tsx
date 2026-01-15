"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllFaktaUnik, deleteFaktaUnik } from "@/lib/api/faktaUnik";
import { FaktaUnik } from "@/types/faktaUnik";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminFaktaUnikPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [faktaUnikList, setFaktaUnikList] = useState<FaktaUnik[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch fakta unik
  useEffect(() => {
    if (isAuthenticated) {
      fetchFaktaUnik();
    }
  }, [isAuthenticated]);

  const fetchFaktaUnik = async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const data = await getAllFaktaUnik(lang);
      setFaktaUnikList(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data fakta unik");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data fakta unik ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteFaktaUnik(id);
      // Refresh list
      await fetchFaktaUnik();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus data fakta unik");
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
            Admin - Kelola Fakta Unik
          </h1>
          <Link
            href="/admin/fakta-unik/tambah"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Tambah Fakta Unik
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
      ) : faktaUnikList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada data fakta unik
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Angka
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Satuan
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Penjelasan
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
              {faktaUnikList.map((faktaUnik) => (
                <tr
                  key={faktaUnik.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white">
                      {faktaUnik.angka}
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="text-gray-900 dark:text-white">
                      {faktaUnik.satuan || "-"}
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
                      {faktaUnik.isi}
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {new Date(faktaUnik.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/fakta-unik/${faktaUnik.id}/edit`}
                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(faktaUnik.id)}
                        disabled={deletingId === faktaUnik.id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deletingId === faktaUnik.id ? "Menghapus..." : "Hapus"}
                      </button>
                      <Link
                        href="/#fakta-unik"
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
