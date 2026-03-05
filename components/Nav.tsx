type Language = "en" | "nl";

const labels = {
  en: {
    staffing: "Detachering",
    capabilities: "Capabilities",
    platform: "Platform",
    products: "Products",
    contact: "Contact",
  },
  nl: {
    staffing: "Detachering",
    capabilities: "Capaciteiten",
    platform: "Platform",
    products: "Producten",
    contact: "Contact",
  },
};

type NavProps = {
  language: Language;
  onLanguageChange: (value: Language) => void;
};

export default function Nav({ language, onLanguageChange }: NavProps) {
  const links = [
    { label: labels[language].staffing, href: "/operis/" },
    { label: labels[language].capabilities, href: "#system" },
    { label: labels[language].platform, href: "#platform" },
    { label: labels[language].products, href: "#pillars" },
    { label: labels[language].contact, href: "#contact" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-shell flex items-center justify-between py-6 text-[var(--bg)]">
        <a href="#top" className="font-serif text-3xl font-semibold tracking-[0.03em] text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.35)]">
          Ascentra
        </a>
        <div className="glass-dark hidden items-center gap-3 rounded-full px-3 py-2 md:flex">
          <div className="rounded-full border border-white/35 p-1" role="group" aria-label="Language switcher">
            <button
              type="button"
              onClick={() => onLanguageChange("nl")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition ${
                language === "nl" ? "bg-white text-[var(--ink)]" : "text-white/85 hover:text-white"
              }`}
            >
              NL
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition ${
                language === "en" ? "bg-white text-[var(--ink)]" : "text-white/85 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
          <nav aria-label="Homepage sections" className="flex gap-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full border border-white/30 px-4 py-2 text-sm tracking-wide text-white/90 transition hover:border-white/70 hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="container-shell pb-4 md:hidden">
        <div className="mb-2 flex justify-end">
          <div className="glass-dark rounded-full border border-white/35 p-1" role="group" aria-label="Language switcher">
            <button
              type="button"
              onClick={() => onLanguageChange("nl")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                language === "nl" ? "bg-white text-[var(--ink)]" : "text-white/85 hover:text-white"
              }`}
            >
              NL
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                language === "en" ? "bg-white text-[var(--ink)]" : "text-white/85 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
        <nav aria-label="Homepage sections mobile" className="flex gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="glass-dark rounded-full border border-white/30 px-3 py-1.5 text-xs tracking-wide text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
