import "./_bootstrap";
import { buildDailyFeed } from "../src/lib/pipeline";
import { surpriseScore } from "../src/lib/score";

async function main() {
  const feed = await buildDailyFeed({ since: "daily", limit: 10 });
  console.log(`\n=== 惊喜分排序后的 AI 应用 feed（${feed.length} 个）===\n`);
  for (const r of feed) {
    const score = surpriseScore({ starsSince: r.starsToday, ageDays: r.ageDays, novelty: r.novelty });
    console.log(`#${r.surpriseRank}  ${r.owner}/${r.name}  [${r.category} · 新颖度${r.novelty}]`);
    console.log(`    +${r.starsToday} star / 建仓 ${r.ageDays} 天  → 惊喜分 ${score.toFixed(1)}`);
    console.log(`    ${r.whatItIs}\n`);
  }
}

main();
