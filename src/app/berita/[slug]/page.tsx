import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBeritaBySlug } from "@/lib/api/berita";
import "react-quill/dist/quill.snow.css";
import "../quill-content.css";

interface DetailBeritaPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: DetailBeritaPageProps): Promise<Metadata> {
  try {
    const berita = await getBeritaBySlug(params.slug);
    return {
      title: berita.judul,
      description: berita.isi.substring(0, 160),
    };
  } catch {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Halaman detail berita.",
    };
  }
}

export default async function DetailBeritaPage({
  params,
}: DetailBeritaPageProps) {
  let berita = null;
  let error = null;

  try {
    berita = await getBeritaBySlug(params.slug);
  } catch (err: any) {
    error = err.message || "Gagal memuat data berita";
    if (err.message === "Berita tidak ditemukan") {
      notFound();
    }
  }

  if (!berita) {
    notFound();
  }

  const tanggal = new Date(berita.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        href="/berita"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar Berita
      </Link>

      {/* Tanggal */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <span>{tanggal}</span>
      </div>

      {/* Judul */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {berita.judul}
      </h1>

      {/* Foto */}
      {(berita.fotos && berita.fotos.length > 0) || berita.foto ? (
        <div className="mb-8">
          {berita.fotos && berita.fotos.length > 0 ? (
            // Multiple foto - tampilkan dalam grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {berita.fotos.map((foto, index) => {
                const baseURL =
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
                return (
                  <div
                    key={foto.id}
                    className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <Image
                      src={`${baseURL}${foto.foto}`}
                      alt={`${berita.judul} - Foto ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            // Single foto (backward compatibility)
            berita.foto && (
              <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <Image
                  src={`${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"
                  }${berita.foto}`}
                  alt={berita.judul}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )
          )}
        </div>
      ) : null}

      {/* Isi Berita */}
      <article
        className="prose dark:prose-invert max-w-none mb-8 quill-content"
        dangerouslySetInnerHTML={{ __html: berita.isi }}
      />

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <Link
          href="/berita"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Kembali ke Daftar Berita
        </Link>
      </div>
    </section>
  );
}
