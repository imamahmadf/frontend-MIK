import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBiografi } from "@/lib/api/biografi";
import { getLanguageFromSearchParams } from "@/lib/language";
import "react-quill/dist/quill.snow.css";
import "../berita/quill-content.css";

interface BiografiPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  searchParams,
}: BiografiPageProps): Promise<Metadata> {
  try {
    const lang = searchParams
      ? getLanguageFromSearchParams(searchParams)
      : "id";
    const biografi = await getBiografi(lang);
    return {
      title: biografi.judul || "Biografi",
      description: biografi.isi
        ? biografi.isi.replace(/<[^>]*>/g, "").substring(0, 160)
        : "Profil singkat dan perjalanan karier.",
    };
  } catch {
    return {
      title: "Biografi",
      description: "Profil singkat dan perjalanan karier.",
    };
  }
}

export default async function BiografiPage({
  searchParams,
}: BiografiPageProps) {
  let biografi = null;
  const lang = searchParams ? getLanguageFromSearchParams(searchParams) : "id";

  try {
    biografi = await getBiografi(lang);
  } catch (err: any) {
    if (err.message === "Biografi tidak ditemukan") {
      notFound();
    }
    console.error("Error fetching biografi:", err);
  }

  if (!biografi) {
    notFound();
  }

  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Slogan */}
      {biografi.slogan && (
        <div className="mb-6 text-center">
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 italic">
            {biografi.slogan}
          </p>
        </div>
      )}

      {/* Judul */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {biografi.judul}
      </h1>

      {/* Isi Biografi */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none quill-content text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: biografi.isi }}
      />
    </section>
  );
}
