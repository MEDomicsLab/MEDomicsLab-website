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
