"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LabTool, Language } from "../labData";

type LabDetailShellProps = {
  tool: LabTool;
};

const labels = {
  en: {
    backLab: "Ascentra Lab",
    backHome: "Back to homepage",
    brief: "Experience brief",
    mode: "Mode",
    runtime: "Expected runtime",
    readiness: "Readiness",
    state: "Current state",
    stateBody:
      "This experience route is live as a design shell and ready for scenario wiring. Next phase can include full simulation logic, score engines, and event stream integration.",
    langLabel: "Language switcher",
  },
  nl: {
    backLab: "Ascentra Lab",
    backHome: "Terug naar homepage",
    brief: "Experience briefing",
    mode: "Modus",
    runtime: "Verwachte duur",
    readiness: "Readiness",
    state: "Huidige status",
    stateBody:
      "Deze experience-route staat live als design shell en is klaar voor scenario wiring. De volgende fase kan volledige simulatie-logic, score-engines en event-stream integratie bevatten.",
    langLabel: "Taalschakelaar",
  },
} as const;

export default function LabDetailShell({ tool }: LabDetailShellProps) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main className="lab-page relative isolate min-h-screen overflow-hidden px-5 pb-14 pt-8 md:px-10 md:pt-10">
      <div className="lab-noise" aria-hidden="true" />
      <div className="lab-aurora lab-aurora-a" aria-hidden="true" />
      <div className="lab-aurora lab-aurora-b" aria-hidden="true" />

      <div className="relative z-[2] mx-auto w-full max-w-[1100px]">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 lab-reveal lab-delay-0">
          <div className="flex items-center gap-2">
            <Link href="/ascentra-lab" className="lab-top-link">
              {labels[language].backLab}
            </Link>
            <Link href="/" className="lab-chip text-[#d8e4f8]">
              {labels[language].backHome}
            </Link>
          </div>
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
        </header>

        <section className="lab-hero-panel p-6 lab-reveal lab-delay-1 md:p-10">
          <p className="mb-2 text-[0.7rem] uppercase tracking-[0.22em] text-[#9ab4dc]">{labels[language].brief}</p>
          <h1 className="lab-display text-balance text-4xl leading-[1.05] text-[#f6f9ff] md:text-6xl">
            {tool.title[language]}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#d2ddef] md:text-lg">
            {tool.strapline[language]}. {tool.description[language]}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="lab-detail-stat lab-reveal lab-delay-2">
              <p>{labels[language].mode}</p>
              <strong>{tool.mode[language]}</strong>
            </div>
            <div className="lab-detail-stat lab-reveal lab-delay-3">
              <p>{labels[language].runtime}</p>
              <strong>{tool.duration[language]}</strong>
            </div>
            <div className="lab-detail-stat lab-reveal lab-delay-4">
              <p>{labels[language].readiness}</p>
              <strong>{tool.readiness[language]}</strong>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#7a91b533] bg-[#0f1a2d80] p-5 lab-reveal lab-delay-4">
            <p className="mb-2 text-[0.66rem] uppercase tracking-[0.2em] text-[#9ab4dc]">{labels[language].state}</p>
            <p className="text-sm leading-relaxed text-[#d8e3f4] md:text-[0.95rem]">{labels[language].stateBody}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 lab-reveal lab-delay-5">
            {tool.highlights[language].map((item) => (
              <span key={item} className="lab-mini-chip">
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
