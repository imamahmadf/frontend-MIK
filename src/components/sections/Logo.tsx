import { getActiveLogo } from "@/lib/api/logo";
import { Logo, JenisLogo } from "@/types/logo";
import { getApiBaseURL } from "@/lib/api-config";
import { getLanguageFromSearchParams, LanguageCode } from "@/lib/language";
import { getTranslations } from "@/lib/translations";
import LogoCarouselClient from "./LogoCarouselClient";

interface LogoSectionProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function LogoSection({ searchParams }: LogoSectionProps) {
  let logoList: Logo[] = [];
  // Gunakan bahasa dari searchParams atau default ke "id"
  const lang = searchParams ? getLanguageFromSearchParams(searchParams) : "id";
  const t = getTranslations(lang);

  try {
    logoList = await getActiveLogo();
  } catch (err) {
    console.error("Error fetching logo:", err);
    // Jika error, tetap render section dengan pesan kosong
  }

  // Jika tidak ada logo, jangan render section
  if (logoList.length === 0) {
    return null;
  }

  // Kelompokkan logo berdasarkan jenisLogoId
  const logosByJenis = logoList.reduce((acc, logo) => {
    const jenisId = logo.jenisLogoId;
    const jenisNama = logo.jenisLogo?.nama || `Jenis Logo ${jenisId}`;
    
    if (!acc[jenisId]) {
      acc[jenisId] = {
        jenisLogo: logo.jenisLogo || { id: jenisId, nama: jenisNama },
        logos: [],
      };
    }
    acc[jenisId].logos.push(logo);
    return acc;
  }, {} as Record<number, { jenisLogo: JenisLogo; logos: Logo[] }>);

  // Sort berdasarkan id untuk setiap jenis
  Object.values(logosByJenis).forEach((group) => {
    group.logos.sort((a, b) => a.id - b.id);
  });

  // Convert ke array dan sort berdasarkan nama jenis logo
  const groupedLogos = Object.values(logosByJenis).sort((a, b) =>
    a.jenisLogo.nama.localeCompare(b.jenisLogo.nama)
  );

  const baseURL = getApiBaseURL();

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.logo.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.logo.description}
          </p>
        </div>

        <div className="space-y-12">
          {groupedLogos.map((group) => (
            <div key={group.jenisLogo.id} className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
                  {group.jenisLogo.nama}
                </h3>
              </div>
              <LogoCarouselClient
                logos={group.logos}
                jenisLogo={group.jenisLogo}
                baseURL={baseURL}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

