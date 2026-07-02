import { RepoFeed } from "@/components/repo-feed";
import { getFeed } from "@/lib/repos";

export default async function HomePage() {
  const repos = await getFeed();
  return <RepoFeed repos={repos} />;
}
