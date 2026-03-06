"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TimelineItem = {
  period: string;
  title: string;
  impact: string;
};

type CaseStudy = {
  title: string;
  context: string;
  action: string;
  outcome: string;
  linkedRoles: string[];
};

type Props = {
  summaryHighlights: string[];
  timeline: TimelineItem[];
  caseStudies: CaseStudy[];
  capabilitySignals: string[];
  signatureMetrics: string[];
};

type DeckTab = "evidence" | "timeline" | "fit";

export function ProfileCommandDeck({
  summaryHighlights,
  timeline,
  caseStudies,
  capabilitySignals,
  signatureMetrics,
}: Props) {
  const [tab, setTab] = useState<DeckTab>("evidence");

  const labels: Record<DeckTab, string> = {
    evidence: "Evidence Cases",
    timeline: "Delivery Timeline",
    fit: "Capability Fit",
  };

  const hasTimeline = timeline.length > 0;
  const hasCases = caseStudies.length > 0;

  const fallbackTimeline = useMemo(
    () =>
      summaryHighlights.slice(0, 3).map((item, index) => ({
        period: `Track ${index + 1}`,
        title: "Operational Milestone",
        impact: item,
      })),
    [summaryHighlights]
  );

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(labels) as DeckTab[]).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setTab(entry)}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-[#1E3A5F] transition"
            style={{
              background: tab === entry ? "rgba(30,58,95,0.14)" : "rgba(255,255,255,0.7)",
              borderColor: tab === entry ? "rgba(30,58,95,0.36)" : "rgba(17,18,20,0.12)",
            }}
          >
            {labels[entry]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="mt-5"
        >
          {tab === "evidence" && (
            <div className="space-y-3">
              {hasCases ? (
                caseStudies.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-black/10 bg-white/75 p-4">
                    <h3 className="text-base font-semibold text-[#1E3A5F]">{item.title}</h3>
                    <p className="mt-2 text-sm text-black/75">
                      <span className="font-semibold text-black/85">Context:</span> {item.context}
                    </p>
                    <p className="mt-1 text-sm text-black/75">
                      <span className="font-semibold text-black/85">Aanpak:</span> {item.action}
                    </p>
                    <p className="mt-1 text-sm text-black/75">
                      <span className="font-semibold text-black/85">Resultaat:</span> {item.outcome}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.linkedRoles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full border border-black/10 bg-[#1E3A5F]/8 px-2.5 py-1 text-[11px] text-[#1E3A5F]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                summaryHighlights.map((item) => (
                  <article key={item} className="rounded-2xl border border-black/10 bg-white/75 p-4 text-sm text-black/75">
                    {item}
                  </article>
                ))
              )}
            </div>
          )}

          {tab === "timeline" && (
            <div className="space-y-3">
              {(hasTimeline ? timeline : fallbackTimeline).map((item, index) => (
                <div key={`${item.period}-${item.title}-${index}`} className="grid gap-2 rounded-2xl border border-black/10 bg-white/75 p-4 sm:grid-cols-[8rem_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6A4B2A]">{item.period}</p>
                  <div>
                    <p className="text-sm font-semibold text-[#1E3A5F]">{item.title}</p>
                    <p className="mt-1 text-sm text-black/75">{item.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "fit" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <article className="rounded-2xl border border-black/10 bg-white/75 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6A4B2A]">Capability Signals</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {capabilitySignals.map((item) => (
                    <span key={item} className="rounded-full border border-black/10 bg-[#1E3A5F]/8 px-3 py-1.5 text-xs font-medium text-[#1E3A5F]">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-black/10 bg-white/75 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6A4B2A]">Signature Metrics</h3>
                <ul className="mt-3 space-y-2">
                  {signatureMetrics.map((item) => (
                    <li key={item} className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-black/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
