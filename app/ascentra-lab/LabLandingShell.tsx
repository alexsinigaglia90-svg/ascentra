"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Language } from "./labData";
import { labTools } from "./labData";

const accentStyles = {
  blue: {
    orb: "bg-[radial-gradient(circle,_rgba(70,122,201,0.45)_0%,_rgba(70,122,201,0)_68%)]",
    chip: "border-[#5c88c7]/30 bg-[#5c88c7]/10 text-[#223b62]",
    edge: "group-hover:border-[#5c88c7]/65",
  },
  amber: {
    orb: "bg-[radial-gradient(circle,_rgba(181,126,64,0.45)_0%,_rgba(181,126,64,0)_68%)]",
    chip: "border-[#b57e40]/30 bg-[#b57e40]/10 text-[#5a3f1f]",
    edge: "group-hover:border-[#b57e40]/65",
  },
  teal: {
    orb: "bg-[radial-gradient(circle,_rgba(56,140,127,0.45)_0%,_rgba(56,140,127,0)_68%)]",
    chip: "border-[#388c7f]/30 bg-[#388c7f]/10 text-[#174640]",
    edge: "group-hover:border-[#388c7f]/65",
  },
  slate: {
    orb: "bg-[radial-gradient(circle,_rgba(72,92,117,0.45)_0%,_rgba(72,92,117,0)_68%)]",
    chip: "border-[#485c75]/30 bg-[#485c75]/10 text-[#1f2c39]",
    edge: "group-hover:border-[#485c75]/65",
  },
} as const;

const labels = {
  en: {
    backHome: "Back to home",
    env: "Lab Environment",
    nav: "Simulation Navigation",
    pageTag: "Ascentra Lab",
    heroTitle: "Simulator-grade experiences designed like mission hardware.",
    heroBody:
      "This environment is the launch corridor to operational simulators and hands-on experiences. Every card below opens a dedicated path where teams can train, compete, and pressure-test performance behavior.",
    kpiA: "4 Active experiences",
    kpiB: "AAA interaction shell",
    kpiC: "Built for desktop + mobile",
    matrix: "launch matrix",
    cardLabel: "Experience",
    enter: "Enter experience",
    langLabel: "Language switcher",
  },
  nl: {
    backHome: "Terug naar home",
    env: "Lab Omgeving",
    nav: "Simulatie Navigatie",
    pageTag: "Ascentra Lab",
    heroTitle: "Simulator-grade experiences ontworpen als mission hardware.",
    heroBody:
      "Deze omgeving is de launch corridor naar operationele simulators en hands-on experiences. Elke kaart hieronder opent een eigen pad waar teams kunnen trainen, concurreren en performancegedrag onder druk kunnen testen.",
    kpiA: "4 Actieve experiences",
    kpiB: "AAA interaction shell",
    kpiC: "Gebouwd voor desktop + mobiel",
    matrix: "launch matrix",
    cardLabel: "Experience",
    enter: "Open experience",
    langLabel: "Taalschakelaar",
  },
} as const;

export default function LabLandingShell() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main id="top" className="lab-page relative isolate overflow-hidden">
      <div className="lab-noise" aria-hidden="true" />
      <div className="lab-aurora lab-aurora-a" aria-hidden="true" />
      <div className="lab-aurora lab-aurora-b" aria-hidden="true" />

      <section className="relative px-5 pb-12 pt-8 md:px-10 md:pb-18 md:pt-10">
        <div className="mx-auto w-full max-w-[1240px]">
          <header className="mb-10 flex flex-wrap items-center justify-between gap-4 lab-reveal lab-delay-0">
            <Link href="/" className="lab-top-link" aria-label={labels[language].backHome}>
              Ascentra
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-[#e8eef8]/75">
              <span className="lab-chip">{labels[language].env}</span>
              <span className="lab-chip">{labels[language].nav}</span>
              <div className="lab-lang-toggle" role="group" aria-label={labels[language].langLabel}>
                <button
                  type="button"
                  onClick={() => setLanguage("nl")}
                  className={`lab-lang-btn ${language === "nl" ? "is-active" : ""}`}
                >
                  NL
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`lab-lang-btn ${language === "en" ? "is-active" : ""}`}
                >
                  EN
                </button>
              </div>
            </div>
          </header>

          <div className="lab-hero-panel mb-9 lab-reveal lab-delay-1 md:mb-12">
            <div className="grid gap-9 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
              <div>
                <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#9ab4dc]">
                  {labels[language].pageTag}
                </p>
                <h1 className="lab-display text-balance text-4xl leading-[1.04] md:text-6xl">
                  {labels[language].heroTitle}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4deee] md:text-lg">
                  {labels[language].heroBody}
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <span className="lab-kpi">{labels[language].kpiA}</span>
                  <span className="lab-kpi">{labels[language].kpiB}</span>
                  <span className="lab-kpi">{labels[language].kpiC}</span>
                </div>
              </div>

              <aside className="lab-status-board">
                <p className="mb-4 text-[0.64rem] uppercase tracking-[0.25em] text-[#9ab4dc]">{labels[language].matrix}</p>
                <div className="space-y-3">
                  {labTools.map((tool, index) => (
                    <div
                      key={tool.slug}
                      className={`lab-status-row lab-reveal lab-delay-${Math.min(index + 2, 5)}`}
                    >
                      <span className="text-[#9ab4dc]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="truncate text-[#edf3ff]">{tool.title[language]}</span>
                      <span className="text-[#9fc0a8]">{tool.readiness[language]}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>

          <section aria-label="Ascentra Lab tools" className="grid gap-5 md:grid-cols-2">
            {labTools.map((tool, index) => {
              const accent = accentStyles[tool.accent];

              return (
                <Link
                  key={tool.slug}
                  href={`/ascentra-lab/${tool.slug}`}
                  className={`lab-card group ${accent.edge} lab-reveal lab-delay-${Math.min(index + 2, 5)}`}
                >
                  <div className={`lab-card-orb ${accent.orb}`} aria-hidden="true" />

                  <div className="relative z-[2] flex h-full flex-col">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="mb-2 text-[0.66rem] uppercase tracking-[0.22em] text-[#96a7c1]">
                          {labels[language].cardLabel}
                        </p>
                        <h2 className="text-balance text-2xl leading-tight text-[#f5f8ff] md:text-3xl">
                          {tool.title[language]}
                        </h2>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.16em] ${accent.chip}`}>
                        {tool.mode[language]}
                      </span>
                    </div>

                    <p className="mb-5 text-sm leading-relaxed text-[#c4d0e4] md:text-[0.95rem]">
                      {tool.strapline[language]}. {tool.description[language]}
                    </p>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {tool.highlights[language].map((item) => (
                        <span key={item} className="lab-mini-chip">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-[#6f85ad33] pt-4 text-[0.7rem] uppercase tracking-[0.16em] text-[#9ab4dc]">
                      <span>{tool.duration[language]}</span>
                      <span className="lab-link-arrow">{labels[language].enter}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        </div>
      </section>
    </main>
  );
}
