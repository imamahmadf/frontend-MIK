"use client";

import { useState } from "react";
import { createPesan } from "@/lib/api/pesan";
import { CreatePesanData } from "@/types/pesan";

export default function Contact() {
  const [formData, setFormData] = useState<CreatePesanData>({
    nama: "",
    email: "",
    kontak: "",
    judul: "",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validasi
    if (
      !formData.nama.trim() ||
      !formData.email.trim() ||
      !formData.pesan.trim()
    ) {
      setError("Nama, email, dan pesan wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await createPesan({
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        kontak: formData.kontak?.trim() || undefined,
        judul: formData.judul?.trim() || undefined,
        pesan: formData.pesan.trim(),
      });

      setSuccess(true);
      setFormData({
        nama: "",
        email: "",
        kontak: "",
        judul: "",
        pesan: "",
      });

      // Reset success message setelah 5 detik
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error ketika user mulai mengetik
    if (error) setError(null);
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Kontak
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Mari Berkolaborasi
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Saya selalu terbuka untuk diskusi tentang proyek baru, peluang
              kerja, atau sekadar berkenalan. Jangan ragu untuk menghubungi
              saya!
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-primary dark:text-primary-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  email@example.com
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-primary dark:text-primary-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  +62 812-3456-7890
                </span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Terima kasih! Pesan Anda telah dikirim. Kami akan segera
                  merespons.
                </p>
              </div>
            )}
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nama *
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="kontak"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Kontak (Opsional)
              </label>
              <input
                type="text"
                id="kontak"
                name="kontak"
                value={formData.kontak}
                onChange={handleChange}
                placeholder="Nomor telepon atau WhatsApp"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="judul"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Judul (Opsional)
              </label>
              <input
                type="text"
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Subjek pesan Anda"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="pesan"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pesan *
              </label>
              <textarea
                id="pesan"
                name="pesan"
                value={formData.pesan}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-md w-full"
            >
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
