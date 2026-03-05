"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Nav from "./Nav";

type Language = "en" | "nl";

type HeroVideoProps = {
  language: Language;
  onLanguageChange: (value: Language) => void;
};

const heroText = {
  en: {
    eyebrow: "Supply chain leadership, operations, and products",
    title: "Operational excellence, engineered with intelligence",
    subcopy:
      "Ascentra aligns board-level supply chain direction, operational warehousing scale, and product innovation into one cohesive system.",
    ctaPrimary: "Explore the three pillars",
    ctaSecondary: "Request an intro",
    ctaTertiary: "Open detachering",
    scroll: "Scroll",
  },
  nl: {
    eyebrow: "Supply chain leiderschap, operatie en producten",
    title: "Operationele excellentie, ontworpen met intelligentie",
    subcopy:
      "Ascentra verbindt board-level supply chain richting, operationele warehousing schaal en productinnovatie in één samenhangend systeem.",
    ctaPrimary: "Verken de drie pijlers",
    ctaSecondary: "Vraag een introductie aan",
    ctaTertiary: "Open detachering",
    scroll: "Scroll",
  },
};

export default function HeroVideo({ language, onLanguageChange }: HeroVideoProps) {
  const reducedMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const copy = heroText[language];

  const parallaxStyle = useMemo(
    () => ({
      transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
    }),
    [parallax.x, parallax.y],
  );

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    if (window.innerWidth < 992) return;

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - left) / width - 0.5;
    const py = (event.clientY - top) / height - 0.5;
    setParallax({ x: px * 10, y: py * 10 });
  };

  return (
    <section id="top" onMouseMove={handleMove} className="relative isolate min-h-screen overflow-hidden">
      {!videoFailed ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/media/hero-poster.jpg')" }}
          aria-hidden="true"
        />
      )}

      <div className="hero-vignette grain-overlay absolute inset-0" aria-hidden="true" />
      <span className="ambient-orb left-[8%] top-[18%] h-24 w-24 bg-[var(--blue)]/30" aria-hidden="true" />
      <span className="ambient-orb right-[10%] top-[24%] h-28 w-28 bg-[var(--brown)]/25 [animation-delay:2.1s]" aria-hidden="true" />
      <span className="ambient-orb bottom-[14%] left-[18%] h-20 w-20 bg-white/25 [animation-delay:1.2s]" aria-hidden="true" />
      <Nav language={language} onLanguageChange={onLanguageChange} />

      <div className="container-shell relative z-20 flex min-h-screen items-end pb-14 pt-32 md:items-center md:pb-0">
        <motion.div
          style={reducedMotion ? undefined : parallaxStyle}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl text-white"
        >
          <div className="glass-dark mb-4 inline-flex rounded-full px-4 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/85">{copy.eyebrow}</p>
          </div>
          <h1 className="headline-glow text-balance text-5xl leading-[0.93] font-semibold md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/86 md:text-lg">
            {copy.subcopy}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/operis/"
              className="rounded-full border border-white/55 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/18"
            >
              {copy.ctaTertiary}
            </a>
            <a
              href="#pillars"
              className="rounded-full bg-[var(--bg)] px-6 py-3 text-sm font-medium text-[var(--ink)] shadow-[0_14px_38px_rgba(10,16,25,0.35)] transition hover:translate-y-[-1px]"
            >
              {copy.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/55 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {copy.ctaSecondary}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-xs tracking-wide text-white/85 md:text-sm">
            <span className="glass-dark rounded-full px-4 py-2">Boardroom to warehouse floor continuity</span>
            <span className="glass-dark rounded-full px-4 py-2">Execution rhythm with measurable control</span>
            <span className="glass-dark rounded-full px-4 py-2">Product thinking inside operations</span>
          </div>
        </motion.div>
      </div>

      {!reducedMotion && (
        <motion.a
          href="#system"
          aria-label="Scroll to the Ascentra system section"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-sm tracking-wide text-white/80"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          {copy.scroll}
        </motion.a>
      )}
    </section>
  );
}
