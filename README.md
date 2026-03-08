# jsurrea.github.io

Personal portfolio and CV site for Juan Sebastián Urrea López, built with [Astro](https://astro.build) and Tailwind CSS. Content is fetched at build time from a public YAML resume ([profile.yaml](https://jsurrea.github.io/CV/profile.yaml)) and enriched with live GitHub data.

## 🚀 Getting started

```sh
# Install dependencies
pnpm install

# Start local dev server at http://localhost:4321
pnpm dev

# Build for production (output in ./dist/)
pnpm build

# Preview the production build locally
pnpm preview
```

## 🧪 Quality checks

```sh
pnpm typecheck        # TypeScript type checking
pnpm test             # Run unit tests (Vitest)
pnpm test:coverage    # Run tests with 100 % coverage report
```

## 🔑 GitHub token (optional but recommended)

A fine-grained Personal Access Token (PAT) with **read-only** access enables:
- Higher GitHub API rate limits (unauthenticated calls are limited to 60/hour)
- Correct **custom social-preview images** for repositories via the GraphQL API (without a token only the auto-generated opengraph image is used)

### Creating the token

1. Go to **GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens**.
2. Click **Generate new token**.
3. Set **Resource owner** to your GitHub user or organisation.
4. Set **Repository access** to _All repositories_ (or select specific ones).
5. Under **Repository permissions** grant:
   - **Contents** → *Read-only*
   - **Metadata** → *Read-only* (auto-selected)
6. Under **Account permissions** add nothing extra (org data is public).
7. Click **Generate token** and copy the value.

### Adding the token to GitHub Actions

Go to **Repository → Settings → Secrets and variables → Actions** and create a new secret named `GITHUB_TOKEN` with the token value. The deploy workflow already reads this secret:

```yaml
- run: pnpm build
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> **Security note:** The token is only accessed by Node.js at _build time_ (inside Astro's server-side frontmatter). It is never written into the generated static files and is therefore never exposed publicly.

## 🗂️ Project structure

```
src/
├── config.ts          # All user-specific settings (GITHUB_USER, org lists, etc.)
├── lib/
│   ├── github.ts      # GitHub REST + GraphQL API helpers
│   └── profile.ts     # TypeScript interfaces for the profile YAML schema
├── layouts/
│   └── Base.astro     # HTML shell with SEO / Open Graph / JSON-LD
├── pages/
│   └── index.astro    # Portfolio page (fetches YAML + GitHub data at build time)
└── styles/
    └── global.css     # CSS custom properties and global resets
tests/
└── unit/
    └── github.test.ts # Unit tests for GitHub API helpers (100 % coverage)
```

## ⚙️ Customisation

All user-specific values live in **`src/config.ts`**:

| Export | Purpose |
|--------|---------|
| `GITHUB_USER` | GitHub username — drives API calls and all derived URLs |
| `PROFILE_URL` | URL of the public YAML resume |
| `CV_URL` | URL of the online CV/resume page |
| `ORG_LOGINS` | GitHub org logins to feature in the Open Source section |
| `HERO_ROLES` | Roles cycled by the hero typewriter animation |
| `ORG_DESCRIPTIONS` | Rich metadata (tagline, description, highlights) for each org |

CV content (name, work experience, education, skills, etc.) is pulled automatically from the YAML at `PROFILE_URL` and requires no changes here.
