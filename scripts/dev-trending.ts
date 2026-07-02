import { fetchTrending } from "../src/lib/github/trending";

async function main() {
  const repos = await fetchTrending({ since: "daily" });
  console.log(`抓到 ${repos.length} 个项目\n`);
  for (const r of repos.slice(0, 8)) {
    console.log(`${r.owner}/${r.name}`);
    console.log(`  lang=${r.language}  stars=${r.stars}  +since=${r.starsSince}`);
    console.log(`  desc=${r.description?.slice(0, 60) ?? "(无)"}\n`);
  }
}

main();
