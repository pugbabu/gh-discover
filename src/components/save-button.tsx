"use client";

import type { Repo } from "@/lib/types";
import { useSaved } from "@/lib/use-saved";

type Variant = "solid" | "ghost" | "icon";

const BASE: Record<Variant, string> = {
  solid: "h-11 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition flex items-center justify-center gap-2",
  ghost: "h-10 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm flex items-center justify-center gap-2",
  icon: "h-9 w-9 rounded-lg bg-zinc-800 transition text-sm flex items-center justify-center",
};

export function SaveButton({
  repo,
  variant = "solid",
  className = "",
}: {
  repo: Repo;
  variant?: Variant;
  className?: string;
}) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(repo);

  const label = variant === "icon" ? (saved ? "♥" : "♡") : saved ? "♥ 已收藏" : "♡ 收藏";
  const savedTint =
    variant === "icon" && saved ? "text-rose-400" : variant === "icon" ? "hover:bg-rose-500/20 hover:text-rose-400" : "";

  return (
    <button
      type="button"
      onClick={() => toggle(repo)}
      aria-pressed={saved}
      className={`${BASE[variant]} ${savedTint} ${className}`}
    >
      {label}
    </button>
  );
}
