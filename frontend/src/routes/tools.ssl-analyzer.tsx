import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolChart } from "@/components/landing/ToolChart";
import { HashEntropyAnalyzerPanel } from "@/components/landing/HashEntropyAnalyzerPanel";
import { ToolsBackground } from "@/components/landing/ToolsBackground";

export const Route = createFileRoute("/tools/ssl-analyzer")({
  head: () => ({
    meta: [
      { title: "Hash & Entropy Analyzer — SecBerg" },
      { name: "description", content: "Identify hash types and measure entropy of secrets and tokens." },
      { property: "og:title", content: "Hash & Entropy Analyzer — SecBerg" },
      { property: "og:description", content: "Identify hash types and measure entropy of secrets and tokens." },
    ],
  }),
  component: HashEntropyAnalyzerPage,
});

const features = [
  "Auto-detects 30+ hash and encoding schemes — MD5, SHA-1/2/3, bcrypt, argon2, BLAKE2, Base64, JWT, and more — from raw input",
  "Computes Shannon entropy scores to mathematically identify leaked API keys, session tokens, and cryptographic secrets embedded in strings",
  "Flags structurally weak patterns: constant-prefix tokens, sequential IDs, truncated hashes, and insecure algorithm families (MD5, SHA-1)",
  "Bulk-analyzes lists of secrets and highlights outliers, enabling systematic secret-rotation triage across large credential sets",
];

function HashEntropyAnalyzerPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:to-slate-950">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-36 pb-20 md:pt-44">
        <HashEntropyAnalyzerPanel />

        <div className="mt-10 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Entropy & hash posture score</h2>
            <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/70 dark:text-slate-300">
              live demo data
            </span>
          </div>
          <div className="mt-4">
            <ToolChart kind="ssl-analyzer" />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Cryptographic Strength &amp; Randomness Metrics</h2>
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
      </main>
      <Footer />
    </div>
  );
}
