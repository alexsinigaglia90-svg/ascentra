"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Section from "./Section";

type Pillar = {
  key: "ascentra" | "operis" | "astra";
  title: string;
  flavor: string;
  statement: string;
  capabilities: string[];
  deliverables: string[];
};

const pillars: Pillar[] = [
  {
    key: "ascentra",
    title: "Ascentra",
    flavor: "Strategic authority",
    statement:
      "Executive supply chain and warehousing consultancy with interim leadership for high-consequence transformations.",
    capabilities: [
      "Network and capacity strategy",
      "Warehousing design and operating model architecture",
      "Interim mandates: Head of Supply Chain, Warehouse Director, Program Lead",
      "Board-level governance and performance steering",
    ],
    deliverables: ["Mandate roadmap", "Cadence framework", "KPI command layer"],
  },
  {
    key: "operis",
    title: "Operis",
    flavor: "Operational control",
    statement:
      "Operational warehousing and logistics staffing with a BI cockpit designed for daily execution rhythm.",
    capabilities: [
      "Supervisors, planners, team leads, process engineers",
      "Live labour and throughput performance",
      "Slotting and putaway logic support",
      "Senior-backed continuous improvement routines",
    ],
    deliverables: ["Control routines", "Execution cockpit", "Throughput discipline"],
  },
  {
    key: "astra",
    title: "Astra",
    flavor: "Product innovation",
    statement:
      "Warehouse product development from API-first WMS modules to autonomous inventory workflows.",
    capabilities: [
      "Modular API-first WMS development",
      "Autonomous drone cycle counting workflows",
      "Vision, navigation and reconciliation orchestration",
      "ROI-focused rollout with enterprise-minded posture",
    ],
    deliverables: ["Release blueprint", "Deployment rails", "Measured ROI map"],
  },
];

const nodePositions = {
  ascentra: { top: "14%", left: "50%", transform: "translate(-50%, 0)" },
  operis: { top: "66%", left: "20%", transform: "translate(-50%, -50%)" },
  astra: { top: "66%", left: "80%", transform: "translate(-50%, -50%)" },
};

const activePathByKey = {
  ascentra: "M50 24 C46 34, 40 44, 30 52 C40 58, 46 61, 50 66 C54 61, 60 58, 70 52 C60 44, 54 34, 50 24 Z",
  operis: "M30 52 C36 48, 42 46, 50 42 C48 50, 46 57, 42 64 C36 62, 33 58, 30 52 Z",
  astra: "M70 52 C64 48, 58 46, 50 42 C52 50, 54 57, 58 64 C64 62, 67 58, 70 52 Z",
};

const contentVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export default function TriadPillars() {
  const [active, setActive] = useState<Pillar["key"]>("ascentra");
  const reducedMotion = useReducedMotion();
  const activePillar = useMemo(() => pillars.find((pillar) => pillar.key === active) ?? pillars[0], [active]);

  return (
    <Section id="pillars" className="section-spacing border-y border-[var(--line)] bg-white/35">
      <div className="container-shell">
        <p className="section-kicker">Three Pillars</p>
        <h2 className="text-balance text-4xl leading-tight md:text-5xl">The Ascentra Atlas Room.</h2>

        <div className="mt-10 hidden gap-8 lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="atlas-room relative h-[520px] p-7">
            <span className="ambient-orb left-[9%] top-[16%] h-24 w-24 bg-[var(--blue)]/14" aria-hidden="true" />
            <span className="ambient-orb right-[10%] bottom-[15%] h-28 w-28 bg-[var(--brown)]/14 [animation-delay:1.4s]" aria-hidden="true" />

            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="atlasLineGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(30,58,95,0.16)" />
                  <stop offset="45%" stopColor="rgba(30,58,95,0.7)" />
                  <stop offset="100%" stopColor="rgba(107,78,61,0.3)" />
                </linearGradient>
              </defs>

              <path d="M50 24 C42 37, 35 45, 30 52" fill="none" stroke="rgba(30,58,95,0.28)" strokeWidth="1.05" />
              <path d="M50 24 C58 37, 65 45, 70 52" fill="none" stroke="rgba(30,58,95,0.28)" strokeWidth="1.05" />
              <path d="M30 52 C42 62, 58 62, 70 52" fill="none" stroke="rgba(30,58,95,0.2)" strokeWidth="0.95" />

              {!reducedMotion && (
                <motion.path
                  d={activePathByKey[active]}
                  fill="none"
                  stroke="url(#atlasLineGradient)"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.5 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                />
              )}

              <circle cx="50" cy="24" r="1.35" fill="rgba(30,58,95,0.7)" />
              <circle cx="30" cy="52" r="1.35" fill="rgba(30,58,95,0.66)" />
              <circle cx="70" cy="52" r="1.35" fill="rgba(30,58,95,0.66)" />
            </svg>

            <div className="atlas-glow" style={{ top: "5%", left: "40%" }} aria-hidden="true" />

            {pillars.map((pillar) => {
              const isCore = pillar.key === "ascentra";
              return (
                <button
                  key={pillar.key}
                  type="button"
                  onClick={() => setActive(pillar.key)}
                  className={`atlas-node ${isCore ? "atlas-core" : "atlas-satellite"}`}
                  data-active={active === pillar.key}
                  style={nodePositions[pillar.key]}
                >
                  {pillar.title}
                </button>
              );
            })}

            <div className="pointer-events-none absolute bottom-5 left-6 right-6 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-[var(--ink)]/46">
              <span>Strategy</span>
              <span>Execution</span>
              <span>Product</span>
            </div>
          </div>

          <div className="atlas-panel min-h-[520px] p-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={activePillar.key}
                variants={contentVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: 0.35 }}
              >
                <motion.p variants={itemVariants} className="section-kicker">
                  {activePillar.flavor}
                </motion.p>
                <motion.h3 variants={itemVariants} className="text-4xl leading-tight md:text-[3rem]">
                  {activePillar.title}
                </motion.h3>
                <motion.p variants={itemVariants} className="muted mt-3 max-w-xl text-base leading-relaxed md:text-lg">
                  {activePillar.statement}
                </motion.p>

                <motion.ul variants={contentVariants} className="mt-6 grid gap-3">
                  {activePillar.capabilities.map((item) => (
                    <motion.li key={item} variants={itemVariants} className="atlas-chip px-4 py-3 text-sm leading-relaxed md:text-base">
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--blue)] align-middle" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div variants={itemVariants} className="mt-6 border-t border-[var(--line)] pt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]">Signature deliverables</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activePillar.deliverables.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:hidden">
          <div className="command-switch flex p-1">
            {pillars.map((pillar) => (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActive(pillar.key)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-medium tracking-wide transition ${
                  active === pillar.key
                    ? "bg-[var(--blue)] text-[var(--bg)]"
                    : "text-[var(--ink)]/75"
                }`}
              >
                {pillar.title}
              </button>
            ))}
          </div>

          <article className="atlas-panel p-5">
            <p className="section-kicker">{activePillar.flavor}</p>
            <h3 className="text-3xl">{activePillar.title}</h3>
            <p className="muted mt-2 text-sm leading-relaxed">{activePillar.statement}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {activePillar.capabilities.map((item) => (
                <li key={item} className="atlas-chip px-3 py-2">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--blue)] align-middle" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </Section>
  );
}
