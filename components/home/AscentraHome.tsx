"use client";

import { useEffect, useRef, useState } from "react";
import { buildAscentra, buildAstra, buildOperis, type FrescoUpdate } from "./frescoes";
import { createHeroField } from "./heroField";

const EMAIL = "info@ascentra.nl";
const PHONE = "030 - 2496878";

export default function AscentraHome() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const triptRef = useRef<HTMLDivElement>(null);
  const heroCvRef = useRef<HTMLCanvasElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const artOpRef = useRef<SVGSVGElement>(null);
  const artAscRef = useRef<SVGSVGElement>(null);
  const artAstRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // scroll progress (--sc) + reveal-on-view
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const reveal = () => {
      const box = el.getBoundingClientRect();
      el.querySelectorAll<HTMLElement>("[data-rv]:not(.on)").forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < box.top + box.height * 0.94 && r.bottom > box.top - box.height * 0.2) n.classList.add("on");
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const p = Math.min(1, Math.max(0, el.scrollTop / (el.clientHeight * 0.85)));
        el.style.setProperty("--sc", p.toFixed(3));
        reveal();
      });
    };
    reveal();
    const tick = setInterval(reveal, 260);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(tick);
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // hero field canvas + triptych frescoes, driven by one rAF loop
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const frescoes: FrescoUpdate[] = [];
    const jobs: [SVGSVGElement | null, (svg: SVGSVGElement) => FrescoUpdate][] = [
      [artOpRef.current, buildOperis],
      [artAscRef.current, buildAscentra],
      [artAstRef.current, buildAstra],
    ];
    for (const [svg, build] of jobs) {
      if (!svg) continue;
      try {
        frescoes.push(build(svg));
      } catch (e) {
        console.warn("fresco", e);
      }
    }
    const drawHero = createHeroField();
    const t0 = performance.now();
    let last = t0, heroT = 0, frame = 0, raf = 0, heroCleared = false;

    const sizeCanvas = (cv: HTMLCanvasElement, w: number, h: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.round(w * dpr), H = Math.round(h * dpr);
      if (cv.width !== W || cv.height !== H) {
        cv.width = W;
        cv.height = H;
      }
      const ctx = cv.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) heroT += dt;

      const tript = triptRef.current;
      if (tript && frescoes.length) {
        const r = tript.getBoundingClientRect();
        if (r.bottom > -160 && r.top < window.innerHeight + 160) {
          // rAF timestamps can precede t0 on the first frame; negative t breaks the modulo indexing
          const t = reduced ? 8 : Math.max(0, (now - t0) / 1000);
          frame++;
          for (const fn of frescoes) fn(t, frame);
        }
      }

      const hero = heroCvRef.current, sc = scrollerRef.current;
      if (hero && sc) {
        const vh = sc.clientHeight;
        const spv = sc.scrollTop / vh;
        // fade the field out as the contact section arrives (2 screens down on desktop, further on mobile)
        const contactAt = (contactRef.current?.offsetTop ?? vh * 2) / vh;
        const fd = 1 - Math.min(1, Math.max(0, (spv - (contactAt - 0.45)) / 0.45));
        const hr = hero.getBoundingClientRect();
        if (hr.width && (fd > 0 || !heroCleared)) {
          const ctx = sizeCanvas(hero, hr.width, hr.height);
          if (ctx) drawHero(ctx, hr.width, hr.height, reduced ? 1 : heroT, Math.min(1, spv / 0.85), fd);
          heroCleared = fd <= 0;
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copy = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt).catch(() => {});
    setCopied(label);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 1700);
  };

  const goContact = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: contactRef.current?.offsetTop ?? el.clientHeight * 2, behavior: "smooth" });
  };

  return (
    <div className="stage">
      <div className="intro">
        <div ref={scrollerRef} className="introScroll">
          {/* ===== sticky background: far wall + giant A; fades out as you scroll ===== */}
          <div className="heroBg">
            <div className="heroBg-wall" />
            <div className="heroBg-shade" />
            <div className="heroBg-orb heroBg-orb--a" />
            <div className="heroBg-orb heroBg-orb--b" />

            <div className="heroHalo" />

            <div className="markReveal">
              <div className="markScroll">
                <div className="markPersp">
                  <div className="markTilt">
                    <div className="markPlate">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="markShadow" src="/assets/ascentra-mark.png" alt="" aria-hidden="true" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="markImg" src="/assets/ascentra-mark.png" alt="Ascentra" />
                      <div className="markLight" />
                      <div className="markDark" />
                    </div>
                    <div className="markFloor" />
                  </div>
                </div>
              </div>
            </div>
            <canvas ref={heroCvRef} className="heroCv" />
          </div>

          {/* ===== content: sections layered over the sticky background ===== */}
          <div className="content">
            {/* SECTION 1 · reveal — the mark stands alone */}
            <section className="secReveal">
              <div className="revealRuleWrap">
                <div className="revealRule" />
              </div>
              <div className="scrollCue">
                <div className="scrollCue-label">Scroll to enter</div>
                <div className="scrollCue-arrow">↓</div>
              </div>
            </section>

            {/* SECTION 2 · the triptych — three frescoed panels, one per world */}
            <section data-screen-label="Triptych" className="secTript">
              <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                <filter id="frFine" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={4} stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <filter id="frCloud" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={5} seed={7} />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <pattern id="hatchOp" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                  <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(168,195,164,.5)" strokeWidth="1" />
                </pattern>
                <pattern id="hatchAs" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
                  <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(156,196,228,.45)" strokeWidth="1" />
                </pattern>
                <pattern id="latAst" width="26" height="26" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="26" height="26" fill="none" stroke="rgba(216,191,152,.5)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="1.6" fill="rgba(216,191,152,.6)" />
                </pattern>
              </svg>

              <div className="tript" ref={triptRef}>
                {/* LEFT · OPERIS — old money green · machine study */}
                <div className="tpan tpan--op">
                  <div className="tpan-base" />
                  <div className="tpan-wash" />
                  <svg className="tpan-cloud" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frCloud)" /></svg>
                  <svg className="tpan-fine" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frFine)" /></svg>
                  <div className="tglow" />
                  <svg className="tart" ref={artOpRef} viewBox="0 0 460 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <g data-fx="op" />
                    <rect x="26" y="446" width="128" height="128" fill="url(#hatchOp)" opacity=".14" />
                    <g fill="none" stroke="rgba(6,14,9,.5)" strokeWidth="1.1" opacity=".5">
                      <path d="M8 246 L58 318 L34 392 L92 470 L74 552" />
                      <path d="M452 128 L404 208 L430 266 L392 340" />
                      <path d="M180 858 L246 806 L300 830" />
                    </g>
                  </svg>
                  <div className="tpan-fade" />
                  <div className="tpan-seam" />
                  <div className="tpan-title">Operis</div>
                  <div data-rv className="tin tpan-copy" style={{ transitionDelay: ".05s" }}>
                    <div className="tpan-kicker">
                      01 · Interim Management<span />
                    </div>
                    <div className="tname">Detachering</div>
                    <div className="tpan-sub">Flexible interim management for operational environments</div>
                    <div className="tcue">Enter Operis →</div>
                  </div>
                </div>

                {/* CENTRE · ASCENTRA — the blue · proportion & navigation study */}
                <div
                  className="tpan tpan--asc mid"
                  role="button"
                  tabIndex={0}
                  onClick={goContact}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goContact();
                    }
                  }}
                >
                  <div className="tpan-base" />
                  <div className="tpan-wash" />
                  <svg className="tpan-cloud" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frCloud)" /></svg>
                  <svg className="tpan-fine" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frFine)" /></svg>
                  <div className="tglow" />
                  <svg className="tart" ref={artAscRef} viewBox="0 0 460 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <g data-fx="asc" />
                    <rect x="304" y="640" width="128" height="116" fill="url(#hatchAs)" opacity=".13" />
                    <g fill="none" stroke="rgba(3,12,22,.5)" strokeWidth="1.1" opacity=".45">
                      <path d="M20 148 L74 216 L48 292 L104 358" />
                      <path d="M446 452 L392 528 L420 594 L376 660" />
                    </g>
                  </svg>
                  <div className="tpan-fade" />
                  <div className="tpan-seam" />
                  <div className="tpan-title">Ascentra</div>
                  <div data-rv className="tin tpan-copy">
                    <div className="tpan-kicker">
                      02 · Consultancy<span />
                    </div>
                    <div className="tname">Consultancy</div>
                    <div className="tpan-sub">Shaping supply chains from strategy to execution</div>
                    <div className="tcue">Enter Ascentra →</div>
                  </div>
                </div>

                {/* RIGHT · ASTRA — old money crème/brown · flight & lattice study */}
                <div className="tpan tpan--ast">
                  <div className="tpan-base" />
                  <div className="tpan-wash" />
                  <svg className="tpan-cloud" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frCloud)" /></svg>
                  <svg className="tpan-fine" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frFine)" /></svg>
                  <div className="tglow" />
                  <svg className="tart" ref={artAstRef} viewBox="0 0 460 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <g data-fx="ast" />
                    <rect x="252" y="700" width="182" height="150" fill="url(#latAst)" opacity=".22" style={{ animation: "plasterBreath 14s ease-in-out infinite" }} />
                    <g fill="none" stroke="rgba(18,11,4,.55)" strokeWidth="1.1" opacity=".5">
                      <path d="M448 196 L392 268 L418 336 L370 402 L392 474" />
                      <path d="M14 288 L66 356 L40 428" />
                      <path d="M120 860 L188 812 L242 838" />
                    </g>
                  </svg>
                  <div className="tpan-fade" />
                  <div className="tpan-title">Astra</div>
                  <div data-rv className="tin tpan-copy" style={{ transitionDelay: ".1s" }}>
                    <div className="tpan-kicker">
                      03 · Development<span />
                    </div>
                    <div className="tname">Development</div>
                    <div className="tpan-sub">From in-house platforms to custom-built solutions</div>
                    <div className="tcue">Enter Astra →</div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 · contact — da vinci codex plate */}
            <section ref={contactRef} data-screen-label="Contact" className="secContact">
              <svg className="contact-grain" aria-hidden="true"><rect width="100%" height="100%" filter="url(#frFine)" /></svg>
              <div data-rv className="rv contact-kicker">Contact</div>
              <h2 data-rv className="rv contact-title" style={{ transitionDelay: ".09s" }}>
                Curious what we could do for your operation? <span>Let&apos;s talk</span>.
              </h2>
              <div data-rv className="rv contact-plate" style={{ transitionDelay: ".18s" }}>
                <div className="contact-grid">
                  <button type="button" className="ccard ccard--copy" title="Klik om te kopiëren" onClick={() => copy(EMAIL, "E-mail gekopieerd")}>
                    <span className="ccard-label">E-mail</span>
                    <span className="ccard-rule" />
                    <span className="ccard-value">{EMAIL}</span>
                    <span className="ccard-hint">klik om te kopiëren</span>
                  </button>
                  <button type="button" className="ccard ccard--copy" title="Klik om te kopiëren" onClick={() => copy(PHONE, "Telefoonnummer gekopieerd")}>
                    <span className="ccard-label">Telefoon</span>
                    <span className="ccard-rule" />
                    <span className="ccard-value">{PHONE}</span>
                    <span className="ccard-hint">klik om te kopiëren</span>
                  </button>
                  <div className="ccard">
                    <span className="ccard-label">Kantooradres</span>
                    <span className="ccard-rule" />
                    <span className="ccard-value">Oranjestraat 11</span>
                    <span className="ccard-meta">9401 KE · Assen</span>
                  </div>
                  <div className="ccard">
                    <span className="ccard-label">Development Hub</span>
                    <span className="ccard-rule" />
                    <span className="ccard-value">Pottenbakkerstraat 28</span>
                    <span className="ccard-meta">9403 VX · Assen</span>
                  </div>
                </div>
                {copied && (
                  <div className="toast" role="status">
                    {copied}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* nav (flat, above the stage) */}
        <nav className="topnav">
          <div className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/ascentra-mark.png" alt="" />
            Ascentra
          </div>
          <div className="topnav-links">
            <a className="cine-btn" href="https://casella.ascentra.nl" target="_top">
              Employee login
            </a>
          </div>
        </nav>

        <div className="footbar">
          <span />
          <span>© 2026 Ascentra</span>
        </div>

        {/* cinematic curtain: black halves split open on a brass seam */}
        <div className="curtain curtain--top" />
        <div className="curtain curtain--bot" />
        <div className="curtain-seam" />
      </div>

      {/* cinematic overlays */}
      <div className="vignette" />
      <div className="grain" />
    </div>
  );
}
