import * as cheerio from "cheerio";

export type Since = "daily" | "weekly" | "monthly";

export interface TrendingRepo {
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  stars: number; // 总 star
  starsSince: number; // 本周期新增（trending 页自己算的）
}

const TRENDING_URL = "https://github.com/trending";

// 把 "12,345" / "1.2k" 这类文本解析成整数
function parseIntLoose(text: string): number {
  const m = text.replace(/,/g, "").match(/[\d.]+/);
  if (!m) return 0;
  const n = Number(m[0]);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export async function fetchTrending(opts: { since?: Since; language?: string } = {}): Promise<TrendingRepo[]> {
  const url = new URL(TRENDING_URL + (opts.language ? `/${opts.language}` : ""));
  url.searchParams.set("since", opts.since ?? "daily");

  const res = await fetch(url, {
    headers: {
      // 带个正常 UA，避免被当爬虫拦
      "User-Agent": "Mozilla/5.0 (gh-discover; +https://github.com/trending)",
      "Accept-Language": "en-US,en;q=0.9",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`trending 抓取失败: ${res.status} ${res.statusText}`);

  const html = await res.text();
  const $ = cheerio.load(html);

  const repos: TrendingRepo[] = [];
  $("article.Box-row").each((_, el) => {
    const $el = $(el);

    const href = $el.find("h2 a").attr("href") ?? "";
    const [owner, name] = href.replace(/^\//, "").split("/");
    if (!owner || !name) return;

    const description = $el.find("p").first().text().trim() || null;
    const language = $el.find('[itemprop="programmingLanguage"]').first().text().trim() || null;

    const stars = parseIntLoose($el.find('a[href$="/stargazers"]').first().text());
    const starsSince = parseIntLoose($el.find("span.float-sm-right").first().text());

    repos.push({ owner, name, description, language, stars, starsSince });
  });

  return repos;
}
