import { ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative z-50 mt-24 border-t border-ink/15 bg-slate-50 dark:bg-slate-900 px-4 py-16 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)] dark:border-white/10">
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">

        {/* Column 1: Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink dark:bg-slate-100 text-white dark:text-slate-900">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold text-ink dark:text-white">SecBerg</span>
          </div>
          <p className="text-sm leading-relaxed text-ink/60 dark:text-slate-400">
            Minimalist Security Intelligence for Developers.
          </p>
          <p className="mt-2 text-xs text-ink/40 dark:text-slate-500">
            © {new Date().getFullYear()} SecBerg. All rights reserved.
          </p>
        </div>

        {/* Column 2: Tools */}
        <div>
          <h4 className="font-display text-sm font-bold tracking-wide text-ink dark:text-white mb-4">Tools</h4>
          <ul className="space-y-3 text-sm text-ink/60 dark:text-white/60">
            <li><Link to="/tools/vulnerability-scanner" className="hover:text-ink dark:hover:text-white transition-colors">Header Scanner</Link></li>
            <li><Link to="/tools/ssl-analyzer" className="hover:text-ink dark:hover:text-white transition-colors">Hash &amp; Entropy</Link></li>
            <li><Link to="/tools/password-strength" className="hover:text-ink dark:hover:text-white transition-colors">HTTP Chain</Link></li>
            <li><Link to="/tools/dns-lookup" className="hover:text-ink dark:hover:text-white transition-colors">SSH Monitor</Link></li>
            <li><Link to="/tools/port-scanner" className="hover:text-ink dark:hover:text-white transition-colors">Port Scanner</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 className="font-display text-sm font-bold tracking-wide text-ink dark:text-white mb-4">Resources</h4>
          <ul className="space-y-3 text-sm text-ink/60 dark:text-white/60">
            <li><a href="https://github.com/ANKITVAGHELA990" target="_blank" rel="noopener noreferrer" className="hover:text-ink dark:hover:text-white transition-colors">GitHub Repository</a></li>
          </ul>
        </div>

        {/* Column 4: Project */}
        <div>
          <h4 className="font-display text-sm font-bold tracking-wide text-ink dark:text-white mb-4">Project</h4>
          <ul className="space-y-3 text-sm text-ink/60 dark:text-white/60">
            <li><span className="text-ink/50 dark:text-slate-400">Created by</span> <span className="font-medium text-ink dark:text-slate-100">Ankit Vaghela</span></li>
            <li><a href="https://www.linkedin.com/in/ankitvaghela09" target="_blank" rel="noopener noreferrer" className="hover:text-ink dark:hover:text-white transition-colors">LinkedIn</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
