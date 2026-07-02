// 用 GitHub API 的 readme 端点，能拿到默认分支的 README 原文（不用猜 main/master）。
// 未认证 60 次/小时，配 GITHUB_TOKEN 提到 5000。
export async function fetchReadme(owner: string, name: string, maxChars = 4000): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw+json",
    "User-Agent": "gh-discover",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return null;

  const text = await res.text();
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}
