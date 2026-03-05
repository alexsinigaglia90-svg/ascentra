"use client";

import { useEffect, useState } from "react";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import Intro from "@/components/Intro";
import PlatformTeaser from "@/components/PlatformTeaser";
import ProofBand from "@/components/ProofBand";
import TriadPillars from "@/components/TriadPillars";

export type Language = "en" | "nl";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <HeroVideo language={language} onLanguageChange={setLanguage} />
      <main>
        <Intro />
        <TriadPillars />
        <PlatformTeaser />
        <ProofBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
