import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar as RadarShape,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

/* ── Dark mode hook ─────────────────────────────────────────────────── */
import { useIsDark } from "../../hooks/useIsDark";

export type ChartKind =
  | "port-scanner"
  | "vulnerability-scanner"
  | "password-strength"
  | "ssl-analyzer"
  | "dns-lookup";

const INK = "oklch(0.18 0.01 240)";
const UP = "oklch(0.78 0.16 155)";
const DOWN = "oklch(0.78 0.16 55)";
const MUTED = "oklch(0.18 0.01 240 / 0.12)";
const INK_DARK = "oklch(0.82 0.01 240)";
const MUTED_DARK = "oklch(0.82 0.01 240 / 0.15)";

const portData = [
  { port: "22", hits: 142 },
  { port: "80", hits: 980 },
  { port: "443", hits: 1640 },
  { port: "3306", hits: 87 },
  { port: "5432", hits: 64 },
  { port: "8080", hits: 410 },
  { port: "27017", hits: 32 },
];

const headerDeficiencyData = [
  { name: "CSP",       missing: 24, fill: "#ef4444" },
  { name: "HSTS",      missing: 18, fill: "#f59e0b" },
  { name: "X-Frame",   missing: 15, fill: "#3b82f6" },
  { name: "X-Content", missing: 12, fill: "#6366f1" },
  { name: "Referrer",  missing: 9,  fill: "#8b5cf6" },
];

const pwData = [
  { name: "Weak", value: 28, color: DOWN },
  { name: "Medium", value: 41, color: "oklch(0.82 0.14 90)" },
  { name: "Strong", value: 23, color: UP },
  { name: "Excellent", value: 8, color: INK },
];

const sslData = [
  { metric: "Cert", score: 95 },
  { metric: "Cipher", score: 82 },
  { metric: "Protocol", score: 88 },
  { metric: "HSTS", score: 70 },
  { metric: "OCSP", score: 76 },
  { metric: "Key Exch", score: 90 },
];

const dnsData = [
  { t: "00", ms: 32 },
  { t: "04", ms: 28 },
  { t: "08", ms: 41 },
  { t: "12", ms: 54 },
  { t: "16", ms: 47 },
  { t: "20", ms: 35 },
  { t: "24", ms: 30 },
];

export function ToolChart({ kind }: { kind: ChartKind }) {
  const isDark = useIsDark();
  const axisColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {kind === "port-scanner" ? (
          <BarChart data={portData}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis dataKey="port" stroke={axisColor} fontSize={11} />
            <YAxis stroke={axisColor} fontSize={11} />
            <Tooltip cursor={{ fill: gridColor }} />
            <Bar dataKey="hits" fill={axisColor} radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : kind === "vulnerability-scanner" ? (
          <BarChart data={headerDeficiencyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Scans missing header",
                angle: -90,
                position: "insideLeft",
                offset: 18,
                style: { fill: axisColor, fontSize: 10 },
              }}
            />
            <Tooltip
              cursor={{ fill: isDark ? "#1e293b" : "#f1f5f9" }}
              contentStyle={{
                borderRadius: 10,
                border: `1px solid ${gridColor}`,
                fontSize: 12,
                color: isDark ? "#e2e8f0" : "#1e293b",
                background: isDark ? "#0f172a" : "#fff",
              }}
              formatter={(v: number) => [`${v} scans`, "Missing"]}
            />
            <Bar dataKey="missing" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {headerDeficiencyData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} fillOpacity={isDark ? 0.9 : 1} />
              ))}
            </Bar>
          </BarChart>
        ) : kind === "password-strength" ? (
          <PieChart>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Pie data={pwData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
              {pwData.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        ) : kind === "ssl-analyzer" ? (
          <RadarChart data={sslData}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="metric" tick={{ fill: axisColor, fontSize: 11 }} />
            <PolarRadiusAxis stroke={gridColor} tick={{ fill: axisColor, fontSize: 10 }} />
            <RadarShape dataKey="score" stroke={axisColor} fill={axisColor} fillOpacity={0.35} />
            <Tooltip />
          </RadarChart>
        ) : (
          <LineChart data={dnsData}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis dataKey="t" stroke={axisColor} fontSize={11} />
            <YAxis stroke={axisColor} fontSize={11} />
            <Tooltip />
            <Line type="monotone" dataKey="ms" stroke={axisColor} strokeWidth={2} dot={{ r: 3, fill: axisColor }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
