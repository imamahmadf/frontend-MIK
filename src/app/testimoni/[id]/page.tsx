import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTestimoniById } from "@/lib/api/testimoni";
import { getLanguageFromSearchParams } from "@/lib/language";

interface DetailTestimoniPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
  searchParams,
}: DetailTestimoniPageProps): Promise<Metadata> {
  try {
    const lang = searchParams
      ? getLanguageFromSearchParams(searchParams)
      : "id";
    const testimoni = await getTestimoniById(parseInt(params.id), lang);
    return {
      title: `Testimoni - ${testimoni.nama}`,
      description: testimoni.isi
        ? testimoni.isi.replace(/<[^>]*>/g, "").substring(0, 160)
        : "Halaman detail testimoni.",
    };
  } catch {
    return {
      title: "Testimoni Tidak Ditemukan",
      description: "Halaman detail testimoni.",
    };
  }
}

export default async function DetailTestimoniPage({
  params,
  searchParams,
}: DetailTestimoniPageProps) {
  let testimoni = null;
  let error = null;
  const lang = searchParams ? getLanguageFromSearchParams(searchParams) : "id";

  try {
    testimoni = await getTestimoniById(parseInt(params.id), lang);
  } catch (err: any) {
    error = err.message || "Gagal memuat data testimoni";
    if (err.message === "Testimoni tidak ditemukan") {
      notFound();
    }
  }

  if (!testimoni) {
    notFound();
  }

  // Preserve lang parameter in links
  const backLinkHref =
    lang && lang !== "id" ? `/testimoni?lang=${lang}` : "/testimoni";

  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
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
        Kembali ke Daftar Testimoni
      </Link>

      {/* Testimoni Card */}
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Foto */}
        {testimoni.foto && (
          <div className="relative w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700">
            <Image
              src={`${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"
              }${testimoni.foto}`}
              alt={testimoni.nama}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {testimoni.nama}
          </h1>

          {testimoni.tempat && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {testimoni.tempat}
            </p>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {testimoni.isi}
            </p>
          </div>

          {/* Date */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ditambahkan pada{" "}
              {new Date(testimoni.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
