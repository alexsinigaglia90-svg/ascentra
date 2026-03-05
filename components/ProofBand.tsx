import Section from "./Section";

const ecosystems = ["Enterprise Retail", "3PL", "Airport Logistics", "Automation Integrators", "WMS ecosystems"];
const metrics = ["Board-level clarity", "Operational stability under pressure", "Product-grade engineering discipline"];

export default function ProofBand() {
  return (
    <Section className="section-spacing border-y border-[var(--line)] bg-gradient-to-b from-white/45 to-white/25">
      <div className="container-shell">
        <p className="section-kicker">Selected environments & ecosystems</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ecosystems.map((item) => (
            <span key={item} className="pill lift-hover">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {metrics.map((item) => (
            <article key={item} className="lux-panel lift-hover p-5 text-sm md:text-base">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--blue)]/75">Credibility</p>
              <p className="mt-1 font-medium tracking-wide">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
