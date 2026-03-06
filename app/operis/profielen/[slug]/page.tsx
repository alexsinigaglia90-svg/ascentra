import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  departments,
  employees,
  getEmployeeBySlug,
  getRolesForEmployee,
} from "../../data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return employees.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getEmployeeBySlug(slug);

  if (!person) {
    return {
      title: "Operis profiel niet gevonden",
    };
  }

  return {
    title: `${person.name} | Operis Profiel`,
    description: person.summary,
  };
}

export default async function OperisProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const person = getEmployeeBySlug(slug);

  if (!person) {
    notFound();
  }

  const assignedRoles = getRolesForEmployee(person.slug);
  const departmentCoverage = departments.filter((department) =>
    assignedRoles.some((entry) => entry.departmentId === department.id)
  );

  return (
    <main
      className="min-h-screen bg-[#F6F1E7] px-6 py-10 text-[#111214] sm:px-10 lg:px-16"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 10%, rgba(30,58,95,0.10), transparent 40%), radial-gradient(circle at 88% 30%, rgba(106,75,42,0.12), transparent 35%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href="/operis/"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#1E3A5F]"
        >
          Terug naar Operational Network
        </Link>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 p-6 shadow-[0_24px_80px_rgba(17,18,20,0.10)] backdrop-blur sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6A4B2A]">Operis Talent Profile</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#1E3A5F] sm:text-5xl">{person.name}</h1>
          <p className="mt-2 text-lg text-black/75">{person.title}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Senioriteit" value={person.seniority} />
            <Metric label="Locatie" value={person.location} />
            <Metric label="Beschikbaarheid" value={person.availability} />
          </div>

          <p className="mt-8 max-w-4xl text-base leading-relaxed text-black/80">{person.summary}</p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <SectionTitle>Inzet op Rollen</SectionTitle>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {assignedRoles.map((entry) => (
                  <article
                    key={`${entry.departmentId}-${entry.role}`}
                    className="rounded-2xl border border-black/10 bg-white/70 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6A4B2A]">
                      {entry.departmentName}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#111214]">{entry.role}</p>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Domein Coverage</SectionTitle>
              <div className="mt-4 flex flex-wrap gap-2">
                {departmentCoverage.map((department) => (
                  <span
                    key={department.id}
                    className="rounded-full border border-black/10 bg-[#1E3A5F]/10 px-3 py-1.5 text-xs font-medium text-[#1E3A5F]"
                  >
                    {department.name}
                  </span>
                ))}
              </div>

              <SectionTitle className="mt-8">Profiel Highlights</SectionTitle>
              <ul className="mt-3 space-y-2">
                {person.profileHighlights.map((item) => (
                  <li key={item} className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-black/10 pt-8 sm:grid-cols-3">
            <InfoStack title="Kernfocus" items={person.focus} />
            <InfoStack title="Certificeringen" items={person.certifications} />
            <InfoStack title="Sectors" items={person.sectorExperience} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/75 p-4">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6A4B2A]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111214]">{value}</p>
    </div>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <h2 className={`text-sm font-semibold uppercase tracking-[0.18em] text-[#6A4B2A] ${className}`}>
      {children}
    </h2>
  );
}

function InfoStack({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A4B2A]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/80"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
