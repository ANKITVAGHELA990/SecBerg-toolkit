import { useState } from "react";
import { ShieldAlert, Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
type Row = {
  rule: string;
  status: "Pass" | "Fail" | "Warn";
  severity: Severity;
  detail: string;
};

const demoRows: Row[] = [
  { rule: "Outdated OpenSSL (CVE-2024-2511)", status: "Fail", severity: "Critical", detail: "1.1.1w detected — upgrade to 3.0.13+" },
  { rule: "Exposed .env on web root", status: "Fail", severity: "High", detail: "GET /.env returned 200 OK" },
  { rule: "Missing Content-Security-Policy", status: "Warn", severity: "Medium", detail: "No CSP header on / and /login" },
  { rule: "TLS 1.0 / 1.1 disabled", status: "Pass", severity: "Info", detail: "Only TLS 1.2 and 1.3 negotiated" },
  { rule: "HSTS preload eligible", status: "Pass", severity: "Info", detail: "max-age=63072000; includeSubDomains; preload" },
  { rule: "Apache mod_status publicly exposed", status: "Fail", severity: "High", detail: "/server-status reachable without auth" },
  { rule: "jQuery 1.12.4 (CVE-2020-11023)", status: "Warn", severity: "Medium", detail: "XSS via attribute selector — upgrade to 3.5+" },
  { rule: "Default SSH banner removed", status: "Pass", severity: "Low", detail: "Banner customised" },
];

const sevStyles: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700 ring-1 ring-red-200",
  High: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  Medium: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  Low: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  Info: "bg-ink/5 text-ink/70 dark:text-slate-300 ring-1 ring-ink/10",
};

export function VulnScannerPanel() {
  const [target, setTarget] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const score = 62;

  function run() {
    if (!target.trim()) return;
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 700);
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">Tool</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">
            Vulnerability Scanner
          </h1>
        </div>
      </div>

      {/* Input Block */}
      <div className="mt-8 flex w-full items-stretch gap-2 rounded-full border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ink/20 dark:focus-within:ring-slate-700">
        <div className="flex flex-1 items-center gap-2 px-4">
          <Search className="h-4 w-4 text-ink/40 dark:text-slate-500" />
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="https://example.com or 192.168.1.10"
            className="w-full bg-transparent dark:bg-slate-900 dark:border-slate-700 py-2.5 text-sm text-ink dark:text-white placeholder:text-ink/40 focus:outline-none"
          />
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-ink/20 transition hover:scale-[1.02] hover:bg-ink/90 disabled:opacity-60"
        >
          {loading ? "Scanning…" : "Run scan"}
        </button>
      </div>

      {/* Analysis Layout */}
      {showResults && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] animate-in fade-in slide-in-from-bottom-3 duration-700">
          {/* Gauge */}
          <div className="rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">
              Overall score
            </p>
            <Gauge score={score} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Mini label="Pass" value={demoRows.filter((r) => r.status === "Pass").length} tone="ok" />
              <Mini label="Warn" value={demoRows.filter((r) => r.status === "Warn").length} tone="warn" />
              <Mini label="Fail" value={demoRows.filter((r) => r.status === "Fail").length} tone="bad" />
            </div>
          </div>

          {/* Data Matrix */}
          <div className="overflow-hidden rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
              <div>
                <h2 className="font-display text-base font-semibold text-ink dark:text-white">Findings</h2>
                <p className="text-xs text-ink/50 dark:text-slate-400">Scanned {target || "target"}</p>
              </div>
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/70 dark:text-slate-300">
                {demoRows.length} rules evaluated
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-ink/50 dark:text-slate-400">
                    <th className="px-5 py-3 font-medium">Rule</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {demoRows.map((r, i) => (
                    <tr
                      key={r.rule}
                      className="border-t border-ink/5 align-top animate-in fade-in fill-mode-both"
                      style={{ animationDelay: `${i * 60}ms`, animationDuration: "500ms" }}
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink dark:text-white">{r.rule}</p>
                        <p className="text-xs text-ink/55">{r.detail}</p>
                      </td>
                      <td className="px-5 py-3">
                        <StatusFlag status={r.status} />
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sevStyles[r.severity]}`}
                        >
                          {r.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Gauge({ score }: { score: number }) {
  const radius = 70;
  const circ = Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? "oklch(0.72 0.16 155)" : score >= 50 ? "oklch(0.78 0.14 75)" : "oklch(0.65 0.2 25)";
  return (
    <div className="relative mt-3 grid place-items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d={`M 20 110 A ${radius} ${radius} 0 0 1 180 110`}
          fill="none"
          stroke="oklch(0.18 0.01 240 / 0.1)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M 20 110 A ${radius} ${radius} 0 0 1 180 110`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <div className="font-display text-4xl font-bold text-ink dark:text-white">
          {score}
          <span className="text-base font-medium text-ink/50 dark:text-slate-400">/100</span>
        </div>
        <p className="text-[11px] uppercase tracking-wider text-ink/50 dark:text-slate-400">Security score</p>
      </div>
    </div>
  );
}

function StatusFlag({ status }: { status: Row["status"] }) {
  if (status === "Pass")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-3 w-3" /> Pass
      </span>
    );
  if (status === "Warn")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
        <AlertTriangle className="h-3 w-3" /> Warn
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-medium text-red-700 ring-1 ring-red-200">
      <XCircle className="h-3 w-3" /> Fail
    </span>
  );
}

function Mini({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" | "bad" }) {
  const cls =
    tone === "ok" ? "text-emerald-700" : tone === "warn" ? "text-amber-700" : "text-red-700";
  return (
    <div className="rounded-xl border border-ink/5 bg-surface dark:bg-slate-800/50 dark:border-slate-700 py-2">
      <div className={`font-display text-lg font-bold ${cls}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-ink/50 dark:text-slate-400">{label}</div>
    </div>
  );
}
