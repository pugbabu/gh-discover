import { promises as fs } from "node:fs";
import path from "node:path";
import type { Repo } from "./types";

// pipeline 产出写到 src/data/feed.json（提交进 git）。
// 每日 GitHub Actions 跑 pipeline → 写这个文件 → commit → Vercel 重部署 → 站点读它。
const FILE_PATH = path.join(process.cwd(), "src", "data", "feed.json");

export async function writeFeed(repos: Repo[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(repos, null, 2) + "\n", "utf8");
}
