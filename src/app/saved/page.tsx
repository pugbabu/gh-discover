"use client";

import Link from "next/link";
import { RepoTags } from "@/components/repo-tags";
import { SaveButton } from "@/components/save-button";
import { useSaved } from "@/lib/use-saved";
import { formatStars } from "@/lib/ui";

export default function SavedPage() {
  const { saved, clear } = useSaved();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
              ← 返回发现
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-sm font-bold">gh-discover</span>
          </div>
          <span className="text-xs text-zinc-500">收藏存在本地浏览器，不上传</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            我的收藏 <span className="text-zinc-500 text-xl font-normal">· {saved.length}</span>
          </h1>
          {saved.length > 0 && (
            <button onClick={clear} className="text-sm text-zinc-500 hover:text-zinc-300 transition">
              清空
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 py-20 text-center text-zinc-500">
            还没有收藏 · 回到{" "}
            <Link href="/" className="text-indigo-400 hover:underline">
              发现
            </Link>{" "}
            刷到喜欢的一键收藏
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {saved.map((repo) => (
              <article
                key={`${repo.owner}/${repo.name}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 hover:border-zinc-700 transition flex flex-col"
              >
                <div className="mb-4">
                  <RepoTags repo={repo} showNovelty={false} />
                </div>
                <div className="text-xs text-zinc-500">{repo.owner} /</div>
                <Link
                  href={`/repo/${repo.owner}/${repo.name}`}
                  className="text-xl font-bold tracking-tight hover:underline"
                >
                  {repo.name}
                </Link>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="text-zinc-300">★ {formatStars(repo.stars)}</span>
                  <span className="text-emerald-400">+{repo.starsToday.toLocaleString()}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mt-4 flex-1">{repo.whatItIs}</p>
                <div className="flex items-center gap-2 mt-5">
                  <a
                    href={`https://github.com/${repo.owner}/${repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm flex items-center justify-center"
                  >
                    ↗ GitHub
                  </a>
                  <SaveButton repo={repo} variant="icon" />
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
