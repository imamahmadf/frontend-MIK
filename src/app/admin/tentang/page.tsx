"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getAllTentang, deleteTentang } from "@/lib/api/tentang";
import { Tentang } from "@/types/tentang";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminTentangPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [tentangList, setTentangList] = useState<Tentang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch tentang
  useEffect(() => {
    if (isAuthenticated) {
      fetchTentang();
    }
  }, [isAuthenticated]);

  const fetchTentang = async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const tentang = await getAllTentang(lang);
      setTentangList(tentang);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data tentang");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data tentang ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteTentang(id);
      // Refresh list
      await fetchTentang();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus data tentang");
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
            Admin - Kelola Tentang
          </h1>
          <Link
            href="/admin/tentang/tambah"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Tambah Tentang
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
      ) : tentangList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada data tentang
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Foto
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Judul
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Isi
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
              {tentangList.map((tentang) => {
                const fotoUrl = tentang.foto
                  ? `${
                      process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"
                    }${tentang.foto}`
                  : null;
                return (
                  <tr
                    key={tentang.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {fotoUrl ? (
                        <div className="relative w-20 h-20 rounded overflow-hidden">
                          <Image
                            src={fotoUrl}
                            alt={tentang.judul}
                            fill
                            className="object-cover"
                            unoptimized={fotoUrl.startsWith("http")}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {tentang.judul}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
                        {tentang.isi.replace(/<[^>]*>/g, "").substring(0, 100)}
                        ...
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                      {new Date(tentang.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/tentang/${tentang.id}/edit`}
                          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tentang.id)}
                          disabled={deletingId === tentang.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {deletingId === tentang.id ? "Menghapus..." : "Hapus"}
                        </button>
                        <Link
                          href="/#about"
                          target="_blank"
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                        >
                          Lihat
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
