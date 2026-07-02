import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RepoTags } from "@/components/repo-tags";
import { SaveButton } from "@/components/save-button";
import { getFeed, getRepo } from "@/lib/repos";
import { formatAge, formatStars } from "@/lib/ui";

type Params = { owner: string; name: string };

// 榜单里的项目在构建时就已知，逐个静态预生成——SEO 口子：每个详情页是可收录的静态 HTML。
export async function generateStaticParams() {
  const feed = await getFeed();
  return feed.map((r) => ({ owner: r.owner, name: r.name }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { owner, name } = await params;
  const repo = await getRepo(owner, name);
  if (!repo) return { title: "项目未找到 · gh-discover" };
  return {
    title: `${repo.name} · ${repo.owner} — gh-discover`,
    description: repo.whatItIs,
  };
}

export default async function RepoDetailPage({ params }: { params: Promise<Params> }) {
  const { owner, name } = await params;
  const repo = await getRepo(owner, name);
  if (!repo) notFound();

  const ghUrl = `https://github.com/${repo.owner}/${repo.name}`;
  const stats = [
    { v: formatStars(repo.stars), label: "总 star", cls: "" },
    { v: `+${repo.starsToday.toLocaleString()}`, label: "今日新增", cls: "text-emerald-400" },
    { v: `#${repo.surpriseRank}`, label: "惊喜分排名", cls: "text-indigo-300" },
    { v: formatAge(repo.ageDays), label: "建仓时长", cls: "" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
              ← 返回发现
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-sm font-bold">gh-discover</span>
          </div>
          <div className="flex items-center gap-3">
            <SaveButton repo={repo} variant="ghost" />
            <a
              href={ghUrl}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 rounded-lg bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition flex items-center"
            >
              ↗ 去 GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-4">
          <RepoTags repo={repo} />
        </div>
        <div className="text-zinc-500">{repo.owner} /</div>
        <h1 className="text-5xl font-bold tracking-tight mt-1">{repo.name}</h1>

        <div className="mt-8 grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className={`text-3xl font-bold ${s.cls}`}>{s.v}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-[1fr_260px] gap-10">
          <article className="space-y-9">
            <section>
              <h2 className="text-xs font-semibold text-indigo-400 tracking-widest mb-3">是啥</h2>
              <p className="text-[17px] leading-8 text-zinc-200">{repo.whatItIsLong ?? repo.whatItIs}</p>
            </section>
            <section>
              <h2 className="text-xs font-semibold text-amber-400 tracking-widest mb-3">凭啥火</h2>
              <p className="text-[17px] leading-8 text-zinc-200">{repo.whyHotLong ?? repo.whyHot}</p>
            </section>
            {repo.howToRun && (
              <section>
                <h2 className="text-xs font-semibold text-zinc-400 tracking-widest mb-3">怎么跑</h2>
                <pre className="rounded-xl bg-black border border-zinc-800 p-4 text-[13px] text-zinc-300 overflow-x-auto">
                  <code>{repo.howToRun}</code>
                </pre>
              </section>
            )}
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4 text-sm">
              <div>
                <div className="text-xs text-zinc-500 mb-1">主要语言</div>
                <div>{repo.language}</div>
              </div>
              {repo.license && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">开源协议</div>
                  <div>{repo.license}</div>
                </div>
              )}
              {repo.updatedAt && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">最近更新</div>
                  <div>{repo.updatedAt}</div>
                </div>
              )}
              {repo.topics && repo.topics.length > 0 && (
                <div>
                  <div className="text-xs text-zinc-500 mb-2">Topics</div>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.topics.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
              <div className="text-sm text-zinc-300 mb-3">喜欢这个？</div>
              <SaveButton repo={repo} variant="solid" className="w-full mb-2" />
              <a
                href={ghUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm flex items-center justify-center"
              >
                ↗ 去 GitHub
              </a>
            </div>
          </aside>
        </div>

        <p className="mt-14 text-xs text-zinc-600 border-t border-zinc-900 pt-6">
          AI 讲解由 DeepSeek 基于项目 README 生成，仅供参考 · gh-discover 每日更新 GitHub 上正在爆发的 AI 应用
        </p>
      </main>
    </>
  );
}
