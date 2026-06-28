import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolsBackground } from "@/components/landing/ToolsBackground";
import { Terminal, ShieldCheck, Network, Activity, Lock } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SecBerg" },
      { name: "description", content: "Learn about SecBerg's mission to make cybersecurity accessible." },
      { property: "og:title", content: "About — SecBerg" },
      { property: "og:description", content: "Learn about SecBerg's mission to make cybersecurity accessible." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-slate-950 flex flex-col">
      <Navbar />
      <ToolsBackground />
      <main className="relative z-10 flex-1 w-full mx-auto max-w-4xl px-4 pt-36 pb-20 md:pt-44 flex flex-col items-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl text-center">
          About the Developer
        </h1>
        
        <div className="mt-12 w-full max-w-2xl overflow-hidden rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-ink/5 dark:border-slate-700/50 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink/5 dark:bg-slate-700 text-ink dark:text-slate-100 ring-1 ring-ink/10 dark:ring-slate-600">
                <Terminal className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-ink dark:text-slate-100">Project Credits</h2>
                <p className="text-xs font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400 mt-1">Internship Project</p>
              </div>
            </div>
            
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1.5 shadow-sm self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Status: Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">Developer</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-ink dark:text-slate-100 text-base">Ankit Vaghela</p>
            </div>
            
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">Role</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-ink dark:text-slate-100 text-base">Student</p>
            </div>
            
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">Organization</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-ink dark:text-slate-100 text-base leading-relaxed">IBM SkillsBuild Skill-Based Training Program 2026</p>
            </div>
            
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">Academic Program</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-ink dark:text-slate-100 text-base">Diploma In IT</p>
            </div>
            
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">Contact</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-ink dark:text-slate-100 text-base break-all">vaghelaankit2225@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Section 1: Mission & Architecture */}
        <section className="mt-24 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl text-center">
            Mission & Architecture
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              SecBerg is a lightweight, zero-configuration defensive security suite engineered for modern development teams. It provides a localized, privacy-first environment designed to help developers identify critical vulnerabilities—ranging from HTTP misconfigurations and exposed local ports to brute-force vectors—long before code is deployed to production.
            </p>
            <p>
              By combining rapid enumeration with clear, actionable diagnostics, SecBerg abstracts away the complexity of traditional enterprise security platforms. It empowers teams to integrate continuous security auditing directly into their daily workflows without the bloat of external dependencies or cloud telemetry.
            </p>
          </div>
        </section>

        {/* Section 2: Deployment Scenarios */}
        <section className="mt-24 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl text-center mb-10">
            Deployment Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ink/20 dark:hover:border-slate-600">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-slate-700 text-ink dark:text-slate-100 ring-1 ring-ink/10 dark:ring-slate-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-slate-100">Pre-Deployment Audits</h3>
              <p className="mt-2 text-sm text-ink/70 dark:text-slate-300 leading-relaxed">
                Validate HTTP security headers, CORS configurations, and TLS enforcement on staging environments before going live.
              </p>
            </div>
            
            <div className="rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ink/20 dark:hover:border-slate-600">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-slate-700 text-ink dark:text-slate-100 ring-1 ring-ink/10 dark:ring-slate-600">
                <Network className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-slate-100">Internal Network Mapping</h3>
              <p className="mt-2 text-sm text-ink/70 dark:text-slate-300 leading-relaxed">
                Utilize the localized Port Guard to safely discover rogue local services and exposed APIs within private networks.
              </p>
            </div>
            
            <div className="rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ink/20 dark:hover:border-slate-600">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-slate-700 text-ink dark:text-slate-100 ring-1 ring-ink/10 dark:ring-slate-600">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-slate-100">Incident Response</h3>
              <p className="mt-2 text-sm text-ink/70 dark:text-slate-300 leading-relaxed">
                Deploy the SSH Monitor during active operational anomalies to track, graph, and respond to brute-force threshold breaches.
              </p>
            </div>
            
            <div className="rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-ink/20 dark:hover:border-slate-600">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-slate-700 text-ink dark:text-slate-100 ring-1 ring-ink/10 dark:ring-slate-600">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-slate-100">Cryptographic Review</h3>
              <p className="mt-2 text-sm text-ink/70 dark:text-slate-300 leading-relaxed">
                Leverage the Hash & Entropy Analyzer to identify weak database secrets, legacy cryptographic formats, or plaintext credentials.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Standard Operating Procedure */}
        <section className="mt-24 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl text-center mb-10">
            Standard Operating Procedure
          </h2>
          <div className="space-y-6">
            
            <div className="flex items-start gap-4 md:gap-6 rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink dark:bg-slate-100 text-sm font-bold text-white dark:text-slate-900 shadow-md">
                1
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink dark:text-slate-100 mt-2">Select the Target Vector</h3>
                <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">
                  Input the target IP address, endpoint URL, or raw data block into the appropriate diagnostic tool via the Command Center.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 md:gap-6 rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink dark:bg-slate-100 text-sm font-bold text-white dark:text-slate-900 shadow-md">
                2
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink dark:text-slate-100 mt-2">Initiate the Engine</h3>
                <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">
                  Execute the localized scan engine. The backend will rapidly enumerate the target while respecting safe, internal boundaries.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 md:gap-6 rounded-3xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink dark:bg-slate-100 text-sm font-bold text-white dark:text-slate-900 shadow-md">
                3
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink dark:text-slate-100 mt-2">Review & Remediate</h3>
                <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">
                  Analyze the parsed vulnerability metrics, security flags, and entropy scores to apply the recommended architectural patches.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
