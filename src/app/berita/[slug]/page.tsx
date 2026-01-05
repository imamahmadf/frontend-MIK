import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBeritaBySlug } from "@/lib/api/berita";
import { getLanguageFromSearchParams } from "@/lib/language";
import "react-quill/dist/quill.snow.css";
import "../quill-content.css";

interface DetailBeritaPageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
  searchParams,
}: DetailBeritaPageProps): Promise<Metadata> {
  try {
    const lang = searchParams
      ? getLanguageFromSearchParams(searchParams)
      : "id";
    const berita = await getBeritaBySlug(params.slug, lang);
    const beritaIsi = typeof berita.isi === "string" ? berita.isi : "";
    const beritaJudul =
      typeof berita.judul === "string" ? berita.judul : "Berita";
    return {
      title: beritaJudul,
      description:
        berita.meta_description ||
        (beritaIsi
          ? beritaIsi.replace(/<[^>]*>/g, "").substring(0, 160)
          : "Halaman detail berita."),
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
  searchParams,
}: DetailBeritaPageProps) {
  let berita = null;
  let error = null;
  const lang = searchParams ? getLanguageFromSearchParams(searchParams) : "id";

  try {
    berita = await getBeritaBySlug(params.slug, lang);
  } catch (err: any) {
    error = err.message || "Gagal memuat data berita";
    if (err.message === "Berita tidak ditemukan") {
      notFound();
    }
  }

  if (!berita) {
    notFound();
  }

  // Pastikan berita.isi selalu string
  const beritaIsi = typeof berita.isi === "string" ? berita.isi : "";
  const beritaJudul = typeof berita.judul === "string" ? berita.judul : "";

  const tanggal = new Date(berita.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Preserve lang parameter in links
  const backLinkHref =
    lang && lang !== "id" ? `/berita?lang=${lang}` : "/berita";

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        href={backLinkHref}
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
        {beritaJudul}
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
                      alt={`${beritaJudul} - Foto ${index + 1}`}
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
                  alt={beritaJudul}
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
      {beritaIsi ? (
        <article
          className="prose dark:prose-invert max-w-none mb-8 quill-content"
          dangerouslySetInnerHTML={{
            __html: beritaIsi,
          }}
        />
      ) : (
        <div className="mb-8 text-gray-500 dark:text-gray-400">
          <p>Konten berita tidak tersedia dalam bahasa ini.</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <Link
          href={backLinkHref}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Kembali ke Daftar Berita
        </Link>
      </div>
    </section>
  );
}
