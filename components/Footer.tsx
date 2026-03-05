const links = [
  { label: "Top", href: "#top" },
  { label: "System", href: "#system" },
  { label: "Pillars", href: "#pillars" },
  { label: "Platform", href: "#platform" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-gradient-to-b from-white/45 to-white/20 py-8">
      <div className="container-shell flex flex-col items-start justify-between gap-4 text-xs tracking-wide md:flex-row md:items-center">
        <p className="muted">© {new Date().getFullYear()} Ascentra. All rights reserved.</p>
        <nav aria-label="Footer links" className="flex flex-wrap gap-2">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="chip-quiet px-3 py-1.5 text-[var(--ink)]/80 transition hover:text-[var(--blue)]">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
