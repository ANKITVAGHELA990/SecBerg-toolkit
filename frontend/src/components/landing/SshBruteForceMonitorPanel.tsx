import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActivity } from "../../contexts/ActivityContext";
import { useIsDark } from "../../hooks/useIsDark";
import {
  Activity,
  Clock,
  Gauge,
  AlertTriangle,
  RefreshCw,
  Play,
  Square,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const DOWN = "oklch(0.78 0.16 55)";

type ActiveThreat = {
  ip: string;
  failures: number;
  status: string;
};

function buildSeries(minutes: number, threshold: number) {
  const points: { time: string; attempts: number }[] = [];
  const now = new Date();

  for (let i = minutes; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60_000);
    const label = t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const base = 8 + Math.sin(i * 0.7) * 6;
    const spike =
      i === Math.floor(minutes * 0.25) || i === Math.floor(minutes * 0.7)
        ? threshold + 15 + (i % 17)
        : i === Math.floor(minutes * 0.5)
          ? threshold - 8
          : 0;
    points.push({ time: label, attempts: Math.round(base + spike) });
  }

  return points;
}

const AUTO_STOP_MS = 30 * 60 * 1000; // 30 minutes

export function SshBruteForceMonitorPanel() {
  const isDark = useIsDark();
  const axisColor = isDark ? "#cbd5e1" : "oklch(0.18 0.01 240)";
  const gridColor = isDark ? "#334155" : "oklch(0.18 0.01 240 / 0.12)";
  const lineColor = isDark ? "#818cf8" : "oklch(0.18 0.01 240)";

  const [timeWindow, setTimeWindow] = useState(15);
  const [threshold, setThreshold] = useState(50);
  const [appliedWindow, setAppliedWindow] = useState(15);
  const [appliedThreshold, setAppliedThreshold] = useState(50);
  const [activeThreats, setActiveThreats] = useState<ActiveThreat[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { addActivity } = useActivity();

  // Refs to hold interval and auto-stop timeout IDs so we can clear them
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
  }, []);

  // Guard: only poll when isMonitoring is true
  useEffect(() => {
    if (!isMonitoring) {
      // Clean up any leftover intervals if monitoring was stopped externally
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    async function fetchThreats() {
      try {
        const response = await fetch("https://secberg-api.onrender.com/api/monitor/ssh/active");
        if (response.ok) {
          const data = await response.json();
          setActiveThreats(data.threats || []);
        }
      } catch (err) {
        console.error("Error fetching active SSH threats:", err);
      }
    }

    // Fetch immediately, then on 2-second interval
    fetchThreats();
    pollIntervalRef.current = setInterval(fetchThreats, 2000);

    // Auto-stop after 30 minutes to prevent server overload
    autoStopTimeoutRef.current = setTimeout(() => {
      stopMonitoring();
      alert("SSH Monitor auto-stopped after 30 minutes to conserve server resources.");
    }, AUTO_STOP_MS);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    };
  }, [isMonitoring, stopMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  const series = useMemo(
    () => buildSeries(appliedWindow, appliedThreshold),
    [appliedWindow, appliedThreshold],
  );

  const peak = useMemo(() => Math.max(...series.map((p) => p.attempts)), [series]);

  function applyParams() {
    const w = Math.max(1, Math.min(120, timeWindow));
    const t = Math.max(1, Math.min(500, threshold));
    setAppliedWindow(w);
    setAppliedThreshold(t);
    addActivity({
      toolName: "SSH Monitor",
      target: "System Config",
      resultSummary: `Window: ${w}m, Thr: ${t}`,
    });
  }

  function toggleMonitoring() {
    if (isMonitoring) {
      stopMonitoring();
      setActiveThreats([]);
    } else {
      setIsMonitoring(true);
    }
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
          <Activity className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">Tool</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">
            SSH Brute-Force Monitor
          </h1>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-lg text-ink/70 dark:text-slate-300">
        Spot brute-force campaigns before they land a shell — watch auth spikes in real time.
      </p>

      {/* Start / Stop Control Button */}
      <div className="mt-6">
        <button
          onClick={toggleMonitoring}
          className={`inline-flex items-center gap-2.5 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            isMonitoring
              ? "bg-rose-600 hover:bg-rose-500 text-white dark:bg-rose-500/20 dark:text-rose-400 dark:border dark:border-rose-500/30 dark:hover:bg-rose-500/30"
              : "bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:border dark:border-emerald-500/30 dark:hover:bg-emerald-500/30"
          }`}
        >
          {isMonitoring ? (
            <>
              <Square className="h-4 w-4 fill-current" />
              Stop Monitor
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              Start Live Monitor
            </>
          )}
        </button>
        {isMonitoring && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/50 dark:text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live — auto-stops after 30 minutes
          </p>
        )}
      </div>

      {/* Parameter Adjustment Bar */}
      <div className="mt-6 rounded-2xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">
          Parameter adjustment
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink dark:text-white">
              <Clock className="h-3.5 w-3.5 text-ink/45" />
              Time window (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={120}
              value={timeWindow}
              onChange={(e) => setTimeWindow(Number(e.target.value))}
              className="w-full rounded-xl border border-ink/10 dark:border-slate-700 bg-surface dark:bg-slate-800 px-4 py-2.5 font-mono text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-slate-600"
            />
          </label>

          <label className="flex-1">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink dark:text-white">
              <Gauge className="h-3.5 w-3.5 text-ink/45" />
              Failure threshold (attempts)
            </span>
            <input
              type="number"
              min={1}
              max={500}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full rounded-xl border border-ink/10 dark:border-slate-700 bg-surface dark:bg-slate-800 px-4 py-2.5 font-mono text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-slate-600"
            />
          </label>

          <button
            onClick={applyParams}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-ink/20 transition hover:scale-[1.02] hover:bg-ink/90 sm:mb-0.5"
          >
            <RefreshCw className="h-4 w-4" />
            Apply
          </button>
        </div>
      </div>

      {/* TimeSeries Visualization */}
      <div className="mt-6 w-full rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-ink dark:text-white">
              Auth Spikes
            </h2>
            <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">
              Last {appliedWindow} min · threshold {appliedThreshold} attempts
              {!isMonitoring && (
                <span className="ml-2 text-slate-400 dark:text-slate-500 italic">· paused</span>
              )}
            </p>
          </div>
          <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-[11px] font-medium text-red-800 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/30">
            Peak {peak} / window
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="time"
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${isDark ? "#334155" : "oklch(0.18 0.01 240 / 0.1)"}`,
                  fontSize: 12,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: isDark ? "#e2e8f0" : "oklch(0.18 0.01 240)",
                }}
                formatter={(value: number) => [`${value} attempts`, "Failures"]}
              />
              <ReferenceLine
                y={appliedThreshold}
                stroke={DOWN}
                strokeDasharray="6 4"
                label={{
                  value: `Threshold ${appliedThreshold}`,
                  position: "insideTopRight",
                  fill: DOWN,
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="attempts"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: DOWN, stroke: lineColor, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Alert Feed */}
      <div className="mt-6 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
        <div className="flex items-center justify-between border-b border-ink/5 dark:border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink dark:text-white">Live alert feed</h2>
            <p className="text-xs text-ink/50 dark:text-slate-400">Active breaches above threshold</p>
          </div>
          {isMonitoring ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          ) : (
            <span className="relative flex h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          )}
        </div>

        <ul className="max-h-[420px] overflow-y-auto px-3 py-3">
          {!isMonitoring ? (
            <div className="flex flex-col items-center justify-center py-12 text-ink/40 dark:text-slate-500">
              <Play className="h-8 w-8 mb-3 opacity-40" />
              <p className="text-sm font-medium">Start the monitor to stream live alerts</p>
            </div>
          ) : activeThreats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-ink/40 dark:text-slate-500">
              <p className="text-sm font-medium">No active SSH threats detected</p>
            </div>
          ) : (
            activeThreats.map((threat, i) => (
              <li
                key={threat.ip}
                className="mb-2 last:mb-0 animate-in fade-in slide-in-from-left-2 fill-mode-both"
                style={{ animationDelay: `${i * 60}ms`, animationDuration: "400ms" }}
              >
                <div className="flex gap-3 rounded-2xl border border-red-200/80 dark:border-red-500/20 bg-red-50/90 dark:bg-red-900/20 px-4 py-3.5 transition hover:border-red-300 dark:hover:border-red-500/40">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/30">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                      SSH Threat Blocked — Failures: {threat.failures}
                    </p>
                    <p className="mt-1.5 font-mono text-xs tabular-nums text-red-800/70 dark:text-red-400/70">
                      Status: {threat.status} · Active
                    </p>
                    <p className="mt-2 text-xs text-red-800/80 dark:text-red-400/80">
                      Source IP{" "}
                      <span className="font-mono text-sm font-bold text-red-950 dark:text-red-300">
                        {threat.ip}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
