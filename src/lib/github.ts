const GITHUB_USER = 'jsurrea';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubRepoEnriched extends GitHubRepo {
  socialPreviewUrl: string;
  pagesUrl: string;
}

export interface GitHubProfile {
  public_repos: number;
  followers: number;
  avatar_url: string;
}

export interface GitHubOrg {
  login: string;
  description: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}

function getHeaders(): HeadersInit {
  return process.env['GITHUB_TOKEN']
    ? { Authorization: `token ${process.env['GITHUB_TOKEN']}` }
    : {};
}

export function getSocialPreviewUrl(owner: string, repo: string): string {
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
}

export function getGitHubPagesUrl(owner: string, repo: string): string {
  return `https://${owner.toLowerCase()}.github.io/${repo}/`;
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

export async function fetchGitHubReposEnriched(): Promise<GitHubRepoEnriched[]> {
  const repos = await fetchGitHubRepos();
  return repos.map((r) => ({
    ...r,
    socialPreviewUrl: getSocialPreviewUrl(GITHUB_USER, r.name),
    pagesUrl: getGitHubPagesUrl(GITHUB_USER, r.name),
  }));
}

export async function fetchGitHubProfile(): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<GitHubProfile>;
}

export async function fetchGitHubOrg(orgLogin: string): Promise<GitHubOrg> {
  const res = await fetch(`https://api.github.com/orgs/${orgLogin}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<GitHubOrg>;
}
