"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { getAllHero, deleteHero } from "@/lib/api/hero";
import { Hero } from "@/types/hero";
import { getCurrentLanguage } from "@/lib/language";

export default function AdminHeroPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [heroList, setHeroList] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch hero
  useEffect(() => {
    if (isAuthenticated) {
      fetchHero();
    }
  }, [isAuthenticated]);

  const fetchHero = async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = getCurrentLanguage();
      const data = await getAllHero(lang);
      setHeroList(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data hero");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus hero ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteHero(id);
      // Refresh list
      await fetchHero();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus hero");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (hero: Hero) => {
    try {
      // TODO: Implement toggle active - perlu update API atau buat endpoint baru
      alert("Fitur toggle aktif akan segera ditambahkan");
    } catch (err: any) {
      alert(err.message || "Gagal mengupdate status hero");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin - Kelola Hero
          </h1>
          <Link
            href="/admin/hero/tambah"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Hero
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
      ) : heroList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Belum ada hero</p>
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
                  Nama
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Slogan
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Status
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
              {heroList.map((hero) => (
                <tr
                  key={hero.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {hero.foto ? (
                      <img
                        src={`${baseURL}${hero.foto}`}
                        alt={hero.nama}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {hero.nama}
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {hero.slogan ? (
                      <div className="line-clamp-2">{hero.slogan}</div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        hero.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {hero.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                    {new Date(hero.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/hero/${hero.id}/edit`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(hero.id)}
                        disabled={deletingId === hero.id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deletingId === hero.id ? "Menghapus..." : "Hapus"}
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
