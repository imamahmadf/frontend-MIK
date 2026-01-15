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
import Contact from "@/components/sections/Contact";
import AnimatedSection from "@/components/layout/AnimatedSection";

interface HomeProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <>
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
      <AnimatedSection animationType="fade-up" delay={200}>
        <Contact />
      </AnimatedSection>
    </>
  );
}
