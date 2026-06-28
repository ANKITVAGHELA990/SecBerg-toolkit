import { useIsDark } from "../../hooks/useIsDark";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const INK = "oklch(0.18 0.01 240)";
const MUTED = "oklch(0.18 0.01 240 / 0.1)";

const data = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  blocked: Math.round(40 + Math.sin(i / 2) * 25 + Math.random() * 30),
  allowed: Math.round(120 + Math.cos(i / 3) * 40 + Math.random() * 25),
}));

export function ThreatChart() {
  const isDark = useIsDark();
  const axisColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  return (
    <div className="mt-4 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-ink/60">Threat activity · last 24h</p>
          <p className="font-display text-xl font-bold text-ink">2,418 events</p>
        </div>
        <div className="flex gap-3 text-[11px] text-ink/60">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-ink" /> Blocked
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.78 0.16 155)" }} /> Allowed
          </span>
        </div>
      </div>
      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INK} stopOpacity={0.45} />
                <stop offset="100%" stopColor={INK} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAllowed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.16 155)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="oklch(0.78 0.16 155)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis dataKey="h" stroke={axisColor} fontSize={10} interval={3} />
            <YAxis stroke={axisColor} fontSize={10} />
            <Tooltip />
            <Area type="monotone" dataKey="allowed" stroke="oklch(0.78 0.16 155)" fill="url(#gAllowed)" />
            <Area type="monotone" dataKey="blocked" stroke={axisColor} fill="url(#gBlocked)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
