import { classifyAndExplain } from "../src/lib/ai/classify";
import { fetchReadme } from "../src/lib/github/readme";
import { fetchTrending } from "../src/lib/github/trending";

async function main() {
  const trending = await fetchTrending({ since: "daily" });
  const sample = trending.slice(0, 6); // 先测前 6 个，省 token
  console.log(`对 ${sample.length} 个 trending 项目跑判类...\n`);

  for (const r of sample) {
    const readme = await fetchReadme(r.owner, r.name);
    const v = await classifyAndExplain({
      owner: r.owner,
      name: r.name,
      description: r.description,
      language: r.language,
      readme,
    });
    if (!v) {
      console.log(`${r.owner}/${r.name}  → 判类失败\n`);
      continue;
    }
    console.log(`${r.owner}/${r.name}`);
    console.log(`  isAiApp=${v.isAiApp}  子方向=${v.category}  新颖度=${v.novelty}`);
    console.log(`  理由=${v.reason}`);
    if (v.isAiApp) {
      console.log(`  是啥=${v.whatItIs}`);
      console.log(`  凭啥火=${v.whyHot}`);
    }
    console.log();
  }
}

main();
