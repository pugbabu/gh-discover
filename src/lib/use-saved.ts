"use client";

import { useCallback, useEffect, useState } from "react";
import type { Repo } from "./types";
import { repoSlug } from "./types";

const KEY = "gh-discover:saved";

// 收藏存 localStorage，不上传。存整个 Repo 对象，收藏页无需再取数据。
function read(): Repo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Repo[]) : [];
  } catch {
    return [];
  }
}

export function useSaved() {
  const [saved, setSaved] = useState<Repo[]>([]);

  useEffect(() => {
    setSaved(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSaved(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Repo[]) => {
    setSaved(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const isSaved = useCallback(
    (repo: Pick<Repo, "owner" | "name">) => saved.some((r) => repoSlug(r) === repoSlug(repo)),
    [saved],
  );

  const toggle = useCallback(
    (repo: Repo) => {
      const slug = repoSlug(repo);
      persist(saved.some((r) => repoSlug(r) === slug) ? saved.filter((r) => repoSlug(r) !== slug) : [...saved, repo]);
    },
    [saved, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { saved, isSaved, toggle, clear };
}
