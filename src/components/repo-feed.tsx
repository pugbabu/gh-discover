"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Repo } from "@/lib/types";
import { useSaved } from "@/lib/use-saved";
import { RepoCard } from "./repo-card";

export function RepoFeed({ repos }: { repos: Repo[] }) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { saved } = useSaved();

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;

    const scrollTo = (i: number) => {
      const next = Math.max(0, Math.min(repos.length - 1, i));
      el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
    };

    const onScroll = () => setActive(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      const i = Math.round(el.scrollTop / el.clientHeight);
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        scrollTo(i + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollTo(i - 1);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [repos.length]);

  return (
    <>
      {/* 顶栏 */}
      <div className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-8 py-5 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-lg font-bold tracking-tight">gh-discover</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            AI 应用发现器
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-zinc-400 pointer-events-auto">
          <Link href="/saved" className="hover:text-white transition">
            ♥ 收藏 ({saved.length})
          </Link>
        </div>
      </div>

      {/* 卡流 */}
      <div className="feed" ref={feedRef}>
        {repos.map((repo) => (
          <RepoCard key={`${repo.owner}/${repo.name}`} repo={repo} />
        ))}
      </div>

      {/* 进度点 */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {repos.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-6 rounded-full transition-colors ${i === active ? "bg-white" : "bg-zinc-700"}`}
          />
        ))}
      </div>
    </>
  );
}
