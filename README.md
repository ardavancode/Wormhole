# Wormhole 🌀

A React + TypeScript playground for strange experiments, organized as a lightweight **npm workspaces monorepo**. Each experiment lives in its own reusable package.

## Requirements

Node.js 20.19+ or 22.12+, and npm 10+.

## Getting started

```bash
npm install
npm run dev
```

The `predev` script builds local workspace packages before starting Vite. The app then runs at the URL shown by Vite (normally `http://localhost:5173`).

## Structure

```text
src/                             React app (TypeScript)
packages/glitch-button/          Independent @wormhole/glitch-button package
  src/GlitchButton.tsx           Typed React component
  src/GlitchButton.css           Scoped styles and effects
  src/index.ts                   Public package API
  package.json                   Package manifest and build
  tsconfig.build.json            Standalone TypeScript declarations
  vite.config.ts                 Standalone library bundle
```

## Scripts

- `npm run dev` – build workspace packages, then start the development server.
- `npm run build` – build packages, typecheck the app, and bundle the production site.
- `npm run build:packages` – bundle all reusable packages.
- `npm run typecheck` – typecheck the app and build package declarations.
- `npm run preview` – preview the generated site.

### Using the first experiment

```tsx
import { GlitchButton } from '@wormhole/glitch-button'
import '@wormhole/glitch-button/style.css'

<GlitchButton label="ENTER THE VOID" onClick={() => console.log('Hello, void!')} />
```

See [the package README](packages/glitch-button/README.md) for the standalone build and API.

## Deployments

Cloudflare Pages deploys automatically from the `main` branch to [wormhole-lab.pages.dev](https://wormhole-lab.pages.dev). Production build command: `npm run build`, output: `dist`. No extra Cloudflare config is needed for this static app.

## GitHub Pages fallback (free)

The GitHub Actions workflow at `.github/workflows/github-pages.yml` builds a second
copy for `https://ardavancode.github.io/Wormhole/`, using Vite's `github-pages`
mode. Cloudflare Pages continues to use the default `/` base.

Once, in **Settings → Pages → Build and deployment**, set the **Source**
to **GitHub Actions**. On each push to `main`, GitHub Actions builds and
publishes the site without merging or changing the Cloudflare configuration.
Media paths are relative to `<base href="%BASE_URL%">` so they work on both hosts.
This does not guarantee accessibility on every network.
