import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBiografi } from "@/lib/api/biografi";
import { getHero } from "@/lib/api/hero";
import { getLanguageFromSearchParams, LanguageCode } from "@/lib/language";
import { getApiBaseURL } from "@/lib/api-config";
import { getTranslations } from "@/lib/translations";
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

  // Ambil hero data untuk background image
  let heroData = null;
  try {
    heroData = await getHero(lang as LanguageCode);
  } catch (err) {
    // Jika hero tidak ditemukan, gunakan fallback gradient
    console.log("Hero tidak ditemukan, menggunakan gradient fallback");
  }

  const baseURL = getApiBaseURL();
  const heroImage = heroData?.foto ? `${baseURL}${heroData.foto}` : null;
  const t = getTranslations(lang as LanguageCode);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] min-h-[400px] max-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: heroImage 
              ? `url(${heroImage})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay untuk readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
        
        {/* Gradient overlay untuk depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/20 backdrop-blur-md border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm font-semibold text-white">
                {t.nav.biography}
              </span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            {biografi.judul}
          </h1>
          {biografi.slogan && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {biografi.slogan}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Isi Biografi */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none quill-content text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: biografi.isi }}
        />
      </section>
    </>
  );
}
