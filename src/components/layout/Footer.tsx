"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import { getTranslations, Translations } from "@/lib/translations";
import { createPesan } from "@/lib/api/pesan";
import { CreatePesanData } from "@/types/pesan";

function FooterContent() {
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const [t, setT] = useState<Translations>(() => getTranslations("id"));
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        const langFromUrl = searchParams?.get("lang");
        const lang = langFromUrl
          ? (langFromUrl as LanguageCode)
          : getCurrentLanguage();
        setT(getTranslations(lang));
      } catch {
        setT(getTranslations(getCurrentLanguage()));
      }
    }
  }, [searchParams, mounted]);

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
      setError(t.contact.validationError);
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
    <footer className="bg-neutral-900 text-white">
      {/* Contact Section */}
      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            {t.contact.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                {t.contact.subtitle}
              </h3>
              <p className="text-neutral-300 mb-6">
                {t.contact.description}
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
                  <span className="text-neutral-300">
                    {t.contact.email}
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
                  <span className="text-neutral-300">
                    {t.contact.phone}
                  </span>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-sm text-red-200">
                    {error}
                  </p>
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                  <p className="text-sm text-green-200">
                    {t.contact.successMessage}
                  </p>
                </div>
              )}
              <div>
                <label
                  htmlFor="footer-nama"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  {t.contact.nameRequired}
                </label>
                <input
                  type="text"
                  id="footer-nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-neutral-800 text-white placeholder-neutral-500"
                />
              </div>
              <div>
                <label
                  htmlFor="footer-email"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  {t.contact.emailRequired}
                </label>
                <input
                  type="email"
                  id="footer-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-neutral-800 text-white placeholder-neutral-500"
                />
              </div>
              <div>
                <label
                  htmlFor="footer-kontak"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  {t.contact.contactOptional}
                </label>
                <input
                  type="text"
                  id="footer-kontak"
                  name="kontak"
                  value={formData.kontak}
                  onChange={handleChange}
                  placeholder={t.contact.contactPlaceholder}
                  className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-neutral-800 text-white placeholder-neutral-500"
                />
              </div>
              <div>
                <label
                  htmlFor="footer-judul"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  {t.contact.subjectOptional}
                </label>
                <input
                  type="text"
                  id="footer-judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder={t.contact.subjectPlaceholder}
                  className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-neutral-800 text-white placeholder-neutral-500"
                />
              </div>
              <div>
                <label
                  htmlFor="footer-pesan"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  {t.contact.messageRequired}
                </label>
                <textarea
                  id="footer-pesan"
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-neutral-800 text-white placeholder-neutral-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md w-full"
              >
                {loading ? t.contact.sending : t.contact.sendButton}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 mb-4 md:mb-0 font-medium">
              © {currentYear} Muhammad Iksan Kiat. {t.footer.rightsReserved}
            </p>
            <div className="flex space-x-6">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent transition-colors font-medium"
                aria-label="GitHub"
              >
                GitHub
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent transition-colors font-medium"
                aria-label="LinkedIn"
              >
                LinkedIn
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent transition-colors font-medium"
                aria-label="Twitter"
              >
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense
      fallback={
        <footer className="bg-neutral-900 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </footer>
      }
    >
      <FooterContent />
    </Suspense>
  );
}
