import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PortScannerPanel } from "@/components/landing/PortScannerPanel";
import { ToolsBackground } from "@/components/landing/ToolsBackground";

export const Route = createFileRoute("/tools/port-scanner")({
  head: () => ({
    meta: [
      { title: "Port Scanner Guard — SecBerg" },
      { name: "description", content: "Discover open ports and exposed services on approved private networks." },
      { property: "og:title", content: "Port Scanner Guard — SecBerg" },
      { property: "og:description", content: "Discover open ports and exposed services on approved private networks." },
    ],
  }),
  component: PortScannerPage,
});

const features = [
  "Performs TCP SYN and full-connect probes across the complete 1–65535 port space, adapting scan strategy based on host response timing",
  "Banner grabbing identifies running service versions (SSH, HTTP, FTP, databases) to surface exposed and unpatched daemons",
  "Enforced RFC 1918 and loopback guardrails prevent unauthorised scanning of public routable addresses — safety-first by design",
  "Results are correlation-ready: port state, service fingerprint, and latency are exportable as structured JSON for SIEM ingestion",
];

function PortScannerPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:to-slate-950">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-36 pb-20 md:pt-44">
        <PortScannerPanel />

        <div className="mt-6 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Localized Port &amp; Service Enumeration</h2>
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
