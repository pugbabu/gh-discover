import type { Novelty } from "./types";

// 惊喜分：新增star × 1/年龄 × 新颖度
// 领域热度惩罚项已去掉（只做 AI 领域，圈内人人都热），改用新颖度。
const NOVELTY_WEIGHT: Record<Novelty, number> = {
  high: 1,
  mid: 0.5,
  low: 0.2,
};

export function surpriseScore(input: { starsSince: number; ageDays: number; novelty: Novelty }): number {
  return (input.starsSince * NOVELTY_WEIGHT[input.novelty]) / Math.max(input.ageDays, 1);
}
