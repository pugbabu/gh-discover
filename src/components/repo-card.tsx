import Link from "next/link";
import type { Repo } from "@/lib/types";
import { ACCENT, formatAge, formatStars } from "@/lib/ui";
import { RepoTags } from "./repo-tags";
import { SaveButton } from "./save-button";

export function RepoCard({ repo }: { repo: Repo }) {
  const accent = ACCENT[repo.accent];
  const ghUrl = `https://github.com/${repo.owner}/${repo.name}`;
  const detailUrl = `/repo/${repo.owner}/${repo.name}`;

  return (
    <section className="snap-card flex items-center justify-center px-8">
      <div
        className="w-full max-w-6xl min-h-[84vh] grid grid-cols-[1.05fr_1.35fr] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/60 backdrop-blur"
        style={{ boxShadow: `0 0 120px -20px ${accent.glow}` }}
      >
        {/* 左：身份 + 势能 */}
        <div className={`relative p-14 flex flex-col justify-between bg-gradient-to-br ${accent.grad}`}>
          <RepoTags repo={repo} />

          <div className="my-8">
            <div className="text-sm text-zinc-500 mb-1">{repo.owner} /</div>
            <Link href={detailUrl} className="text-5xl font-bold tracking-tight leading-tight hover:underline">
              {repo.name}
            </Link>
            <div className="mt-6 flex items-end gap-8">
              <div>
                <div className="text-4xl font-bold">{formatStars(repo.stars)}</div>
                <div className="text-xs text-zinc-500 mt-0.5">总 star</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400">+{repo.starsToday.toLocaleString()}</div>
                <div className="text-xs text-zinc-500 mt-0.5">今日新增</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>惊喜分排名</span>
            <span className="text-indigo-300 font-semibold text-sm">#{repo.surpriseRank}</span>
            <span className="ml-auto">建仓 {formatAge(repo.ageDays)}</span>
          </div>
        </div>

        {/* 右：AI 讲解 + 操作 */}
        <div className="p-14 flex flex-col">
          <div className="space-y-8 flex-1 flex flex-col justify-center">
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 tracking-widest mb-2">是啥</div>
              <p className="text-[17px] leading-relaxed text-zinc-200">{repo.whatItIs}</p>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-amber-400 tracking-widest mb-2">凭啥火</div>
              <p className="text-[17px] leading-relaxed text-zinc-200">{repo.whyHot}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <SaveButton repo={repo} variant="solid" className="flex-1" />
            <a
              href={ghUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              ↗ 去 GitHub
            </a>
          </div>
          <div className="mt-4 text-center text-xs text-zinc-600">↑ ↓ 或滚轮切换 · 空格下一个</div>
        </div>
      </div>
    </section>
  );
}
