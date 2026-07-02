import feedData from "@/data/feed.json";
import { MOCK_REPOS } from "./mock-data";
import type { Repo } from "./types";

// 数据源：每日 pipeline 产出、提交进 git 的榜单（已按惊喜分排好序）。
// 为空则回退 mock（首次部署或数据异常时不至于白屏）。
const FEED = feedData as Repo[];

export async function getFeed(): Promise<Repo[]> {
  return FEED.length > 0 ? FEED : [...MOCK_REPOS].sort((a, b) => a.surpriseRank - b.surpriseRank);
}

export async function getRepo(owner: string, name: string): Promise<Repo | null> {
  const feed = FEED.length > 0 ? FEED : MOCK_REPOS;
  return (
    feed.find(
      (r) => r.owner.toLowerCase() === owner.toLowerCase() && r.name.toLowerCase() === name.toLowerCase(),
    ) ?? null
  );
}
