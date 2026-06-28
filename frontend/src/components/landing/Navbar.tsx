import { useEffect, useRef, useState } from "react";
import { ChevronDown, ShieldCheck, Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "@tanstack/react-router";

/* ── Per-tool SVG icons ─────────────────────────────────────────────── */
function IconPortScanner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      <path d="M4.93 4.93 19.07 19.07M12 8v4l3 3" />
    </svg>
  );
}

function IconVulnScanner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconHttpChain({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconHashEntropy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function IconSshMonitor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const tools = [
  { label: "Port Scanner", to: "/tools/port-scanner", desc: "Find open ports & services", Icon: IconPortScanner, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/60" },
  { label: "Vulnerability Scanner", to: "/tools/vulnerability-scanner", desc: "Detect known CVEs", Icon: IconVulnScanner, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/60" },
  { label: "HTTP Chain Inspector", to: "/tools/password-strength", desc: "Trace redirect & request chains", Icon: IconHttpChain, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/60" },
  { label: "Hash & Entropy Analyzer", to: "/tools/ssl-analyzer", desc: "Inspect hashes and entropy", Icon: IconHashEntropy, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/60" },
  { label: "SSH Brute-Force Monitor", to: "/tools/dns-lookup", desc: "Detect SSH brute-force activity", Icon: IconSshMonitor, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/60" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1100px,calc(100%-2rem))] -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-700">
      <nav className="flex items-center justify-between rounded-full border border-white/40 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/60 px-3 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2 pl-2 pr-3 transition hover:opacity-80">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink dark:bg-slate-100 text-white dark:text-slate-900">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-white">SecBerg</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          <li>
            <Link to="/" className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink/80 dark:text-slate-300 transition hover:bg-white/60 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-white">
              Home
            </Link>
          </li>
          <li ref={ref} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={() => setOpen(true)}
              aria-expanded={open}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink/80 dark:text-slate-300 transition hover:bg-white/60 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-white"
            >
              Tools
              <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div
                onMouseLeave={() => setOpen(false)}
                className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-white/50 dark:border-slate-700 bg-white/96 dark:bg-slate-900 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between px-3 pb-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-slate-500">Security Tools</span>
                  <Link to="/tools" onClick={() => setOpen(false)} className="text-[10px] font-semibold text-ink/50 dark:text-slate-400 transition hover:text-ink dark:hover:text-white">
                    View all →
                  </Link>
                </div>
                <div className="mx-2 mb-1.5 h-px bg-ink/8 dark:bg-slate-700" />
                {tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-slate-100/80 dark:hover:bg-slate-800"
                  >
                    <span className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${t.bg} transition-transform duration-150 group-hover:scale-110`}>
                      <t.Icon className={`h-4 w-4 ${t.color}`} />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-semibold leading-tight text-ink dark:text-slate-100">{t.label}</span>
                      <span className="text-[11px] leading-snug text-ink/50 dark:text-slate-400">{t.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </li>
          <li>
            <Link to="/about" className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink/80 dark:text-slate-300 transition hover:bg-white/60 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-white">
              About
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/80 dark:bg-slate-800 text-ink dark:text-slate-200 shadow-sm transition hover:scale-105 hover:bg-white dark:hover:bg-slate-700"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* GitHub pill */}
          <a
            href="https://github.com/ANKITVAGHELA990"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-ink dark:text-slate-100 shadow-sm transition hover:scale-105 hover:shadow md:inline-flex"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobile((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white dark:bg-slate-800 text-ink dark:text-slate-200 md:hidden"
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobile && (
        <div className="mt-2 rounded-3xl border border-white/40 dark:border-slate-700 bg-white/95 dark:bg-slate-900 p-3 shadow-xl backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <Link to="/" onClick={() => setMobile(false)} className="block rounded-xl px-3 py-2 text-sm font-medium text-ink dark:text-slate-200 hover:bg-ink/5 dark:hover:bg-slate-800">Home</Link>
          <Link to="/tools" onClick={() => setMobile(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink dark:text-slate-200 hover:bg-ink/5 dark:hover:bg-slate-800">All Tools →</Link>
          <div className="mx-2 my-1.5 h-px bg-ink/8 dark:bg-slate-700" />
          {tools.map((t) => (
            <Link key={t.to} to={t.to} onClick={() => setMobile(false)} className="group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-slate-100/80 dark:hover:bg-slate-800">
              <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${t.bg}`}>
                <t.Icon className={`h-3.5 w-3.5 ${t.color}`} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold leading-tight text-ink dark:text-slate-100">{t.label}</span>
                <span className="text-[11px] leading-snug text-ink/50 dark:text-slate-400">{t.desc}</span>
              </span>
            </Link>
          ))}
          <div className="mx-2 my-1.5 h-px bg-ink/8 dark:bg-slate-700" />
          <Link to="/about" onClick={() => setMobile(false)} className="block rounded-xl px-3 py-2 text-sm font-medium text-ink dark:text-slate-200 hover:bg-ink/5 dark:hover:bg-slate-800">About</Link>
        </div>
      )}
    </header>
  );
}



