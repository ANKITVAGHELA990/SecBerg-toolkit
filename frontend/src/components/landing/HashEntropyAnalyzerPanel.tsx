import { useState } from "react";
import { useIsDark } from "../../hooks/useIsDark";
import { useActivity } from "../../contexts/ActivityContext";
import { Lock, FileText, Activity, AlertTriangle, ShieldCheck, AlertOctagon } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

type FormatInfo = {
  name: string;
  desc: string;
  secure: boolean | null;
  type: string;
};

// Preset samples to test
const samples = [
  { label: "Bcrypt Hash", value: "$2a$12$K89.fNlq2GkR7/WkZcNuou5QYfX8vV.f6.2pBmW5hTf17u3h6/QvG" },
  { label: "JWT Token", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" },
  { label: "MD5 Hash", value: "098f6bcd4621d373cade4e832627b4f6" },
  { label: "SHA-256 Hash", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
  { label: "Plaintext", value: "admin123" }
];

export function HashEntropyAnalyzerPanel() {
  const isDark = useIsDark();
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    format: FormatInfo;
    entropy: number;
    length: number;
    bytes: number;
  } | null>(null);
  const { addActivity } = useActivity();

  function calculateEntropy(str: string): number {
    if (!str) return 0;
    const len = str.length;
    const freqs: Record<string, number> = {};
    for (let i = 0; i < len; i++) {
      const char = str[i];
      freqs[char] = (freqs[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in freqs) {
      const p = freqs[char] / len;
      entropy -= p * Math.log2(p);
    }
    return parseFloat(entropy.toFixed(3));
  }

  function detectFormat(str: string): FormatInfo {
    const trimmed = str.trim();
    if (!trimmed) return { name: "Empty", desc: "No input provided", secure: null, type: "none" };

    // Bcrypt: starts with $2a$, $2b$, $2y$ and is 60 chars
    if (/^\$2[aby]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/.test(trimmed)) {
      return { name: "Bcrypt Hash", desc: "Highly secure password hashing function with adaptive work factor.", secure: true, type: "bcrypt" };
    }

    // Argon2: starts with $argon2
    if (/^\$argon2(id?|d)\$/.test(trimmed)) {
      return { name: "Argon2 Hash", desc: "State-of-the-art password hashing algorithm (OWASP recommended).", secure: true, type: "argon2" };
    }

    // JWT: 3 base64 strings separated by dots
    if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(trimmed)) {
      return { name: "JSON Web Token (JWT)", desc: "Base64URL-encoded credential token. Ensure signatures are validated.", secure: null, type: "jwt" };
    }

    // UUID: 8-4-4-4-12 hex chars
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed)) {
      return { name: "UUID (v1/v4)", desc: "Universally Unique Identifier. Standard random token structure.", secure: true, type: "uuid" };
    }

    // MD5: 32 hex
    if (/^[0-9a-fA-F]{32}$/.test(trimmed)) {
      return { name: "MD5 Hash", desc: "Cryptographically broken 128-bit hash. Highly vulnerable to collisions.", secure: false, type: "md5" };
    }

    // SHA-1: 40 hex
    if (/^[0-9a-fA-F]{40}$/.test(trimmed)) {
      return { name: "SHA-1 Hash", desc: "Deprecated 160-bit hash. Vulnerable to collision attacks.", secure: false, type: "sha1" };
    }

    // SHA-256: 64 hex
    if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      return { name: "SHA-256 Hash", desc: "Secure 256-bit hash. Industry-standard for data signatures and verification.", secure: true, type: "sha256" };
    }

    // SHA-512: 128 hex
    if (/^[0-9a-fA-F]{128}$/.test(trimmed)) {
      return { name: "SHA-512 Hash", desc: "Secure 512-bit hash. Extremely robust and collision-resistant.", secure: true, type: "sha512" };
    }

    // Base64
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length > 8) {
      try {
        atob(trimmed);
        return { name: "Base64 Encoded Data", desc: "Binary data encoded as ASCII text. Note: Base64 encodes but does not secure or hash.", secure: null, type: "base64" };
      } catch {
        // Fall through
      }
    }

    // Hexadecimal string
    if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length > 8) {
      return { name: "Hexadecimal String", desc: "Raw byte stream encoded in hexadecimal notation.", secure: null, type: "hex" };
    }

    // Plaintext / Unknown
    if (trimmed.length > 0) {
      // Plaintext: short word, low complexity, or common password characters
      const isWeak = trimmed.length < 12 || calculateEntropy(trimmed) < 4.0;
      return {
        name: isWeak ? "Weak Plaintext Secret" : "Plaintext / Unknown Format",
        desc: isWeak 
          ? "Unencrypted plain text of low length or low randomness. High risk if used as a credential." 
          : "Raw plain text value. Ensure credentials are not stored in raw format.",
        secure: false,
        type: "plaintext"
      };
    }

    return { name: "Unknown", desc: "Could not classify algorithmic format.", secure: null, type: "unknown" };
  }

  function handleAnalyze() {
    if (!input.trim()) return;
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      const format = detectFormat(input);
      const entropy = calculateEntropy(input);
      setResult({
        format,
        entropy,
        length: input.length,
        bytes: new Blob([input]).size,
      });
      addActivity({
        toolName: "Hash & Entropy",
        target: "Local input",
        resultSummary: `Entropy: ${entropy}`,
      });
      setLoading(false);
      setShowResults(true);
    }, 550);
  }

  function applyPreset(val: string) {
    setInput(val);
    setShowResults(false);
  }

  function getEntropyLabel(entropy: number) {
    if (entropy < 3.0) return { text: "Low Randomness (Highly Predictable)", color: "text-red-600 bg-red-50 border-red-200" };
    if (entropy < 5.0) return { text: "Moderate Randomness (Medium Strength)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { text: "High Randomness (Cryptographically Secure)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  }

  return (
    <section className="animate-in fade-in zoom-in-95 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white shadow-md shadow-ink/10">
          <Lock className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-ink/50 dark:text-slate-400">Tool</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink dark:text-white md:text-5xl">
            Hash & Entropy Analyzer
          </h1>
        </div>
      </div>

      {/* Input Presets */}
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink/40 self-center mr-1">Presets:</span>
        {samples.map((s) => (
          <button
            key={s.label}
            onClick={() => applyPreset(s.value)}
            className="rounded-full border border-ink/5 bg-white/70 px-3 py-1.5 text-xs text-ink/80 backdrop-blur transition hover:bg-white hover:border-ink/20 active:scale-95"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Repository */}
      <div className="mt-4 rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm focus-within:ring-2 focus-within:ring-ink/20 transition-all duration-300">
        <div className="flex items-center justify-between border-b border-ink/5 pb-2.5 mb-2.5">
          <label htmlFor="hash-input" className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Input Repository
          </label>
          <span className="text-[10px] font-mono text-ink/40 dark:text-slate-500">
            {input.length} chars · {new Blob([input]).size} bytes
          </span>
        </div>
        
        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (showResults) setShowResults(false);
          }}
          placeholder="Paste cryptographic key, API secret, session cookie, password, JWT, or database hash here..."
          className="w-full min-h-[160px] bg-transparent font-mono text-sm leading-relaxed text-ink dark:text-white placeholder:text-ink/30 focus:outline-none resize-y break-all"
        />

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setInput("")}
            disabled={!input}
            className="text-xs text-ink/50 dark:text-slate-400 transition hover:text-ink dark:text-white disabled:opacity-30"
          >
            Clear input
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-white shadow-lg shadow-ink/20 transition-all duration-300 hover:scale-[1.02] hover:bg-ink/90 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze entropy"}
          </button>
        </div>
      </div>

      {/* Diagnostic Report Panels */}
      {showResults && result && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Format Classification Card */}
          <div className="rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/25">
            <div className="flex items-center justify-between border-b border-ink/5 pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/40 dark:text-slate-500">Format Diagnostics</p>
                <h3 className="font-display text-lg font-bold text-ink dark:text-white mt-0.5">Format Classification</h3>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink/5 text-ink dark:text-white">
                <FileText className="h-4.5 w-4.5" />
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[11px] font-medium text-ink/50 dark:text-slate-400 uppercase tracking-wider">Classification Pattern</p>
                <div className="mt-1 font-mono text-base font-bold text-ink dark:text-white flex items-center gap-2">
                  {result.format.name}
                  {result.format.secure === true && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" /> Secure
                    </span>
                  )}
                  {result.format.secure === false && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 border border-red-200">
                      <AlertTriangle className="h-3 w-3" /> Insecure
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-ink/50 dark:text-slate-400 uppercase tracking-wider">Evaluation & Notes</p>
                <p className="mt-1 text-sm text-ink/75 dark:text-slate-300 leading-relaxed">{result.format.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-ink/5 pt-4">
                <div>
                  <p className="text-[10px] font-medium text-ink/50 dark:text-slate-400 uppercase tracking-wider">Character Length</p>
                  <p className="text-xl font-mono font-bold text-ink dark:text-white mt-0.5">{result.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-ink/50 dark:text-slate-400 uppercase tracking-wider">Size in Bytes</p>
                  <p className="text-xl font-mono font-bold text-ink dark:text-white mt-0.5">{result.bytes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Randomness Indicator Card */}
          <div className="rounded-3xl border border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/25">
            <div className="flex items-center justify-between border-b border-ink/5 pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/40 dark:text-slate-500">Entropy Metric</p>
                <h3 className="font-display text-lg font-bold text-ink dark:text-white mt-0.5">Randomness Indicator</h3>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink/5 text-ink dark:text-white">
                <Activity className="h-4.5 w-4.5" />
              </span>
            </div>

            <div className="mt-4 space-y-5">
              <div>
                <div className="flex justify-between items-baseline">
                  <p className="text-[11px] font-medium text-ink/50 dark:text-slate-400 uppercase tracking-wider">Shannon Entropy</p>
                  <div className="font-mono font-bold text-2xl text-ink dark:text-white">
                    {result.entropy} <span className="text-sm font-medium text-ink/40 dark:text-slate-500">/ 8.0</span>
                  </div>
                </div>
                
                {/* Radial Gauge visualization */}
                <div className="mt-3 h-32 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="100%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ name: 'Entropy', value: result.entropy, fill: result.entropy >= 5.0 ? "oklch(0.72 0.16 155)" : result.entropy >= 3.0 ? "oklch(0.78 0.14 75)" : "oklch(0.65 0.2 25)" }]} startAngle={180} endAngle={0}>
                      <PolarAngleAxis type="number" domain={[0, 8]} angleAxisId={0} tick={false} axisLine={false} />
                      <RadialBar background={{ fill: isDark ? 'oklch(0.82 0.01 240 / 0.12)' : 'oklch(0.18 0.01 240 / 0.05)' }} clockWise dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-mono text-ink/40 dark:text-slate-500 px-6">
                    <span>0 (Min)</span>
                    <span>8 (Max)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-ink/50 dark:text-slate-400 uppercase tracking-wider">Evaluation Verdict</p>
                <div className={`mt-2 border rounded-2xl px-3.5 py-2.5 text-xs font-semibold ${getEntropyLabel(result.entropy).color}`}>
                  {getEntropyLabel(result.entropy).text}
                </div>
              </div>

              <p className="text-xs text-ink/50 dark:text-slate-400 leading-normal border-t border-ink/5 pt-4">
                Shannon entropy measures the predictability of a byte sequence. Standard plaintext passwords yield low scores (1.5 - 3.5), whereas cryptographically robust hashes approach theoretical randomness limits (5.0+).
              </p>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
