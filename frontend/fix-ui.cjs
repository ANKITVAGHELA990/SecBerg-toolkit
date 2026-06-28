const fs = require('fs');
const path = require('path');

// 1. ToolChart.tsx
let toolChart = fs.readFileSync('src/components/landing/ToolChart.tsx', 'utf8');
// Replace internal useIsDark with import
toolChart = toolChart.replace(/function useIsDark\(\) \{[\s\S]*?return dark;\n\}/, 'import { useIsDark } from "../../hooks/useIsDark";');
// Update colors
toolChart = toolChart.replace(/const axisColor = isDark \? INK_DARK : INK;/, 'const axisColor = isDark ? "#cbd5e1" : "#475569";');
toolChart = toolChart.replace(/const gridColor = isDark \? MUTED_DARK : MUTED;/, 'const gridColor = isDark ? "#334155" : "#e2e8f0";'); 
fs.writeFileSync('src/components/landing/ToolChart.tsx', toolChart);

// 2. DashboardPreview.tsx
let dashboard = fs.readFileSync('src/components/landing/DashboardPreview.tsx', 'utf8');
if (!dashboard.includes('useIsDark')) {
  dashboard = dashboard.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useIsDark } from "../../hooks/useIsDark";');
  dashboard = dashboard.replace('export function DashboardPreview() {', 'export function DashboardPreview() {\n  const isDark = useIsDark();\n  const axisColor = isDark ? "#cbd5e1" : "#475569";');
  dashboard = dashboard.replace(/stroke="oklch\(0\.18 0\.01 240 \/ 0\.5\)"/g, 'stroke={axisColor}');
  fs.writeFileSync('src/components/landing/DashboardPreview.tsx', dashboard);
}

// 3. ThreatChart.tsx
let threat = fs.readFileSync('src/components/landing/ThreatChart.tsx', 'utf8');
if (!threat.includes('useIsDark')) {
  threat = threat.replace('import {', 'import { useIsDark } from "../../hooks/useIsDark";\nimport {');
  threat = threat.replace('export function ThreatChart() {', 'export function ThreatChart() {\n  const isDark = useIsDark();\n  const axisColor = isDark ? "#cbd5e1" : "#475569";\n  const gridColor = isDark ? "#334155" : "#e2e8f0";');
  threat = threat.replace(/stroke={MUTED}/g, 'stroke={gridColor}');
  threat = threat.replace(/stroke={INK}/g, 'stroke={axisColor}');
  // add stroke attributes to XAxis and YAxis if they exist and don't have stroke
  threat = threat.replace(/<XAxis([^>]*?)(\/?)>/g, (match, p1, p2) => {
    if (match.includes('stroke')) return match;
    return `<XAxis stroke={axisColor} fontSize={11} ${p1}${p2}>`;
  });
  threat = threat.replace(/<YAxis([^>]*?)(\/?)>/g, (match, p1, p2) => {
    if (match.includes('stroke')) return match;
    return `<YAxis stroke={axisColor} fontSize={11} ${p1}${p2}>`;
  });
  fs.writeFileSync('src/components/landing/ThreatChart.tsx', threat);
}

// 4. VulnScannerPanel.tsx - Title and Input
let vuln = fs.readFileSync('src/components/landing/VulnScannerPanel.tsx', 'utf8');
vuln = vuln.replace(/<h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">/g, '<h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">');
vuln = vuln.replace(/<input([^>]*?)className="([^>]*?)bg-transparent([^>]*?)"/g, (match, p1, p2, p3) => {
  return `<input${p1}className="${p2}bg-transparent dark:bg-slate-900 dark:text-white dark:border-slate-700${p3}"`;
});
fs.writeFileSync('src/components/landing/VulnScannerPanel.tsx', vuln);

// 5. 'What it does' bullets in all tool routes
const toolsFiles = [
  'tools.dns-lookup.tsx',
  'tools.password-strength.tsx',
  'tools.port-scanner.tsx',
  'tools.ssl-analyzer.tsx',
  'tools.vulnerability-scanner.tsx'
];
toolsFiles.forEach(f => {
  let p = path.join('src/routes', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // We already added dark classes previously in the wrapper? Wait, checking the original content: 
    // className="flex gap-3 text-sm text-ink/80 animate-in..."
    content = content.replace(/className="flex gap-3 text-sm text-ink\/80(?! dark:text-slate-300)/g, 'className="flex gap-3 text-sm text-ink/80 dark:text-slate-300');
    fs.writeFileSync(p, content);
  }
});
