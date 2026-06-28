import { Zap, Cpu, ShieldCheck } from "lucide-react";

export function ValueProposition() {
  const values = [
    {
      title: "Zero Conf, Instant Execution",
      desc: "No heavy background installations or agent setups. Paste your target parameter and get raw cryptographic or network calculations instantly.",
      Icon: Zap,
      delay: 100
    },
    {
      title: "Decoupled Architecture",
      desc: "Built on a split micro-logic foundation. The frontend displays atomic, responsive UI components while the Python core handles pure data processing.",
      Icon: Cpu,
      delay: 200
    },
    {
      title: "Security by Design",
      desc: "Built-in safeguards (like the local network scope check) ensure you analyze network targets defensively, safely, and ethically.",
      Icon: ShieldCheck,
      delay: 300
    }
  ];

  return (
    <section className="mx-auto mt-24 w-[min(1100px,calc(100%-1.5rem))] px-4">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white md:text-4xl">
          Why this exists
        </h2>
      </div>

      {/* 3-Column Values Row */}
      <div className="mt-12 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {values.map(({ title, desc, Icon, delay }) => (
          <div
            key={title}
            className="group rounded-3xl border border-ink/10 dark:border-slate-700 bg-white/80 dark:bg-slate-800 p-8 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md hover:border-ink/20 dark:hover:border-slate-600 animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
            style={{ animationDelay: `${delay}ms`, animationDuration: "800ms" }}
          >
            <div className="flex items-center justify-between border-b border-ink/5 dark:border-slate-700/50 pb-4 mb-4">
              <h3 className="font-display text-lg font-bold text-ink dark:text-white leading-snug">
                {title}
              </h3>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white shadow-md shadow-ink/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink/70 dark:text-slate-300">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
