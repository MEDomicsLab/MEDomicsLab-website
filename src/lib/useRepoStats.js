import { useEffect, useState } from "react";
import { fetchRepoStats } from "./github";

/**
 * Limit GitHub requests with a browser cache.
 * Use fresh cache, live API, stale cache, then the supplied snapshot.
 */
const CACHE_KEY = "medomicslab:repo-stats";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {};
  } catch {
    return {};
  }
};

const writeCache = (url, stats) => {
  try {
    const cache = readCache();
    cache[url] = { stats, at: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable (private mode, quota): the live value still shows.
  }
};

const inFlight = new Map();

const load = (url) => {
  if (!inFlight.has(url)) {
    const cached = readCache()[url];
    const request =
      cached && Date.now() - cached.at < CACHE_TTL_MS
        ? Promise.resolve(cached.stats)
        : fetchRepoStats(url)
            .then((stats) => {
              if (stats) writeCache(url, stats);
              return stats ?? cached?.stats ?? null;
            })
            .catch(() => cached?.stats ?? null);
    inFlight.set(url, request);
  }
  return inFlight.get(url);
};

/**
 * Stats for each repo, as `{ [url]: { stars, forks, … } }`. `fallbacks` maps a
 * repo URL to a snapshot to show until (or instead of) a live value.
 */
export default function useRepoStats(urls, fallbacks = {}) {
  const key = urls.join("|");
  const [stats, setStats] = useState(fallbacks);

  useEffect(() => {
    let cancelled = false;
    const list = key ? key.split("|") : [];
    Promise.all(list.map(async (url) => [url, await load(url)])).then((entries) => {
      if (cancelled) return;
      setStats((previous) => ({
        ...previous,
        ...Object.fromEntries(entries.filter(([, value]) => value)),
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return stats;
}
