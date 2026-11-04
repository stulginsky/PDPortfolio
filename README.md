# PDPortfolio

## Project contracts

- Design-system contracts, including case-page composition, are maintained in the sibling repository `E:\GitHub\PDPortfolio-DS\ds`.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## GitHub Pages

Public URL: https://stulginsky.github.io/PDPortfolio/

`.github/workflows/pages.yml` generates the static portfolio and deploys it after a verified release is merged into `main`; it can also be started manually from Actions. Repository Settings → Pages → Source must be **GitHub Actions**. Node.js 24 and `npm ci` are used in CI. The uploaded artifact is `.output/public`; generated build output is not committed.

### Development and release branches

Work in `develop`. Keep Storybook, sandboxes, export evidence, editor configuration and diagnostic scripts there. Do not merge `develop` directly into `main`, or merge the cleaned `main` back into `develop`.

After committing and pushing the intended development version, run **from develop**:

```bash
npm run release:plan
npm run release:prepare
```

The first command previews exclusions. The second fetches current `main` and `develop`, verifies the source is clean and pushed, creates a filtered `release/<12-character-source-sha>` snapshot on top of `main`, pushes it and opens a PR. It leaves the develop checkout and index unchanged. Git HTTPS credentials (or a process-local `GITHUB_TOKEN`) authenticate PR creation; credentials are never written to files or logs. `--local` prepares the branch without pushing or opening a PR.

`release.config.json` is the explicit publication inventory. Production sources, content, public assets and build/check scripts remain in main; unknown root files and development-only paths are excluded. The release package omits development-only npm commands while retaining dependencies and the matching lockfile. No artwork, copy, geometry or tokens are transformed.

The PR's required `release-validation` check verifies this inventory, typography, static generation and local page/resource references. Main requires a PR and this check against the current base, including for administrators. Merge a passing release PR to publish; the next release is another filtered snapshot. Development-only changes that do not alter that snapshot need no release. Git history is retained; this process cleans main's current tree, not past commits.

To change the publication inventory, update and review `release.config.json` in develop, test with `node --test scripts/test-release-policy.mjs`, then prepare a release. New root directories are excluded until explicitly classified.

To reproduce the Pages build in PowerShell:

```powershell
$env:NUXT_APP_BASE_URL = '/PDPortfolio/'
npm run generate
npm run check:static
node scripts/check-static-site.mjs --browser
Remove-Item Env:NUXT_APP_BASE_URL
```

The static check verifies all page routes and local resource references. The optional browser check serves only the configured subpath and checks desktop/mobile pages, browser errors, resource responses, client navigation and history. Use it after changes to URL handling, media or navigation.

### Adding pages and media

- Keep content JSON paths relative to the site root, for example `/cases/chirp-ux/media/image.png`. Keep the existing source → Typograf → generated JSON pipeline.
- At a URL consumption boundary, import `siteUrl` from `app/utils/site-url.ts` and use `:src="siteUrl(image.src)"`, `:href="siteUrl(href)"` or `siteUrl(path)` for browser APIs and render functions. Use `siteSrcset` for `srcset`. External URLs, mailto, tel, hashes, relative paths and already-prefixed URLs are preserved.
- Keep NuxtLink `to` and `navigateTo` destinations as router paths (`/resume`, `/cases/...`); Nuxt adds its base automatically. Do not prefix route identifiers used to select or exclude related cases.
- Imported assets and relative CSS URLs are handled by Vite. Standalone HTML under `public` keeps document-relative resources, so it works under either hosting base.
- New pages in `app/pages` are included by Nuxt's static generation; `check:static` also checks every case page. No hosting prefix belongs in source content or generated JSON.

For a future root-domain deployment, set `NUXT_APP_BASE_URL=/` and rebuild. Both Nuxt and the URL helpers use this one setting; local development and standalone Storybook default to `/`.
