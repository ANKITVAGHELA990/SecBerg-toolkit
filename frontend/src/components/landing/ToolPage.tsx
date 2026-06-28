import type { LucideIcon } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ToolChart, type ChartKind } from "./ToolChart";
import { ToolsBackground } from "./ToolsBackground";

export function ToolPage({
  title,
  tagline,
  description,
  features,
  Icon,
  chartKind,
  chartTitle,
}: {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  Icon: LucideIcon;
  chartKind: ChartKind;
  chartTitle: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface dark:bg-slate-950">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-36 pb-20 md:pt-44">
        <div className="flex items-center gap-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white shadow-md shadow-ink/10 transition-transform duration-300 hover:rotate-3 hover:scale-105">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">Tool</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">
              {title}
            </h1>
          </div>
        </div>
        <p className="mt-6 text-xl text-ink/80 dark:text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
          {tagline}
        </p>
        <p className="mt-4 text-ink/70 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
          {description}
        </p>

        <div className="mt-10 rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-6 duration-750 delay-200 fill-mode-both">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink dark:text-white">{chartTitle}</h2>
            <span className="rounded-full bg-ink/5 dark:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-ink/70 dark:text-slate-300">
              live demo data
            </span>
          </div>
          <div className="mt-4">
            <ToolChart kind={chartKind} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-6 duration-750 delay-300 fill-mode-both">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white">What it does</h2>
          <ul className="mt-4 space-y-3">
            {features.map((f, i) => (
              <li
                key={f}
                className="flex gap-3 text-sm text-ink/80 dark:text-slate-300 animate-in fade-in slide-in-from-left-2 fill-mode-both"
                style={{ animationDelay: `${350 + i * 80}ms`, animationDuration: "600ms" }}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
          <button className="group relative rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-lg shadow-ink/20 transition-all duration-300 hover:scale-105 hover:bg-ink/90 active:scale-95">
            Run scan
          </button>
          <button className="rounded-full border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-medium text-ink dark:text-slate-100 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:border-ink/20 hover:shadow active:scale-95">
            View docs
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
