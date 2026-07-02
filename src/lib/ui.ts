import type { Accent, Novelty } from "./types";

// 完整类名写死，Tailwind 才不会把动态色 purge 掉
export const ACCENT: Record<Accent, { grad: string; glow: string }> = {
  indigo: { grad: "from-indigo-600/20 via-zinc-900 to-zinc-950", glow: "rgba(99,102,241,.35)" },
  emerald: { grad: "from-emerald-600/20 via-zinc-900 to-zinc-950", glow: "rgba(16,185,129,.30)" },
  pink: { grad: "from-pink-600/20 via-zinc-900 to-zinc-950", glow: "rgba(244,114,182,.30)" },
  sky: { grad: "from-sky-600/20 via-zinc-900 to-zinc-950", glow: "rgba(56,189,248,.30)" },
  amber: { grad: "from-amber-600/20 via-zinc-900 to-zinc-950", glow: "rgba(245,158,11,.28)" },
};

export const NOVELTY_LABEL: Record<Novelty, string> = {
  high: "高",
  mid: "中",
  low: "低",
};

// GitHub 语言配色（常见的几种，其余回退灰）
const LANG_COLOR: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#B07219",
  "C++": "#F34B7D",
  Swift: "#F05138",
};

export function langColor(language: string): string {
  return LANG_COLOR[language] ?? "#8b8b8b";
}

export function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function formatAge(days: number): string {
  if (days < 30) return `${days} 天`;
  if (days < 365) return `${Math.round(days / 30)} 个月`;
  return `${(days / 365).toFixed(1)} 年`;
}
