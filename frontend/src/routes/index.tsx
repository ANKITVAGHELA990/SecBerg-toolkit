import { createFileRoute } from "@tanstack/react-router";
import skyHero from "@/assets/sky-hero.jpg";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecBerg" },
      {
        name: "description",
        content:
          "A lightweight, browser-based defensive security suite. Evaluate HTTP architectures, audit authorized network footprints, and track real-time authentication anomalies without the enterprise bloat.",
      },
      { property: "og:title", content: "SecBerg — Minimalist Security Intelligence for Developers" },
      {
        property: "og:description",
        content:
          "A lightweight, browser-based defensive security suite. Evaluate HTTP architectures, audit authorized network footprints, and track real-time authentication anomalies.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]">
      {/* Sky background */}
      <div
        className="absolute inset-x-0 top-0 h-[820px] bg-cover bg-center animate-pulse-slow animate-in fade-in duration-[1500ms] dark:hidden"
        style={{ backgroundImage: `url(${skyHero})` }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-[640px] h-[260px] bg-gradient-to-b from-transparent to-surface dark:to-slate-950"
        aria-hidden
      />

      <div className="relative">
        <Navbar />
        <Hero />
        <DashboardPreview />
        <ValueProposition />
        <Footer />
      </div>
    </div>
  );
}
