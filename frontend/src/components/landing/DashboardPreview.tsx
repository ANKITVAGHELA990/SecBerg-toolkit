import { Search, Activity, Clock, Terminal, ShieldAlert, Link2, Binary, Shield, Radar, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useIsDark } from "../../hooks/useIsDark";
import { useActivity } from "../../contexts/ActivityContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

export function DashboardPreview() {
  const isDark = useIsDark();
  const axisColor = isDark ? "#cbd5e1" : "#475569";
  const [launchInput, setLaunchInput] = useState("");
  const { activities } = useActivity();

  const [scanVolumeData] = useState([
    { day: "Mon", scans: 145 },
    { day: "Tue", scans: 232 },
    { day: "Wed", scans: 180 },
    { day: "Thu", scans: 310 },
    { day: "Fri", scans: 290 },
    { day: "Sat", scans: 120 },
    { day: "Sun", scans: 95 },
  ]);

  const targetDistData = [
    { name: "Localhost", value: 45, color: isDark ? "#818cf8" : "oklch(0.18 0.01 240)" },
    { name: "Staging", value: 30, color: isDark ? "#f87171" : "oklch(0.65 0.2 25)" },
    { name: "Production", value: 25, color: isDark ? "#34d399" : "oklch(0.72 0.16 155)" },
  ];

  return (
    <div id="command-center" className="mx-auto w-[min(1100px,calc(100%-1.5rem))] rounded-[28px] border border-white/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/80 p-3 shadow-[0_30px_80px_-30px_rgba(15,30,60,0.35)] backdrop-blur-xl md:p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
      <div className="overflow-hidden rounded-[22px] bg-surface dark:bg-slate-950 p-6 md:p-10 border border-ink/5 dark:border-slate-800">
        
        {/* Header & System Health */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-ink/5 pb-8">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink dark:text-white md:text-3xl">
              <Terminal className="h-6 w-6 text-ink dark:text-white/70" />
              Command Center
            </h2>
            <p className="mt-1 text-sm text-ink dark:text-white/60">
              Centralized operational dashboard for launching and tracking security scans.
            </p>
          </div>
          
          <div className="flex shrink-0 items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 shadow-sm">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs font-semibold text-emerald-900">FastAPI Backend</span>
            <span className="rounded-full bg-emerald-200/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Connected
            </span>
          </div>
        </div>

        {/* Quick Launch Input */}
        <div className="mt-10">
          <label className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-ink dark:text-white/50">
            Quick Launch
          </label>
          <div className="flex w-full items-stretch gap-2 rounded-full border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-sm focus-within:ring-2 focus-within:ring-ink/20 dark:focus-within:ring-slate-600">
            <div className="flex flex-1 items-center gap-3 px-5">
              <Search className="h-5 w-5 shrink-0 text-ink dark:text-white/40" />
              <input
                value={launchInput}
                onChange={(e) => setLaunchInput(e.target.value)}
                placeholder="Enter an IP, domain, or URL (e.g., 127.0.0.1 or https://example.com)"
                className="w-full bg-transparent py-3 text-base text-ink dark:text-white placeholder:text-ink dark:text-white/40 focus:outline-none"
              />
            </div>
            <button
              disabled={!launchInput.trim()}
              className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-white shadow-lg shadow-ink/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-ink/30 hover:bg-ink/90 disabled:opacity-50"
            >
              Launch Scan
            </button>
          </div>
        </div>

        {/* Toolkit Capabilities */}
        <div className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
            <h3 className="font-display text-base font-bold text-ink dark:text-white mb-4">Toolkit Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="flex items-start gap-3 rounded-xl border border-ink/5 dark:border-slate-700/50 bg-surface/50 dark:bg-slate-800 p-3 transition-colors hover:border-ink/10 dark:hover:border-slate-600 hover:bg-surface dark:hover:bg-slate-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/5 text-ink dark:text-white/70">
                  <ShieldAlert className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink dark:text-white">Header Scanner</h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink dark:text-white/60">Audit HTTP response headers against standard security baselines.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-ink/5 dark:border-slate-700/50 bg-surface/50 dark:bg-slate-800 p-3 transition-colors hover:border-ink/10 dark:hover:border-slate-600 hover:bg-surface dark:hover:bg-slate-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/5 text-ink dark:text-white/70">
                  <Link2 className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink dark:text-white">HTTP Chain</h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink dark:text-white/60">Trace redirect hops to detect insecure downgrades or loops.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-ink/5 dark:border-slate-700/50 bg-surface/50 dark:bg-slate-800 p-3 transition-colors hover:border-ink/10 dark:hover:border-slate-600 hover:bg-surface dark:hover:bg-slate-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/5 text-ink dark:text-white/70">
                  <Binary className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink dark:text-white">Hash & Entropy</h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink dark:text-white/60">Calculate Shannon entropy to identify likely secrets or weak hashes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-ink/5 dark:border-slate-700/50 bg-surface/50 dark:bg-slate-800 p-3 transition-colors hover:border-ink/10 dark:hover:border-slate-600 hover:bg-surface dark:hover:bg-slate-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/5 text-ink dark:text-white/70">
                  <Shield className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink dark:text-white">SSH Monitor</h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink dark:text-white/60">Monitor simulated log streams to flag brute-force threshold violations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-ink/5 dark:border-slate-700/50 bg-surface/50 dark:bg-slate-800 p-3 transition-colors hover:border-ink/10 dark:hover:border-slate-600 hover:bg-surface dark:hover:bg-slate-700">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/5 text-ink dark:text-white/70">
                  <Radar className="h-3 w-3" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink dark:text-white">Port Scanner</h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink dark:text-white/60">Map open localhost ports and identify exposed operational services.</p>
                </div>
              </div>

            </div>
            
            <div className="mt-4 flex justify-end border-t border-ink/5 pt-4">
              <a href="/about" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ink dark:text-white/50 hover:text-ink dark:text-white transition-colors">
                Learn More <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-ink dark:text-white/50" />
            <h3 className="font-display text-lg font-bold text-ink dark:text-white">Recent Activity</h3>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-ink/10 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/5 bg-surface/50 text-left text-[11px] uppercase tracking-wider text-ink dark:text-white/50">
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Tool</th>
                    <th className="px-6 py-4 font-semibold">Target</th>
                    <th className="px-6 py-4 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-ink dark:text-white/40">
                          <Clock className="mb-3 h-8 w-8 opacity-20" />
                          <p className="text-sm font-medium">No recent scans recorded</p>
                          <p className="mt-1 text-xs">Activity will appear here once you launch a tool.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    activities.map((activity) => (
                      <tr key={activity.id} className="border-b border-ink/5 dark:border-slate-700/50 hover:bg-surface/30 dark:hover:bg-slate-800 transition-colors animate-in fade-in slide-in-from-top-1">
                        <td className="px-6 py-3 font-mono text-[11px] text-ink dark:text-white/60">{activity.timestamp}</td>
                        <td className="px-6 py-3 font-medium text-ink dark:text-white">{activity.toolName}</td>
                        <td className="px-6 py-3 text-ink dark:text-white/70">{activity.target}</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-semibold text-ink dark:text-white">
                            {activity.resultSummary}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Analytics Section (Outside the main card) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
        <div className="rounded-[28px] border border-white/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/80 p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(15,30,60,0.15)] backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-6">Scan Volume (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanVolumeData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: "oklch(0.18 0.01 240 / 0.05)" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="scans" fill={isDark ? "#818cf8" : "#0f172a"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/80 p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(15,30,60,0.15)] backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold text-ink dark:text-white mb-6">Target Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} />
                <Pie data={targetDistData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {targetDistData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
