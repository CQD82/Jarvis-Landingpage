# JARVIS Landingpage

Public landing page for the private JARVIS homelab AI cluster. React 19, TypeScript, Vite, Tailwind CSS v4, deployed as a Cloudflare Worker with static assets (`wrangler.toml`).

The page describes the cluster at the level of principles only. Scripts, configurations, internal addresses and step-by-step instructions are deliberately not published.

## Development

```bash
npm ci
npm run dev
```

`npm run lint` runs oxlint, `npm run build` type-checks and builds to `dist/`.

## Security

- **Strict HTTP security headers** in `public/_headers` (served by Cloudflare with every response): a Content-Security-Policy that allows only same-origin scripts, styles, fonts and images, plus HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener/Resource-Policy`.
- **No third-party requests.** Fonts are self-hosted; there are no analytics, trackers or external CDNs.
- **Least-privilege CI.** `.github/workflows/ci.yml` runs with `contents: read` only, checks out without persisted credentials, installs from the lockfile with install scripts disabled, then lints, builds and fails on any dependency advisory rated high or above.
- **Pinned actions.** Third-party GitHub Actions are pinned to full commit SHAs; Dependabot (`.github/dependabot.yml`) proposes updates for npm packages and action pins as pull requests.
- The site collects no data. The only browser storage is the language preference.

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Branch protection

The default branch is protected by the ruleset in `.github/rulesets/protect-main.json`, imported under **Settings → Rules → Rulesets → New ruleset → Import a ruleset** (active since 2026-11-05). The file is the source of truth: change it by pull request, then re-import it.

| Rule | Effect |
| --- | --- |
| Pull request required | No direct pushes to the default branch. Review threads must be resolved before merging. |
| Required status check `build` | CI (lint, build, dependency audit) must pass on a branch that is up to date with the default branch. |
| Block force pushes | History on the default branch cannot be rewritten. |
| Block deletion | The default branch cannot be deleted. |

Required approvals are set to 0 because the repository has a single maintainer, and GitHub does not let authors approve their own pull requests. Raise `required_approving_review_count` to 1 once a second maintainer has write access.
