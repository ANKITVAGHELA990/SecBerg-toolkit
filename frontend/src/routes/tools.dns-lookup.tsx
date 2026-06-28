import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SshBruteForceMonitorPanel } from "@/components/landing/SshBruteForceMonitorPanel";
import { ToolsBackground } from "@/components/landing/ToolsBackground";

export const Route = createFileRoute("/tools/dns-lookup")({
  head: () => ({
    meta: [
      { title: "SSH Brute-Force Monitor — SecBerg" },
      { name: "description", content: "Detect and visualize SSH brute-force attempts in real time." },
      { property: "og:title", content: "SSH Brute-Force Monitor — SecBerg" },
      { property: "og:description", content: "Detect and visualize SSH brute-force attempts in real time." },
    ],
  }),
  component: SshBruteForceMonitorPage,
});

const features = [
  "Live-tails auth.log and journald streams across server fleets, detecting burst-attack patterns — multiple failed logins from a single source within a configurable time window",
  "Time-series visualization plots failed-auth rate against a rolling baseline threshold, making anomalous spikes immediately visible at a glance",
  "GeoIP and ASN attribution enriches each attacker source with origin country, ISP, and autonomous system data for threat intelligence correlation",
  "Exports structured telemetry (IP, timestamp, failure count) as firewall-ready CIDR blocklists for direct ingestion into iptables, pf, or cloud WAF rules",
];

function SshBruteForceMonitorPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:to-slate-950">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-36 pb-20 md:pt-44">
        <SshBruteForceMonitorPanel />

        <div className="mt-6 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Real-Time Authentication Anomaly Tracking</h2>
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
