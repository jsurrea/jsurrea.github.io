const GITHUB_USER = 'jsurrea';

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface GitHubProfile {
  public_repos: number;
  followers: number;
  avatar_url: string;
}

function getHeaders(): HeadersInit {
  return process.env['GITHUB_TOKEN']
    ? { Authorization: `token ${process.env['GITHUB_TOKEN']}` }
    : {};
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const repos = (await res.json()) as GitHubRepo[];
  return repos.filter((r) => !r.name.includes(GITHUB_USER));
}

export async function fetchGitHubProfile(): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<GitHubProfile>;
}
