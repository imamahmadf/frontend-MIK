"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animationType?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animationType = "fade-up",
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);
          } else {
            // Hanya trigger animasi keluar jika section sudah pernah terlihat
            if (hasBeenVisible) {
              setIsVisible(false);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px", // Trigger sedikit sebelum section masuk viewport
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasBeenVisible]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700 ease-out";

    if (!hasBeenVisible) {
      // State awal (belum pernah terlihat)
      switch (animationType) {
        case "fade-up":
          return `${baseClasses} opacity-0 translate-y-8`;
        case "fade-in":
          return `${baseClasses} opacity-0`;
        case "slide-left":
          return `${baseClasses} opacity-0 -translate-x-8`;
        case "slide-right":
          return `${baseClasses} opacity-0 translate-x-8`;
        default:
          return `${baseClasses} opacity-0 translate-y-8`;
      }
    }

    if (isVisible) {
      // State visible (masuk viewport)
      return `${baseClasses} opacity-100 translate-y-0 translate-x-0`;
    } else {
      // State tidak visible (keluar viewport)
      switch (animationType) {
        case "fade-up":
          return `${baseClasses} opacity-30 -translate-y-4`;
        case "fade-in":
          return `${baseClasses} opacity-30`;
        case "slide-left":
          return `${baseClasses} opacity-30 -translate-x-4`;
        case "slide-right":
          return `${baseClasses} opacity-30 translate-x-4`;
        default:
          return `${baseClasses} opacity-30 -translate-y-4`;
      }
    }
  };

  return (
    <div
      ref={sectionRef}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
