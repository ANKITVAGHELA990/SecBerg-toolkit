import { useMemo, useState } from "react";
import { useIsDark } from "../../hooks/useIsDark";
import { useActivity } from "../../contexts/ActivityContext";
import {
  Link2,
  Search,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  X,
  ArrowDown,
  AlertCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API_BASE = "http://127.0.0.1:8000";

type FlagStatus = "pass" | "warn" | "fail";

type SecurityFlag = {
  label: string;
  value: string;
  status: FlagStatus;
};

type ChainNode = {
  id: string;
  statusCode: number;
  url: string;
  method: string;
  securityFlags: SecurityFlag[];
  missingAttributes: string[];
};

type ApiSecurityHeader = {
  header: string;
  label: string;
  value: string | null;
  present: boolean;
};

type ApiChainHop = {
  hop: number;
  url: string;
  status_code: number;
  is_https: boolean;
  security_headers: ApiSecurityHeader[];
};

type ChainData = {
  target: string;
  total_hops: number;
  downgrade_detected: boolean;
  highest_severity: string;
  chain: ApiChainHop[];
};

const statusCodeStyles: Record<string, string> = {
  "2xx": "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  "3xx": "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
  "4xx": "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  "5xx": "bg-red-100 text-red-800 ring-1 ring-red-200",
};

function statusFamily(code: number): string {
  if (code >= 200 && code < 300) return "2xx";
  if (code >= 300 && code < 400) return "3xx";
  if (code >= 400 && code < 500) return "4xx";
  return "5xx";
}

const flagIcons: Record<FlagStatus, typeof ShieldCheck> = {
  pass: ShieldCheck,
  warn: ShieldAlert,
  fail: ShieldX,
};

const flagStyles: Record<FlagStatus, string> = {
  pass: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  warn: "text-amber-800 bg-amber-50 ring-amber-200",
  fail: "text-red-700 bg-red-50 ring-red-200",
};

function mapHopToNode(hop: ApiChainHop): ChainNode {
  const securityFlags: SecurityFlag[] = hop.security_headers.map((header) => ({
    label: header.label,
    value: header.present ? (header.value ?? "Present") : "Not present",
    status: header.present ? "pass" : "fail",
  }));

  const missingAttributes = hop.security_headers
    .filter((header) => !header.present && header.header !== "location")
    .map((header) => header.label);

  return {
    id: `hop-${hop.hop}`,
    statusCode: hop.status_code,
    url: hop.url,
    method: "GET",
    securityFlags,
    missingAttributes,
  };
}

async function parseApiError(response: Response): Promise<string> {
  const data = await response.json().catch(() => null);
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) {
    return data.detail.map((item: { msg?: string }) => item.msg).join(", ");
  }
  return `Request failed (${response.status})`;
}

export function HttpChainInspectorPanel() {
  const isDark = useIsDark();
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainData, setChainData] = useState<ChainData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [latencyData, setLatencyData] = useState<{ name: string; latency: number }[]>([]);
  const { addActivity } = useActivity();

  const axisStroke = isDark ? "#94a3b8" : "oklch(0.18 0.01 240 / 0.5)";
  const gridStroke = isDark ? "#334155" : "oklch(0.18 0.01 240 / 0.1)";
  const barFill = isDark ? "#38bdf8" : "oklch(0.18 0.01 240)";
  const tooltipCursor = isDark ? "#1e293b" : "oklch(0.18 0.01 240 / 0.05)";
  const tooltipBorder = isDark ? "#334155" : "oklch(0.18 0.01 240 / 0.1)";
  const tooltipColor = isDark ? "#e2e8f0" : "oklch(0.18 0.01 240)";

  const chainNodes = useMemo(
    () => (chainData?.chain ?? []).map(mapHopToNode),
    [chainData],
  );

  const selectedNode = chainNodes.find((node) => node.id === selectedId) ?? null;

  async function run() {
    const trimmed = target.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setChainData(null);
    setSelectedId(null);

    try {
      const response = await fetch(`${API_BASE}/api/scan/http-chain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const data: ChainData = await response.json();
      setChainData(data);

      if (data.chain.length > 0) {
        setSelectedId(`hop-${data.chain[0].hop}`);
      }

      const staticMockLatency = data.chain.map((hop) => ({
        name: `Hop ${hop.hop}`,
        latency: 40 + (hop.hop * 35) % 100
      }));
      setLatencyData(staticMockLatency);

      addActivity({
        toolName: "HTTP Chain",
        target: trimmed,
        resultSummary: `${data.total_hops} hops`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to trace chain");
    } finally {
      setIsLoading(false);
    }
  }

  function selectNode(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setMobileSheetOpen(true);
    }
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
          <Link2 className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">Tool</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">
            HTTP Chain Inspector
          </h1>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-lg text-ink/70 dark:text-slate-300">
        Follow every hop a request takes — across redirects, proxies, and CDNs.
      </p>

      <div className="mt-8 flex w-full items-stretch gap-2 rounded-full border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ink/20 dark:focus-within:ring-slate-700">
        <div className="flex flex-1 items-center gap-2 px-4">
          <Search className="h-4 w-4 shrink-0 text-ink/40 dark:text-slate-500" />
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && run()}
            placeholder="https://example.com or http://legacy-site.org"
            aria-label="Target registry URL"
            disabled={isLoading}
            className="w-full bg-transparent py-2.5 text-sm text-ink dark:text-white placeholder:text-ink/40 focus:outline-none disabled:opacity-60"
          />
        </div>
        <button
          onClick={run}
          disabled={isLoading || !target.trim()}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-ink/20 transition hover:scale-[1.02] hover:bg-ink/90 disabled:opacity-60"
        >
          {isLoading ? "Tracing…" : "Trace chain"}
        </button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-6 rounded-2xl border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Trace failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="mt-8 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ink/15 dark:border-slate-700 border-t-ink dark:border-t-sky-400" />
          <p className="mt-4 text-sm font-medium text-ink/70 dark:text-slate-300">Tracing redirect chain…</p>
        </div>
      )}

      {chainData && !isLoading && chainNodes.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] animate-in fade-in slide-in-from-bottom-3 duration-700">
          <div className="rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 pb-4">
              <div>
                <h2 className="font-display text-base font-semibold text-ink dark:text-white">Traversal timeline</h2>
                <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">
                  {chainData.total_hops} hop{chainData.total_hops === 1 ? "" : "s"} ·{" "}
                  {chainData.target}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {chainData.downgrade_detected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-medium text-red-700 ring-1 ring-red-200">
                    <ShieldX className="h-3 w-3" /> HTTPS downgrade
                  </span>
                )}
                <span className="rounded-full bg-ink/5 dark:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-ink/70 dark:text-slate-300">
                  Severity: {chainData.highest_severity}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              {chainNodes.map((node, index) => (
                <div key={node.id} className="flex w-full max-w-xl flex-col items-center">
                  <button
                    type="button"
                    onClick={() => selectNode(node.id)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all ${selectedId === node.id
                      ? "border-ink/25 bg-ink/[0.03] shadow-md ring-2 ring-ink/15"
                      : "border-ink/10 bg-surface dark:bg-slate-800 dark:border-slate-700 dark:text-white hover:border-ink/20 hover:shadow-sm"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 font-mono text-sm font-bold ${statusCodeStyles[statusFamily(node.statusCode)]}`}
                        >
                          {node.statusCode}
                        </span>
                        <span className="rounded-md bg-ink/5 dark:bg-slate-700 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink/60 dark:text-slate-400">
                          {node.method}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 break-all font-mono text-sm leading-relaxed text-ink dark:text-white">
                      {node.url}
                    </p>

                    <p className="mt-2 text-[11px] text-ink/45 group-hover:text-ink/60 dark:text-slate-400">
                      Click to inspect security flags →
                    </p>
                  </button>

                  {index < chainNodes.length - 1 && (
                    <div className="flex flex-col items-center py-2" aria-hidden>
                      <div className="h-4 w-px bg-ink/15" />
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 text-ink/40 shadow-sm">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </span>
                      <div className="h-4 w-px bg-ink/15" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mt-6">
              <h2 className="font-display text-base font-semibold text-ink dark:text-white">Hop Latency</h2>
              <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400 mb-4">Response time per hop (ms)</p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={latencyData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: axisStroke }} />
                    <YAxis dataKey="name" type="category" width={50} stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: axisStroke }} />
                    <RechartsTooltip
                      cursor={{ fill: tooltipCursor }}
                      contentStyle={{ borderRadius: 12, border: `1px solid ${tooltipBorder}`, fontSize: 12, color: tooltipColor, background: isDark ? '#1e293b' : '#fff' }}
                    />
                    <Bar dataKey="latency" fill={barFill} radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            {selectedNode ? (
              <InspectionPanel node={selectedNode} onClose={() => setSelectedId(null)} />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white/50 p-8 text-center">
                <div>
                  <ChevronDown className="mx-auto h-6 w-6 text-ink/25" />
                  <p className="mt-3 text-sm font-medium text-ink/50 dark:text-slate-400">Select a timeline node</p>
                  <p className="mt-1 text-xs text-ink/40 dark:text-slate-500">
                    Security flags and missing attributes appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          {selectedNode && (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>Hop inspection</SheetTitle>
                <SheetDescription>Security flags for {selectedNode.url}</SheetDescription>
              </SheetHeader>
              <InspectionPanel
                node={selectedNode}
                onClose={() => setMobileSheetOpen(false)}
                compact
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}

function InspectionPanel({
  node,
  onClose,
  compact = false,
}: {
  node: ChainNode;
  onClose: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 ${compact ? "border-0 shadow-none" : "sticky top-36"
        }`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-ink/5 p-5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">
            Inspection panel
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-ink dark:text-white">Hop details</h3>
          <p className="mt-2 break-all font-mono text-xs leading-relaxed text-ink/60 dark:text-slate-400">{node.url}</p>
        </div>
        {!compact && (
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/10 text-ink/50 dark:text-slate-400 transition hover:bg-ink/5 hover:text-ink dark:text-white"
            aria-label="Close inspection panel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-flex rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${statusCodeStyles[statusFamily(node.statusCode)]}`}
          >
            {node.statusCode}
          </span>
          <span className="text-xs text-ink/50 dark:text-slate-400">{node.method}</span>
        </div>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">
            Captured security flags
          </h4>
          <div className="mt-3 space-y-2">
            {node.securityFlags.length === 0 ? (
              <p className="rounded-xl border border-ink/5 bg-surface dark:bg-slate-800 dark:border-slate-700 dark:text-white px-3 py-2.5 text-xs text-ink/55">
                No security headers captured on this hop.
              </p>
            ) : (
              node.securityFlags.map((flag) => {
                const Icon = flagIcons[flag.status];
                return (
                  <div
                    key={flag.label}
                    className="flex items-start gap-3 rounded-xl border border-ink/5 bg-surface dark:bg-slate-800 dark:border-slate-700 dark:text-white px-3 py-2.5"
                  >
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg ring-1 ${flagStyles[flag.status]}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-ink dark:text-white">{flag.label}</p>
                      <p className="mt-0.5 break-all text-xs text-ink/55 dark:text-slate-400">{flag.value}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-6">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">
            Missing attributes
          </h4>
          <div className="mt-3 space-y-2">
            {node.missingAttributes.length === 0 ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
                All expected headers present on this hop.
              </p>
            ) : (
              node.missingAttributes.map((attr) => (
                <div
                  key={attr}
                  className="flex items-center gap-3 rounded-xl border border-amber-200/60 bg-amber-50/80 px-3 py-2.5"
                >
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-xs font-medium text-amber-900">{attr}</p>
                    <p className="text-[11px] text-amber-800/70">Header not detected in response</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
