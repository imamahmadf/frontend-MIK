"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getBeritaById, updateBerita } from "@/lib/api/berita";
import { UpdateBeritaData, Berita } from "@/types/berita";
import ReactQuillEditor from "@/components/editor/ReactQuillEditor";

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [berita, setBerita] = useState<Berita | null>(null);
  const [formData, setFormData] = useState<UpdateBeritaData>({
    judul: "",
    isi: "",
    slug: "",
    foto: null,
    fotos: [],
  });
  const [existingFotos, setExistingFotos] = useState<string[]>([]);
  const [previewFotos, setPreviewFotos] = useState<string[]>([]);

  const id = parseInt(params.id as string);

  // Redirect jika tidak authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch berita data
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchBerita();
    }
  }, [isAuthenticated, id]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBeritaById(id);
      setBerita(data);
      setFormData({
        judul: data.judul,
        isi: data.isi,
        slug: data.slug,
        foto: null,
        fotos: [],
      });
      // Set preview foto yang sudah ada
      const baseURL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
      const existing: string[] = [];
      if (data.fotos && data.fotos.length > 0) {
        data.fotos.forEach((foto) => {
          existing.push(`${baseURL}${foto.foto}`);
        });
      }
      setExistingFotos(existing);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data berita");
    } finally {
      setLoading(false);
    }
  };

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, fotos: files }));
      // Create previews
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setPreviewFotos(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewFoto = (index: number) => {
    const newFotos = formData.fotos?.filter((_, i) => i !== index) || [];
    const newPreviews = previewFotos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, fotos: newFotos }));
    setPreviewFotos(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.judul?.trim() || !formData.isi?.trim()) {
      setError("Judul dan isi harus diisi");
      return;
    }

    try {
      setSaving(true);
      await updateBerita(id, formData);
      router.push("/admin/berita");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate berita");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-red-600 dark:text-red-400">Berita tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Berita
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit informasi berita
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Judul Berita *
          </label>
          <input
            type="text"
            id="judul"
            value={formData.judul}
            onChange={(e) =>
              setFormData({ ...formData, judul: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan judul berita"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Slug (URL)
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Slug untuk URL"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ubah slug dengan hati-hati karena akan mempengaruhi URL berita.
          </p>
        </div>

        <div>
          <label
            htmlFor="fotos"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto Berita (Bisa Multiple)
          </label>
          {existingFotos.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Foto yang sudah ada:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingFotos.map((fotoUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={fotoUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            id="fotos"
            accept="image/*"
            multiple
            onChange={handleFotosChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {previewFotos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Preview foto baru:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewFotos.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFoto(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      title="Hapus foto"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload foto baru untuk ditambahkan ke berita (opsional). Format yang
            didukung: JPG, PNG, GIF. Anda bisa memilih multiple foto sekaligus.
          </p>
        </div>

        <div>
          <label
            htmlFor="isi"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Isi Berita *
          </label>
          <ReactQuillEditor
            value={formData.isi || ""}
            onChange={(value) => setFormData({ ...formData, isi: value })}
            placeholder="Masukkan isi berita..."
          />
          {!formData.isi?.trim() && (
            <p className="mt-1 text-sm text-red-500">Isi berita harus diisi</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
