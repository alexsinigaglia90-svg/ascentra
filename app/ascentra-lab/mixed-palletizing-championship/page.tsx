import type { Metadata } from "next";
import MixedPalletizingChampionship from "./MixedPalletizingChampionship";

export const metadata: Metadata = {
  title: "Ascentra Lab — Mixed Palletizing Championship",
  description:
    "Ascentra Lab cinematic warehouse intelligence challenge. Compete against Ascentra Pallet Intelligence in a premium mixed palletizing simulation.",
};

export default function MixedPalletizingChampionshipPage() {
  return <MixedPalletizingChampionship />;
}
