"use client";

import { useEffect, useRef } from "react";

const PARALLAX_STRENGTH = 0.12;
const MAX_SHIFT = 48;

export default function HeroBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      if (!section || !wrapper) return;

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = sectionCenter - viewportCenter;
      const shift = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, -distance * PARALLAX_STRENGTH));

      wrapper.style.transform = `translateY(${shift}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0">
      <div
        ref={wrapperRef}
        className="absolute -top-12 -bottom-12 right-0 hidden lg:block lg:w-[40%] xl:w-[46%]"
        style={{ willChange: "transform" }}
      >
        <img
          src="/images/fasada-nocu.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{
            objectPosition: "75% 20%",
            filter: "grayscale(10%) brightness(1.25) contrast(1.25) saturate(1.35)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #0f172a 0%, rgba(15,23,42,0.95) 10%, rgba(15,23,42,0.82) 20%, rgba(15,23,42,0.62) 32%, rgba(15,23,42,0.4) 44%, rgba(15,23,42,0.2) 56%, rgba(15,23,42,0.06) 68%, transparent 80%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, transparent 20%, transparent 70%, rgba(15,23,42,0.75) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(220,38,38,0.1)", mixBlendMode: "color" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background: "#dc2626",
            mixBlendMode: "hue",
            opacity: 0.85,
            maskImage: "linear-gradient(180deg, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 40%)",
          }}
        />
      </div>
    </div>
  );
}
