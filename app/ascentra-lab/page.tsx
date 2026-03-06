import type { Metadata } from "next";
import LabLandingShell from "./LabLandingShell";

export const metadata: Metadata = {
  title: "Ascentra Lab | Simulators and Experiences",
  description:
    "Discover the Ascentra Lab: premium operations simulators and immersive experiences for control room, palletizing, circuit design, and performance orchestration.",
};

export default function AscentraLabPage() {
  return <LabLandingShell />;
}
