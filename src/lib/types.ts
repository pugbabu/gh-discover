export type Novelty = "high" | "mid" | "low";

export type Accent = "indigo" | "emerald" | "pink" | "sky" | "amber";

export interface Repo {
  owner: string;
  name: string;
  language: string;
  category: string; // 子方向，如 "AI 剪辑"
  novelty: Novelty; // 新颖度
  accent: Accent; // 卡片氛围色
  stars: number;
  starsToday: number;
  surpriseRank: number; // 惊喜分排名
  ageDays: number; // 建仓天数
  whatItIs: string; // 是啥（卡片用，一句话）
  whyHot: string; // 凭啥火（卡片用，一句话）
  // 详情页用的更长版本 + 元信息，缺省时回退到短版本
  whatItIsLong?: string;
  whyHotLong?: string;
  howToRun?: string;
  license?: string;
  updatedAt?: string;
  topics?: string[];
}

export function repoSlug(repo: Pick<Repo, "owner" | "name">): string {
  return `${repo.owner}/${repo.name}`;
}
