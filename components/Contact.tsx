import Section from "./Section";

type Language = "en" | "nl";

type ContactProps = {
  language: Language;
};

const copy = {
  en: {
    kicker: "Request an intro",
    title: "Let's scope your next operational chapter.",
    body: "Share your challenge and preferred timeline. We reply with a focused first conversation and fit assessment.",
    labelName: "Name",
    labelWhatsapp: "WhatsApp",
    labelIntl: "International",
    shortText:
      "No hassle with emails? Send us a direct message on WhatsApp. You can reach us at 06 3838 3737.",
    button: "Open WhatsApp (+31 6 3838 3737)",
  },
  nl: {
    kicker: "Vraag een introductie aan",
    title: "Laten we je volgende operationele hoofdstuk scherpstellen.",
    body: "Deel je uitdaging en gewenste planning. We reageren met een gefocust eerste gesprek en een fit-assessment.",
    labelName: "Naam",
    labelWhatsapp: "WhatsApp",
    labelIntl: "Internationaal",
    shortText:
      "Geen gedoe met mailen? Stuur ons liever direct een bericht op WhatsApp. We zijn te bereiken op 06 3838 3737.",
    button: "Open WhatsApp (+31 6 3838 3737)",
  },
};

export default function Contact({ language }: ContactProps) {
  const t = copy[language];

  return (
    <Section id="contact" className="section-spacing">
      <div className="container-shell max-w-3xl">
        <div className="lux-panel p-6 md:p-8">
          <p className="section-kicker">{t.kicker}</p>
          <h2 className="text-balance text-4xl leading-tight md:text-5xl">{t.title}</h2>
          <p className="muted mt-5 max-w-md text-base leading-relaxed">
            {t.body}
          </p>
          <div className="lux-panel mt-6 space-y-2 p-4 text-sm md:text-base">
            <p><span className="font-medium">{t.labelName}:</span> Ascentra</p>
            <p><span className="font-medium">{t.labelWhatsapp}:</span> 06 3838 3737</p>
            <p><span className="font-medium">{t.labelIntl}:</span> +31 6 3838 3737</p>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--ink)]/80 md:text-base">
            {t.shortText}
          </p>
          <a
            href="/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-medium tracking-wide text-[var(--bg)] shadow-[0_12px_26px_rgba(30,58,95,0.28)] transition hover:brightness-110"
          >
            {t.button}
          </a>
        </div>
      </div>
    </Section>
  );
}
