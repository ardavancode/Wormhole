# AGENTS.md — Wormhole Rules 🌀

These instructions apply to the entire repository, including all nested workspaces and packages.

## 1. Chaos is the homepage aesthetic
- The main page must **not** use a tidy, orderly, predictable arrangement of experiments.
- Favor intentionally irregular placement, mixed sizes, unexpected spacing, overlaps, asymmetry, and playful composition.
- Keep elements usable: preserve responsive behavior, readable text, keyboard navigation, and accessible controls.
- Do not redesign the home page into a conventional grid, list, or uniform card dashboard unless the user specifically asks.

## 2. One new thing = one independent package
- Every new experiment, widget, or feature gets its **own directory** under `packages/<feature-name>/`.
- Use the existing npm workspaces and TypeScript/TSX conventions.
- Each package should own its `package.json`, implementation, styling where needed, and public entry point; export an explicit API.
- The main app consumes packages via workspace imports rather than embedding feature implementation in `src/App.tsx`.
- Prefer small, isolated changes. Do not restructure unrelated packages.

## 3. No testing or debugging by default
- **Do not run tests, lint, typecheck, manual builds, smoke tests, log analysis, or debugging** unless the user explicitly requests investigation or becomes focused on fixing that specific program.
- Do not proactively add test suites or test infrastructure.
- Automatic builds/deployments configured outside the agent (e.g. Cloudflare Pages on push) can continue; do not initiate extra verification just for reassurance.
- Never claim something was tested or verified when it was not. If an issue is clearly visible without testing, mention it briefly without starting an investigation.

## 4. Minimize token and tool usage
- Keep responses compact and action-oriented. Skip lengthy planning, repeated explanations, and decorative output.
- Read only the relevant files and avoid large repository scans or unnecessary web searches.
- Batch related edits when practical; avoid redundant tool calls and repeated status checks.
- No speculative extra features, dependency additions, refactors, tests, or investigations.
- Report only what changed, where it changed, and any essential caveat.

## Existing baseline
- TypeScript + React + Vite, using npm workspaces.
- Site source: `src/`; experiments: `packages/`.
- Deployments are connected to Cloudflare Pages from `main`.
- These preferences are defaults unless the user specifically changes them.

> Build weird things, keep them modular, and spend tokens like they're scarce. 😈
