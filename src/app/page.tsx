import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FaktaUnik from "@/components/sections/FaktaUnik";
import Slideshow from "@/components/sections/Slideshow";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import GaleriCarousel from "@/components/sections/GaleriCarousel";
import LatestNews from "@/components/sections/LatestNews";
import LatestTestimoni from "@/components/sections/LatestTestimoni";
import AnimatedSection from "@/components/layout/AnimatedSection";
import { generateSEOMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/breadcrumb";
import { SITE_URL } from "@/lib/config";

export const metadata = generateSEOMetadata({
  title: "Muhammad Iksan Kiat - Profile & Portfolio",
  description:
    "Muhammad Iksan Kiat - Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya Mineral. Profil lengkap, biografi, pengalaman, publikasi, dan kontribusi di sektor energi dan pengembangan berkelanjutan Indonesia.",
  keywords: [
    "Muhammad Iksan Kiat",
    "muhammad iksan kiat",
    "Muhammad Iksan",
    "Iksan Kiat",
    "muhammad iksan kiat esdm",
    "Muhammad Iksan Kiat Tenaga Ahli Menteri",
    "Tenaga Ahli Menteri ESDM",
    "Kementerian Energi dan Sumber Daya Mineral",
    "ESDM",
    "energi Indonesia",
    "kebijakan energi",
    "pengembangan berkelanjutan",
    "biografi Muhammad Iksan Kiat",
    "profile Muhammad Iksan Kiat",
    "muhammadiksankiat",
    "muhammadiksankiat.id",
  ],
  url: undefined, // Akan menggunakan default dari config
});

interface HomeProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomeProps) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Beranda", url: SITE_URL },
  ]);

  return (
    <>
      {/* Breadcrumb Schema untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <AnimatedSection animationType="fade-in" delay={0}>
        <Hero />
      </AnimatedSection>
      <AnimatedSection animationType="fade-up" delay={100}>
        <About />
      </AnimatedSection>
      <AnimatedSection animationType="fade-up" delay={150}>
        <FaktaUnik />
      </AnimatedSection>
      <AnimatedSection animationType="fade-up" delay={200}>
        <Experience />
      </AnimatedSection>
      {/* <AnimatedSection animationType="slide-left" delay={100}>
        <Slideshow />
      </AnimatedSection> */}
      {/* <Skills /> */}
      {/* <Projects /> */}
      <AnimatedSection animationType="fade-up" delay={200}>
        <LatestNews searchParams={searchParams} />
      </AnimatedSection>
      <AnimatedSection animationType="fade-up" delay={150}>
        <LatestTestimoni searchParams={searchParams} />
      </AnimatedSection>{" "}
      <AnimatedSection animationType="fade-up" delay={150}>
        <GaleriCarousel searchParams={searchParams} />
      </AnimatedSection>
    </>
  );
}
