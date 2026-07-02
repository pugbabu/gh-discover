import "./_bootstrap";
import { buildDailyFeed } from "../src/lib/pipeline";
import { writeFeed } from "../src/lib/store";

// 每日刷新入口：本地 `npx tsx --env-file=.env.local scripts/refresh.ts`
// CI（GitHub Actions）直接 `npx tsx scripts/refresh.ts`，env 从 secrets 注入。
async function main() {
  const limit = Number(process.argv[2] ?? process.env.REFRESH_LIMIT) || 25;
  const t0 = Date.now();
  const feed = await buildDailyFeed({ since: "daily", limit });
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  // 全军覆没时不要覆盖已有榜单（保留上一版，别把线上刷成空/mock）
  if (feed.length === 0) {
    console.error(`处理 ${limit} 个候选耗时 ${secs}s，但一个 AI 应用都没得到，放弃写入`);
    process.exit(1);
  }

  await writeFeed(feed);
  console.log(`处理 ${limit} 个候选，耗时 ${secs}s，写入 ${feed.length} 个 AI 应用`);
  for (const r of feed) console.log(`  #${r.surpriseRank} ${r.owner}/${r.name} [${r.category} · ${r.novelty}]`);
}

main();
