import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGitHubRepos, fetchGitHubProfile } from '../../src/lib/github';

describe('fetchGitHubRepos', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env['GITHUB_TOKEN'];
  });

  it('returns repos filtered to exclude self-named repos', async () => {
    const mockRepos = [
      { name: 'jsurrea.github.io', description: null, html_url: 'https://github.com/jsurrea/jsurrea.github.io', stargazers_count: 0, forks_count: 0, language: null, topics: [], updated_at: '2024-01-01' },
      { name: 'cool-project', description: 'A project', html_url: 'https://github.com/jsurrea/cool-project', stargazers_count: 5, forks_count: 1, language: 'TypeScript', topics: ['web'], updated_at: '2024-01-01' },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    } as Response);
    const result = await fetchGitHubRepos();
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('cool-project');
  });

  it('throws on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
    } as Response);
    await expect(fetchGitHubRepos()).rejects.toThrow('GitHub API error: 403');
  });

  it('uses GITHUB_TOKEN when available', async () => {
    process.env['GITHUB_TOKEN'] = 'test-token';
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);
    await fetchGitHubRepos();
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining('github.com'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'token test-token' }),
      })
    );
  });

  it('uses empty headers when no GITHUB_TOKEN', async () => {
    delete process.env['GITHUB_TOKEN'];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);
    await fetchGitHubRepos();
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining('github.com'),
      expect.objectContaining({ headers: {} })
    );
  });

  it('returns empty array when all repos are self-named', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: 'jsurrea', description: null, html_url: '', stargazers_count: 0, forks_count: 0, language: null, topics: [], updated_at: '2024-01-01' },
      ],
    } as Response);
    const result = await fetchGitHubRepos();
    expect(result).toHaveLength(0);
  });
});

describe('fetchGitHubProfile', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env['GITHUB_TOKEN'];
  });

  it('returns profile data', async () => {
    const mockProfile = { public_repos: 25, followers: 100, avatar_url: 'https://github.com/jsurrea.png' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    } as Response);
    const result = await fetchGitHubProfile();
    expect(result.public_repos).toBe(25);
    expect(result.followers).toBe(100);
  });

  it('throws on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);
    await expect(fetchGitHubProfile()).rejects.toThrow('GitHub API error: 404');
  });

  it('uses GITHUB_TOKEN when available', async () => {
    process.env['GITHUB_TOKEN'] = 'my-token';
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ public_repos: 1, followers: 1, avatar_url: '' }),
    } as Response);
    await fetchGitHubProfile();
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining('jsurrea'),
      expect.objectContaining({ headers: { Authorization: 'token my-token' } })
    );
  });

  it('uses empty headers when no GITHUB_TOKEN', async () => {
    delete process.env['GITHUB_TOKEN'];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ public_repos: 1, followers: 1, avatar_url: '' }),
    } as Response);
    await fetchGitHubProfile();
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: {} })
    );
  });
});
