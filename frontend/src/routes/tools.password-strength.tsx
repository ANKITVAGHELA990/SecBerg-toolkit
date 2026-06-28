import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HttpChainInspectorPanel } from "@/components/landing/HttpChainInspectorPanel";
import { ToolsBackground } from "@/components/landing/ToolsBackground";

export const Route = createFileRoute("/tools/password-strength")({
  head: () => ({
    meta: [
      { title: "HTTP Chain Inspector — SecBerg" },
      { name: "description", content: "Trace redirects, headers, and request chains end-to-end." },
      { property: "og:title", content: "HTTP Chain Inspector — SecBerg" },
      { property: "og:description", content: "Trace redirects, headers, and request chains end-to-end." },
    ],
  }),
  component: HttpChainInspectorPage,
});

const features = [
  "Traces every network hop in a redirect chain — capturing HTTP method, status code, Location header, and round-trip latency per leg",
  "Identifies CDN edge nodes and load-balancer layers by fingerprinting Server, Via, and X-Cache headers across the response chain",
  "Detects open-redirect vulnerabilities, redirect loops, and host-header injection patterns that attackers exploit for phishing and SSRF",
  "Exports the full chain as curl, HAR, or Postman collections for replayable auditing and CI pipeline integration",
];

function HttpChainInspectorPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:to-slate-950">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-36 pb-20 md:pt-44">
        <HttpChainInspectorPanel />

        <div className="mt-6 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Routing, Redirection, &amp; CDN Diagnostics</h2>
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
