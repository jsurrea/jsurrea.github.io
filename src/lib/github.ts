import { GITHUB_USER } from '../config';

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

export function getGitHubPagesUrl(owner: string, repo: string): string {
  return `https://${owner.toLowerCase()}.github.io/${repo}/`;
}

/**
 * Fetches the actual social-preview image URLs for a user's repositories
 * using the GitHub GraphQL API (`openGraphImageUrl` field).
 *
 * Unlike the opengraph.githubassets.com endpoint (which always generates a
 * generic image), `openGraphImageUrl` returns the *custom* social-preview
 * image when one has been set on the repository settings page.
 *
 * Requires a GITHUB_TOKEN with at least `metadata:read` permission.
 * Returns an empty object when no token is available so callers can fall
 * back gracefully.
 */
export async function fetchSocialPreviewUrls(
  owner: string
): Promise<Record<string, string>> {
  const token = process.env['GITHUB_TOKEN'];
  if (!token) return {};

  const query = `
    query GetSocialPreviews($owner: String!) {
      user(login: $owner) {
        repositories(first: 100) {
          nodes {
            name
            openGraphImageUrl
          }
        }
      }
    }
  `;

  let res: Response;
  try {
    res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { owner } }),
    });
  } catch {
    return {};
  }

  if (!res.ok) return {};

  interface GraphQLResponse {
    data?: {
      user?: {
        repositories?: {
          nodes?: { name: string; openGraphImageUrl: string }[];
        };
      };
    };
  }

  const json = (await res.json()) as GraphQLResponse;
  const nodes = json?.data?.user?.repositories?.nodes ?? [];
  return Object.fromEntries(nodes.map((n) => [n.name, n.openGraphImageUrl]));
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
  const [repos, previewUrls] = await Promise.all([
    fetchGitHubRepos(),
    fetchSocialPreviewUrls(GITHUB_USER),
  ]);
  return repos.map((r) => ({
    ...r,
    socialPreviewUrl:
      previewUrls[r.name] ??
      `https://opengraph.githubassets.com/1/${GITHUB_USER}/${r.name}`,
    pagesUrl: getGitHubPagesUrl(r.owner.login, r.name),
  }));
}

export async function fetchGitHubOrg(orgLogin: string): Promise<GitHubOrg> {
  const res = await fetch(`https://api.github.com/orgs/${orgLogin}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<GitHubOrg>;
}
