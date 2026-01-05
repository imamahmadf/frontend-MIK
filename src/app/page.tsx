import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Slideshow from "@/components/sections/Slideshow";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import GaleriCarousel from "@/components/sections/GaleriCarousel";
import LatestNews from "@/components/sections/LatestNews";
import LatestTestimoni from "@/components/sections/LatestTestimoni";
import Contact from "@/components/sections/Contact";

interface HomeProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <>
      <Hero />
      <About />
      <Slideshow />
      <Experience />
      <Skills />
      <Projects />
      <GaleriCarousel />
      <LatestNews searchParams={searchParams} />
      <LatestTestimoni searchParams={searchParams} />
      <Contact />
    </>
  );
}
