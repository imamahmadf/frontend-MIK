"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getAllLogo, deleteLogo } from "@/lib/api/logo";
import { Logo } from "@/types/logo";
import { getApiBaseURL } from "@/lib/api-config";

export default function AdminLogoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoList, setLogoList] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const fetchLogo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllLogo();
      // Sort by id
      const sorted = response.sort((a, b) => a.id - b.id);
      setLogoList(sorted);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data logo");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch logo
  useEffect(() => {
    if (isAuthenticated) {
      fetchLogo();
    }
  }, [isAuthenticated, fetchLogo]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus logo ini?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteLogo(id);
      // Refresh list
      await fetchLogo();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus logo");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const baseURL = getApiBaseURL();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin - Kelola Logo
          </h1>
          <Link
            href="/admin/logo/tambah"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Tambah Logo
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
      ) : logoList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada logo. Klik tombol "Tambah Logo" untuk menambahkan logo baru.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Logo
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Jenis Logo
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {logoList.map((logo) => {
                const imageUrl = logo.gambarLogo.startsWith("http")
                  ? logo.gambarLogo
                  : `${baseURL}${logo.gambarLogo.startsWith("/") ? "" : "/"}${logo.gambarLogo}`;

                const jenisLogoName = logo.jenisLogo?.nama || `Jenis Logo ID: ${logo.jenisLogoId}`;

                return (
                  <tr
                    key={logo.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">
                      {logo.id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="flex items-center justify-center w-24 h-16 bg-gray-50 dark:bg-gray-800 rounded">
                        <Image
                          src={imageUrl}
                          alt={jenisLogoName}
                          width={80}
                          height={50}
                          className="object-contain max-w-full max-h-full"
                          unoptimized={imageUrl.startsWith("http")}
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {jenisLogoName}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/logo/${logo.id}/edit`}
                          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(logo.id)}
                          disabled={deletingId === logo.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {deletingId === logo.id ? "Menghapus..." : "Hapus"}
                        </button>
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

