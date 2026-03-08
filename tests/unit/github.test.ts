import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchGitHubRepos,
  fetchGitHubReposEnriched,
  fetchGitHubOrg,
  fetchSocialPreviewUrls,
  getGitHubPagesUrl,
} from '../../src/lib/github';

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

describe('getGitHubPagesUrl', () => {
  it('returns the correct GitHub Pages URL', () => {
    expect(getGitHubPagesUrl('jsurrea', 'my-project')).toBe(
      'https://jsurrea.github.io/my-project/'
    );
  });

  it('lowercases the owner', () => {
    expect(getGitHubPagesUrl('JsUrrea', 'repo')).toBe(
      'https://jsurrea.github.io/repo/'
    );
  });
});

describe('fetchSocialPreviewUrls', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env['GITHUB_TOKEN'];
  });

  it('returns empty object when no GITHUB_TOKEN', async () => {
    delete process.env['GITHUB_TOKEN'];
    const result = await fetchSocialPreviewUrls('jsurrea');
    expect(result).toEqual({});
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('returns map of repo name to openGraphImageUrl', async () => {
    process.env['GITHUB_TOKEN'] = 'test-token';
    const mockResponse = {
      data: {
        user: {
          repositories: {
            nodes: [
              { name: 'stellarlib', openGraphImageUrl: 'https://cdn/stellarlib-preview.png' },
              { name: 'cool-project', openGraphImageUrl: 'https://opengraph.githubassets.com/1/jsurrea/cool-project' },
            ],
          },
        },
      },
    };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);
    const result = await fetchSocialPreviewUrls('jsurrea');
    expect(result['stellarlib']).toBe('https://cdn/stellarlib-preview.png');
    expect(result['cool-project']).toContain('opengraph');
  });

  it('uses bearer token in Authorization header', async () => {
    process.env['GITHUB_TOKEN'] = 'my-token';
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { user: { repositories: { nodes: [] } } } }),
    } as Response);
    await fetchSocialPreviewUrls('jsurrea');
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://api.github.com/graphql',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'bearer my-token' }),
      })
    );
  });

  it('returns empty object on non-ok response', async () => {
    process.env['GITHUB_TOKEN'] = 'test-token';
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);
    const result = await fetchSocialPreviewUrls('jsurrea');
    expect(result).toEqual({});
  });

  it('returns empty object on network error', async () => {
    process.env['GITHUB_TOKEN'] = 'test-token';
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchSocialPreviewUrls('jsurrea');
    expect(result).toEqual({});
  });

  it('handles missing nodes gracefully', async () => {
    process.env['GITHUB_TOKEN'] = 'test-token';
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null }),
    } as Response);
    const result = await fetchSocialPreviewUrls('jsurrea');
    expect(result).toEqual({});
  });
});

describe('fetchGitHubReposEnriched', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env['GITHUB_TOKEN'];
  });

  it('uses GraphQL social preview URL when token is available', async () => {
    process.env['GITHUB_TOKEN'] = 'test-token';
    const mockRepos = [
      {
        id: 1,
        name: 'stellarlib',
        full_name: 'jsurrea/stellarlib',
        description: 'A project',
        html_url: 'https://github.com/jsurrea/stellarlib',
        homepage: null,
        stargazers_count: 5,
        forks_count: 1,
        language: 'TypeScript',
        topics: ['web'],
        updated_at: '2024-01-01',
        fork: false,
        owner: { login: 'jsurrea', avatar_url: '' },
      },
    ];
    const mockGraphQL = {
      data: {
        user: {
          repositories: {
            nodes: [
              { name: 'stellarlib', openGraphImageUrl: 'https://cdn/custom-preview.png' },
            ],
          },
        },
      },
    };
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => mockRepos } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => mockGraphQL } as Response);

    const result = await fetchGitHubReposEnriched();
    expect(result).toHaveLength(1);
    expect(result[0]?.socialPreviewUrl).toBe('https://cdn/custom-preview.png');
    expect(result[0]?.pagesUrl).toContain('jsurrea.github.io');
    expect(result[0]?.pagesUrl).toContain('stellarlib');
  });

  it('falls back to opengraph URL when no token', async () => {
    delete process.env['GITHUB_TOKEN'];
    const mockRepos = [
      {
        id: 1,
        name: 'cool-project',
        full_name: 'jsurrea/cool-project',
        description: 'A project',
        html_url: 'https://github.com/jsurrea/cool-project',
        homepage: null,
        stargazers_count: 5,
        forks_count: 1,
        language: 'TypeScript',
        topics: ['web'],
        updated_at: '2024-01-01',
        fork: false,
        owner: { login: 'jsurrea', avatar_url: '' },
      },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => mockRepos } as Response);

    const result = await fetchGitHubReposEnriched();
    expect(result).toHaveLength(1);
    expect(result[0]?.socialPreviewUrl).toContain('opengraph.githubassets.com');
    expect(result[0]?.socialPreviewUrl).toContain('cool-project');
  });
});

describe('fetchGitHubOrg', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env['GITHUB_TOKEN'];
  });

  it('returns org data', async () => {
    const mockOrg = {
      login: 'Open-Source-Uniandes',
      description: 'Student open source org',
      avatar_url: 'https://avatars.githubusercontent.com/u/123',
      html_url: 'https://github.com/Open-Source-Uniandes',
      public_repos: 10,
    };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrg,
    } as Response);
    const result = await fetchGitHubOrg('Open-Source-Uniandes');
    expect(result.login).toBe('Open-Source-Uniandes');
    expect(result.public_repos).toBe(10);
  });

  it('throws on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);
    await expect(fetchGitHubOrg('nonexistent')).rejects.toThrow('GitHub API error: 404');
  });
});
