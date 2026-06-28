import { useState } from "react";
import { useActivity } from "../../contexts/ActivityContext";
import {
  Radar,
  Search,
  CheckCircle2,
  ShieldAlert,
  Ban,
  Network,
  Hash,
  XCircle,
  Loader2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

const API_BASE = "http://127.0.0.1:8000";

type SafetyVerdict = "idle" | "approved" | "blocked";

type PortResult = {
  port: number;
  service: string;
  status: "Open" | "Closed";
};

type ScanResponse = {
  target: string;
  ports: PortResult[];
  open_count: number;
  scanned_count: number;
};

async function parseApiError(response: Response): Promise<string> {
  const data = await response.json().catch(() => null);
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) {
    return data.detail.map((item: { msg?: string }) => item.msg).join(", ");
  }
  return `Request failed (${response.status})`;
}


function parseHost(raw: string): string {
  return raw.trim().replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
}

function isPrivateOrLocalHost(host: string): boolean {
  const h = parseHost(host).toLowerCase();
  if (!h) return false;
  if (h === "localhost" || h.endsWith(".local")) return true;

  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;

  const octets = ipv4.slice(1, 5).map(Number);
  if (octets.some((o) => o > 255)) return false;

  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;

  return false;
}

export function PortScannerPanel() {
  const [target, setTarget] = useState("");
  const [portRange, setPortRange] = useState("1-65535");
  const [verdict, setVerdict] = useState<SafetyVerdict>("idle");
  const [validatedTarget, setValidatedTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [portDistribution, setPortDistribution] = useState<{name: string, value: number, color: string}[]>([]);
  
  const { addActivity } = useActivity();

  async function validate() {
    const host = parseHost(target);
    if (!host) return;

    setShowGrid(false);
    setValidatedTarget(host);
    setError(null);
    setScanResults(null);

    if (isPrivateOrLocalHost(host)) {
      setVerdict("approved");
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/scan/local-ports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: target.trim() }),
        });

        console.log("Raw port scan response:", response);

        if (!response.ok) {
          throw new Error(await parseApiError(response));
        }

        const data: ScanResponse = await response.json();
        setScanResults(data);
        
        const filtered = Math.max(0, data.scanned_count - data.open_count);
        setPortDistribution([
          { name: "Open", value: data.open_count, color: "oklch(0.72 0.16 155)" },
          { name: "Filtered", value: filtered, color: "oklch(0.78 0.14 75)" },
          { name: "Closed", value: 0, color: "oklch(0.18 0.01 240 / 0.15)" }
        ]);
        
        setShowGrid(true);
        
        addActivity({
          toolName: "Port Scanner",
          target: target.trim(),
          resultSummary: `${data.open_count} ports open`,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to scan ports");
      } finally {
        setLoading(false);
      }
    } else {
      setVerdict("blocked");
    }
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
          <Radar className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">Tool</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">
            Port Scanner Guard
          </h1>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-lg text-ink/70 dark:text-slate-300">
        Find every door before someone else does — scoped to approved private networks only.
      </p>

      {/* Configuration Controls */}
      <div className="mt-8 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <div className="flex items-stretch gap-2 rounded-full border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ink/20 dark:focus-within:ring-slate-700">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Network className="h-4 w-4 shrink-0 text-ink/40 dark:text-slate-500" />
              <input
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value);
                  if (verdict !== "idle") setVerdict("idle");
                  setShowGrid(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && validate()}
                placeholder="192.168.1.10 or 10.0.0.5"
                aria-label="Target network host"
                className="w-full bg-transparent py-2.5 text-sm text-ink dark:text-white placeholder:text-ink/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-stretch gap-2 rounded-full border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ink/20 dark:focus-within:ring-slate-700">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Hash className="h-4 w-4 shrink-0 text-ink/40 dark:text-slate-500" />
              <input
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
                placeholder="1-65535"
                aria-label="Port range"
                className="w-full bg-transparent py-2.5 text-sm text-ink dark:text-white placeholder:text-ink/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={validate}
            disabled={loading || !target.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-ink/20 transition hover:scale-[1.02] hover:bg-ink/90 disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {loading ? "Scanning…" : "Validate & scan"}
          </button>
        </div>
      </div>

      {/* Status Assertion Banner */}
      {verdict === "approved" && (
        <div
          role="alert"
          className="mt-6 flex w-full items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500/30 dark:text-emerald-400 px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-emerald-900 dark:text-emerald-200">
              Target approved — private network bounds confirmed
            </p>
            <p className="mt-1 text-sm leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
              <span className="font-mono font-medium">{validatedTarget}</span> falls within an
              authorised RFC 1918 or loopback range. Port scan initiated on range{" "}
              <span className="font-mono font-medium">{portRange}</span>.
            </p>
          </div>
        </div>
      )}

      {verdict === "blocked" && (
        <div
          role="alert"
          className="mt-6 flex w-full items-start gap-4 rounded-2xl border-2 border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-700">
            <Ban className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-red-900 dark:text-red-200">
              Scan blocked — public destination not permitted
            </p>
            <p className="mt-1 text-sm leading-relaxed text-red-800/90 dark:text-red-300/90">
              <span className="font-mono font-medium">{validatedTarget}</span> resolves to a public
              routable address. Port Scanner Guard only operates on private LAN, loopback, and
              link-local targets to prevent unauthorised external scanning.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              Use a private IP such as 192.168.x.x or 10.x.x.x to proceed.
            </p>
          </div>
        </div>
      )}

      {/* Error alert block */}
      {error && (
        <div
          role="alert"
          className="mt-6 flex w-full items-start gap-4 rounded-2xl border-2 border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-700">
            <XCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-red-900 dark:text-red-200">
              Scan failed
            </p>
            <p className="mt-1 text-sm leading-relaxed text-red-800/90 dark:text-red-300/90">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Loading state spinner */}
      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center p-12 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in fade-in duration-300">
          <Loader2 className="h-8 w-8 animate-spin text-ink/60 dark:text-slate-400" />
          <p className="mt-4 text-sm font-medium text-ink/70 dark:text-slate-300">Scanning target ports...</p>
        </div>
      )}

      {/* Port Availability Grid */}
      {showGrid && scanResults && !loading && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] animate-in fade-in slide-in-from-bottom-3 duration-700">
          <div className="flex flex-col items-center rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400 w-full text-left">Port Status Distribution</p>
            <div className="h-40 w-full mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portDistribution}
                    innerRadius={0}
                    outerRadius={65}
                    dataKey="value"
                    stroke="none"
                  >
                    {portDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.18 0.01 240 / 0.1)", fontSize: 12, color: "oklch(0.18 0.01 240)" }}
                    itemStyle={{ fontSize: 12, color: "oklch(0.18 0.01 240)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 px-5 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-ink dark:text-white">Port availability grid</h2>
              <p className="text-xs text-ink/50 dark:text-slate-400">
                {scanResults.target} · range {portRange}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200">
                {scanResults.open_count} open
              </span>
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/70 dark:text-slate-300">
                {scanResults.scanned_count} probed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/5 bg-surface/80 text-left text-[11px] uppercase tracking-wider text-ink/50 dark:text-slate-400">
                  <th className="px-5 py-3 font-medium">Port</th>
                  <th className="px-5 py-3 font-medium">Protocol</th>
                  <th className="px-5 py-3 font-medium">State</th>
                  <th className="px-5 py-3 font-medium">Active service</th>
                  <th className="px-5 py-3 font-medium text-right">RTT</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.ports.map((row, i) => (
                  <tr
                    key={`${row.port}-TCP`}
                    className="border-t border-ink/5 align-middle transition-colors hover:bg-ink/[0.02] animate-in fade-in fill-mode-both"
                    style={{ animationDelay: `${i * 40}ms`, animationDuration: "400ms" }}
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-sm font-semibold text-ink dark:text-white">{row.port}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-ink/5 px-2 py-0.5 font-mono text-[11px] font-medium text-ink/70 dark:text-slate-300">
                        TCP
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StateBadge state={row.status === "Open" ? "open" : "filtered"} />
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-ink/80 dark:text-slate-200">{row.service}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-mono text-xs tabular-nums text-ink/60 dark:text-slate-400">
                        --
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

function StateBadge({ state }: { state: "open" | "filtered" }) {
  if (state === "open") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500/30 dark:text-emerald-4000" />
        open
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      filtered
    </span>
  );
}
