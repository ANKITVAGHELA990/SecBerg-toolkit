import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowUpRight, Radar, ShieldAlert, KeyRound, Lock, Globe } from "lucide-react";
import { ToolsBackground } from "@/components/landing/ToolsBackground";

const tools = [
  { to: "/tools/port-scanner", title: "Port Scanner", desc: "Discover open ports and exposed services on any host.", Icon: Radar },
  { to: "/tools/vulnerability-scanner", title: "Vulnerability Scanner", desc: "Identify known CVEs across your stack in minutes.", Icon: ShieldAlert },
  { to: "/tools/password-strength", title: "HTTP Chain Inspector", desc: "Trace redirects, headers, and request chains end-to-end.", Icon: KeyRound },
  { to: "/tools/ssl-analyzer", title: "Hash & Entropy Analyzer", desc: "Inspect hashes and measure randomness of secrets.", Icon: Lock },
  { to: "/tools/dns-lookup", title: "SSH Brute-Force Monitor", desc: "Detect and visualize SSH brute-force attempts in real time.", Icon: Globe },
] as const;

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Tools — SecBerg" },
      { name: "description", content: "A suite of cybersecurity tools for scanning, auditing, and monitoring." },
      { property: "og:title", content: "Tools — SecBerg" },
      { property: "og:description", content: "A suite of cybersecurity tools for scanning, auditing, and monitoring." },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-36 pb-20 md:pt-44">
        <h1 className="font-display text-5xl font-bold tracking-tight text-ink md:text-6xl animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700">Tools</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/70 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          Everything you need to probe, audit, and harden your infrastructure.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ to, title, desc, Icon }, i) => (
            <Link
              key={to}
              to={to}
              className="group rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl hover:border-ink/20 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 fill-mode-both"
              style={{ animationDelay: `${200 + i * 80}ms`, animationDuration: "700ms" }}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white shadow-md shadow-ink/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink/40 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-sm text-ink/65">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
