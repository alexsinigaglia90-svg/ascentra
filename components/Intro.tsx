import Section from "./Section";

export default function Intro() {
  return (
    <Section id="system" className="section-spacing">
      <div className="container-shell grid gap-10 md:grid-cols-[1.12fr_0.88fr] md:items-end">
        <div>
          <p className="section-kicker">The Ascentra System</p>
          <h2 className="text-balance text-4xl leading-tight md:text-5xl">One leadership layer from strategy through execution.</h2>
          <p className="muted mt-5 max-w-xl text-base leading-relaxed md:text-lg">
            We operate across boardroom strategy, daily warehouse orchestration, and product development. Clients get coherent direction and measurable control.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="chip-quiet px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink)]/75">Strategy</div>
            <div className="chip-quiet px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink)]/75">Operations</div>
            <div className="chip-quiet px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink)]/75">Products</div>
          </div>
        </div>
        <div className="lux-panel space-y-3 p-4 md:p-5">
          <article className="surface lift-hover p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--blue)]">Outcome 01</p>
            <p className="mt-1 text-sm leading-relaxed md:text-base">Governance that stays clear under pressure.</p>
          </article>
          <article className="surface lift-hover p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--brown)]">Outcome 02</p>
            <p className="mt-1 text-sm leading-relaxed md:text-base">Performance steering rooted in operational reality.</p>
          </article>
          <article className="surface lift-hover p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink)]">Outcome 03</p>
            <p className="mt-1 text-sm leading-relaxed md:text-base">Scalable execution supported by product-grade tooling.</p>
          </article>
        </div>
      </div>
    </Section>
  );
}
