export interface RepoMeta {
  ageDays: number;
  license: string | null;
  topics: string[];
  updatedAt: string | null; // 相对时间，如 "2 小时前"
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = diff / 3_600_000;
  if (h < 1) return `${Math.max(1, Math.round(diff / 60_000))} 分钟前`;
  if (h < 24) return `${Math.round(h)} 小时前`;
  const d = h / 24;
  if (d < 30) return `${Math.round(d)} 天前`;
  return `${Math.round(d / 30)} 个月前`;
}

// 一次 API 调用拿到年龄（惊喜分要）+ license/topics/最近更新（详情页要）
export async function fetchRepoMeta(owner: string, name: string): Promise<RepoMeta | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "gh-discover",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers, cache: "no-store" });
  if (!res.ok) return null;

  const d = await res.json();
  const ageDays = Math.max(1, Math.round((Date.now() - new Date(d.created_at).getTime()) / 86_400_000));

  return {
    ageDays,
    license: d.license?.spdx_id ?? null,
    topics: Array.isArray(d.topics) ? d.topics.slice(0, 6) : [],
    updatedAt: d.pushed_at ? relativeTime(d.pushed_at) : null,
  };
}
