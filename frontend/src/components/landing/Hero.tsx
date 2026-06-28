import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-4 pt-36 pb-10 text-center md:pt-44 md:pb-16">
      <h1 className="mx-auto max-w-5xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-ink dark:text-white md:text-7xl lg:text-[5.5rem] animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 ease-out">
        SecBerg: Minimalist Security<br className="hidden md:block" />{" "}
        Intelligence for Developers.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base text-ink/70 dark:text-slate-300 md:text-lg animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 ease-out fill-mode-both">
        “A lightweight, browser-based defensive security suite. Evaluate HTTP architectures, audit authorized network footprints, and track real-time authentication anomalies without the enterprise bloat.”
      </p>
      <div className="mt-8 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 ease-out fill-mode-both">
        <a
          href="/tools"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-lg shadow-ink/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-ink/30 hover:bg-ink/90 active:scale-95"
        >
          Explore Tools
          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
        </a>
        <a
          href="/about"
          className="rounded-full border border-ink/10 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-6 py-3 text-sm font-medium text-ink dark:text-slate-100 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-slate-800 active:scale-95"
        >
          About Project
        </a>
      </div>
    </section>
  );
}
