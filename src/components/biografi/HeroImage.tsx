"use client";

import Image from "next/image";
import fotoProfile from "@/assets/kakIksan.png";

interface HeroImageProps {
  alt: string;
  fullHeight?: boolean;
}

export default function HeroImage({ alt, fullHeight = false }: HeroImageProps) {
  // Get foto URL - handle both string and object types from static import
  const fotoUrl = typeof fotoProfile === "string"
    ? fotoProfile
    : (fotoProfile as any)?.src || fotoProfile;

  return (
    <div className={`flex-shrink-0 relative z-20 ${fullHeight ? 'h-full flex items-center' : ''}`}>
      <div className={`relative ${fullHeight ? 'h-full' : 'w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80'} ${fullHeight ? 'w-auto min-w-[250px] md:min-w-[300px] lg:min-w-[350px]' : ''} group`}>
        {/* Glow effect */}
        <div className="a" />
        
        {/* Image container */}
        <div className="relative w-full h-full overflow-hidden rounded-lg ">
          <Image
            src={fotoUrl}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            sizes={fullHeight ? "(max-width: 768px) 250px, (max-width: 1024px) 300px, 350px" : "(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"}
            style={{ objectFit: 'cover' }}
          />
          {/* Overlay gradient untuk depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

