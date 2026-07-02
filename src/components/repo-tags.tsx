import type { Repo } from "@/lib/types";
import { langColor, NOVELTY_LABEL } from "@/lib/ui";

export function RepoTags({ repo, showNovelty = true }: { repo: Repo; showNovelty?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: langColor(repo.language) }} />
        {repo.language}
      </span>
      <span className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300">#{repo.category}</span>
      {showNovelty && (
        <span className="text-[11px] px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25">
          🔥 新颖度 {NOVELTY_LABEL[repo.novelty]}
        </span>
      )}
    </div>
  );
}
