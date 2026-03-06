export type Language = "en" | "nl";

type LocalizedText = {
  en: string;
  nl: string;
};

export type LabTool = {
  slug: string;
  title: LocalizedText;
  strapline: LocalizedText;
  description: LocalizedText;
  duration: LocalizedText;
  mode: LocalizedText;
  readiness: LocalizedText;
  highlights: Record<Language, string[]>;
  accent: "blue" | "amber" | "teal" | "slate";
};

export const labTools: LabTool[] = [
  {
    slug: "control-room-sim",
    title: {
      en: "Control Room Sim",
      nl: "Control Room Sim",
    },
    strapline: {
      en: "Command flow under pressure",
      nl: "Command flow onder druk",
    },
    description: {
      en: "Lead an active operations floor with live disruptions, cross-functional escalations, and minute-level trade-off decisions.",
      nl: "Leid een actieve operatievloer met live verstoringen, cross-functionele escalaties en afwegingen op minutenniveau.",
    },
    duration: {
      en: "45-90 min",
      nl: "45-90 min",
    },
    mode: {
      en: "Solo / Team",
      nl: "Solo / Team",
    },
    readiness: {
      en: "Pilot Ready",
      nl: "Pilot Ready",
    },
    highlights: {
      en: ["Exception choreography", "Tempo discipline", "Escalation design"],
      nl: ["Exception choreography", "Tempo discipline", "Escalation design"],
    },
    accent: "blue",
  },
  {
    slug: "pirck-circuit-simulator",
    title: {
      en: "Pirck circuit Simulator",
      nl: "Pirck circuit Simulator",
    },
    strapline: {
      en: "Warehouse signal architecture",
      nl: "Warehouse signal architectuur",
    },
    description: {
      en: "Stress-test route logic, scanner events, and control triggers through a high-velocity digital circuit designed for operational reliability.",
      nl: "Stress-test routelogica, scanner-events en control-triggers in een high-velocity digitaal circuit voor operationele betrouwbaarheid.",
    },
    duration: {
      en: "30-75 min",
      nl: "30-75 min",
    },
    mode: {
      en: "Solo",
      nl: "Solo",
    },
    readiness: {
      en: "Pilot Ready",
      nl: "Pilot Ready",
    },
    highlights: {
      en: ["Circuit diagnostics", "Signal health", "Throughput integrity"],
      nl: ["Circuit diagnostics", "Signal health", "Throughput integrity"],
    },
    accent: "amber",
  },
  {
    slug: "mixed-palletizing-championship",
    title: {
      en: "Mixed palletizing championship",
      nl: "Mixed palletizing championship",
    },
    strapline: {
      en: "Precision stacking meets speed",
      nl: "Precisie stapelen op snelheid",
    },
    description: {
      en: "Compete in a score-based simulation where stack stability, travel distance, and pick rhythm decide who owns the floor.",
      nl: "Competeer in een score-based simulatie waar stapelstabiliteit, loopafstand en pick-ritme bepalen wie de vloer beheerst.",
    },
    duration: {
      en: "20-50 min",
      nl: "20-50 min",
    },
    mode: {
      en: "Multiplayer",
      nl: "Multiplayer",
    },
    readiness: {
      en: "Live",
      nl: "Live",
    },
    highlights: {
      en: ["Balance heuristics", "Path minimization", "Game telemetry"],
      nl: ["Balance heuristics", "Path minimization", "Game telemetry"],
    },
    accent: "teal",
  },
  {
    slug: "dashoarding-performance",
    title: {
      en: "Dashoarding & performance",
      nl: "Dashoarding & performance",
    },
    strapline: {
      en: "From data walls to action",
      nl: "Van data walls naar actie",
    },
    description: {
      en: "Build executive and floor-level dashboard narratives that convert KPI noise into behavior change and measurable momentum.",
      nl: "Bouw executive en floor-level dashboardverhalen die KPI-ruis omzetten in gedragsverandering en meetbare voortgang.",
    },
    duration: {
      en: "40-80 min",
      nl: "40-80 min",
    },
    mode: {
      en: "Workshop",
      nl: "Workshop",
    },
    readiness: {
      en: "Pilot Ready",
      nl: "Pilot Ready",
    },
    highlights: {
      en: ["Signal clarity", "Behavior loops", "Performance storytelling"],
      nl: ["Signal clarity", "Behavior loops", "Performance storytelling"],
    },
    accent: "slate",
  },
];

export const labToolMap = new Map(labTools.map((tool) => [tool.slug, tool]));
