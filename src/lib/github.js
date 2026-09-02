const GITHUB_API = "https://api.github.com/repos";

const parseRepoPath = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return null;
    const [owner, name] = u.pathname.replace(/^\//, "").split("/");
    if (!owner || !name) return null;
    return `${owner}/${name}`;
  } catch {
    return null;
  }
};

export const fetchRepoStats = async (url) => {
  const path = parseRepoPath(url);
  if (!path) return null;
  const response = await fetch(`${GITHUB_API}/${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return {
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    openIssues: data.open_issues_count ?? 0,
    pushedAt: data.pushed_at ?? null,
  };
};

const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export const formatRelativeTime = (iso) => {
  if (!iso) return null;
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  for (const [unit, secondsPerUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsPerUnit || unit === "minute") {
      return RTF.format(-Math.round(seconds / secondsPerUnit), unit);
    }
  }
  return RTF.format(0, "minute");
};
