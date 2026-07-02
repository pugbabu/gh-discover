import { classifyAndExplain } from "./ai/classify";
import { fetchReadme } from "./github/readme";
import { fetchRepoMeta } from "./github/repo-meta";
import { fetchTrending, type Since, type TrendingRepo } from "./github/trending";
import { surpriseScore } from "./score";
import type { Accent, Repo } from "./types";

const ACCENTS: Accent[] = ["indigo", "emerald", "pink", "sky", "amber"];
const CONCURRENCY = 5; // 并发上限，压住总耗时又不至于把 DeepSeek/GitHub 打爆

// 带并发上限的并行 map（Vercel 函数有时限，串行会超时）
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

type Scored = (Repo & { _score: number }) | null;

async function process(t: TrendingRepo): Promise<Scored> {
  try {
    const [readme, meta] = await Promise.all([fetchReadme(t.owner, t.name), fetchRepoMeta(t.owner, t.name)]);
    const verdict = await classifyAndExplain({
      owner: t.owner,
      name: t.name,
      description: t.description,
      language: t.language,
      readme,
    });
    if (!verdict || !verdict.isAiApp) return null; // 非 AI 应用直接丢弃

    const ageDays = meta?.ageDays ?? 999;
    return {
      owner: t.owner,
      name: t.name,
      language: t.language ?? "其他",
      category: verdict.category,
      novelty: verdict.novelty,
      accent: "indigo", // 排序后按名次重排
      stars: t.stars,
      starsToday: t.starsSince,
      surpriseRank: 0,
      ageDays,
      whatItIs: verdict.whatItIs,
      whyHot: verdict.whyHot,
      whatItIsLong: verdict.whatItIsLong,
      whyHotLong: verdict.whyHotLong,
      license: meta?.license ?? undefined,
      updatedAt: meta?.updatedAt ?? undefined,
      topics: meta?.topics,
      _score: surpriseScore({ starsSince: t.starsSince, ageDays, novelty: verdict.novelty }),
    };
  } catch (e) {
    // 单个项目失败（网络 / DeepSeek 抖动）只跳过，不拖垮整天刷新
    console.warn(`跳过 ${t.owner}/${t.name}: ${(e as Error).message}`);
    return null;
  }
}

// 每日管线：抓 trending → 判类+讲解（DeepSeek）→ 取年龄等元信息 → 惊喜分排序。
// 输出的 Repo[] 由 cron 存进 KV，getFeed 直接读。
export async function buildDailyFeed(opts: { since?: Since; limit?: number } = {}): Promise<Repo[]> {
  const trending = await fetchTrending({ since: opts.since ?? "daily" });
  const candidates = opts.limit ? trending.slice(0, opts.limit) : trending;

  const results = await mapPool(candidates, CONCURRENCY, process);
  const scored = results.filter((r): r is Repo & { _score: number } => r !== null);

  scored.sort((a, b) => b._score - a._score);

  return scored.map(({ _score, ...repo }, i) => ({
    ...repo,
    surpriseRank: i + 1,
    accent: ACCENTS[i % ACCENTS.length],
  }));
}
