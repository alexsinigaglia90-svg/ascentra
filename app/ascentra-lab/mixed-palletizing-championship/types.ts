export type GamePhase =
  | "hero"
  | "brief"
  | "challenge"
  | "aiTransition"
  | "aiThinking"
  | "aiBuild"
  | "results";

export type ScenarioSku = {
  id: string;
  label: string;
  w: number;
  d: number;
  h: number;
  weight: number;
  quantity: number;
  fragile: boolean;
};

export type Scenario = {
  scenarioId: string;
  destination: string;
  skuTypes: number;
  cartons: number;
  maxHeight: number;
  fragileItems: boolean;
  weightVariance: string;
  timerSeconds: number;
  skus: ScenarioSku[];
};

export type PlacedBox = {
  placementId: string;
  skuId: string;
  label: string;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  rotated: boolean;
  weight: number;
  fragile: boolean;
};

export type SolverMessage = {
  id: string;
  text: string;
};

export type RunMetrics = {
  fillRate: number;
  stability: number;
  heightUsed: number;
  placed: number;
  total: number;
  compressionRisk: number;
  transportSafety: number;
  score: number;
};

export type PlacementCandidate = {
  x: number;
  z: number;
  y: number;
  rotated: boolean;
  w: number;
  d: number;
  h: number;
};
