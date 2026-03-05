"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Section from "./Section";

type Pillar = {
  key: "ascentra" | "operis" | "astra";
  title: string;
  flavor: string;
  tagline: string;
  capabilities: string[];
  deliverables: string[];
};

const pillars: Pillar[] = [
  {
    key: "ascentra",
    title: "Ascentra",
    flavor: "Strategic authority",
    tagline: "Executive supply chain consultancy and interim leadership for high-consequence transformations.",
    capabilities: [
      "Network, capacity and warehousing strategy",
      "Operating model design and governance architecture",
      "Interim leadership: Head of Supply Chain, Warehouse Director, Program Lead, Control Tower Lead",
      "Transformation command with board-level steering discipline",
    ],
    deliverables: ["Roadmap mandate", "Cadence architecture", "KPI command model"],
  },
  {
    key: "operis",
    title: "Operis",
    flavor: "Operational control",
    tagline: "Warehousing and logistics staffing paired with a BI cockpit built for daily execution rhythm.",
    capabilities: [
      "Supervisors, planners, team leads, process engineers",
      "Live labour and throughput performance visibility",
      "Slotting and putaway logic support",
      "Continuous improvement routines backed by senior professionals",
    ],
    deliverables: ["Daily control routines", "Productivity pulse", "Execution cockpit"],
  },
  {
    key: "astra",
    title: "Astra",
    flavor: "Product innovation",
    tagline: "Product development for modern warehouse operations, from core systems to autonomous inventory workflows.",
    capabilities: [
      "API-first modular WMS development",
      "Autonomous drone cycle counting workflows",
      "Vision, navigation and reconciliation orchestration",
      "ROI-driven rollout with enterprise-minded deployment posture",
    ],
    deliverables: ["Release blueprint", "Deployment rails", "Measured ROI map"],
  },
];

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
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
        <h2 className="text-balance text-4xl leading-tight md:text-5xl">The Ascentra command deck.</h2>

        <div className="mt-8 command-switch inline-flex p-1">
          {pillars.map((pillar) => (
            <button
              key={pillar.key}
              type="button"
              onClick={() => setActive(pillar.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium tracking-wide transition md:px-5 ${
                active === pillar.key
                  ? "bg-[var(--blue)] text-[var(--bg)] shadow-[0_10px_24px_rgba(30,58,95,0.35)]"
                  : "text-[var(--ink)]/78 hover:bg-white"
              }`}
            >
              {pillar.title}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="command-stage command-grid p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={activePillar.key}
                variants={contentVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: 0.35 }}
                className="relative z-10"
              >
                <motion.p variants={itemVariants} className="section-kicker">
                  {activePillar.flavor}
                </motion.p>
                <motion.h3 variants={itemVariants} className="text-4xl leading-tight md:text-5xl">
                  {activePillar.title}
                </motion.h3>
                <motion.p variants={itemVariants} className="muted mt-3 max-w-2xl text-base leading-relaxed md:text-lg">
                  {activePillar.tagline}
                </motion.p>

                <motion.ul variants={contentVariants} className="mt-6 grid gap-3 md:grid-cols-2">
                  {activePillar.capabilities.map((item) => (
                    <motion.li key={item} variants={itemVariants} className="pillar-tile p-4 text-sm leading-relaxed md:text-base">
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

          <div className="space-y-3">
            {pillars.map((pillar) => (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActive(pillar.key)}
                className="pillar-tile w-full p-4 text-left"
                data-active={active === pillar.key}
              >
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--blue)]/72">{pillar.flavor}</p>
                <p className="mt-1 font-serif text-3xl leading-none">{pillar.title}</p>
                <p className="muted mt-2 text-sm leading-relaxed">{pillar.tagline}</p>
              </button>
            ))}
          </div>
        </div>

        {!reducedMotion && (
          <motion.div
            className="mt-5 text-xs uppercase tracking-[0.2em] text-[var(--ink)]/46"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Switch pillars to reveal the full operating model
          </motion.div>
        )}
      </div>
    </Section>
  );
}
