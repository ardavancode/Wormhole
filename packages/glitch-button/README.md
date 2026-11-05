# @wormhole/glitch-button

An accessible, type-safe React glitch button. This is an **independent npm workspace package**, with its own manifest, source, CSS, library bundle and TypeScript declaration build.

## From the monorepo root

```bash
npm install
npm run build -w @wormhole/glitch-button
```

The compiled ESM entry and stylesheet are produced in this package's `dist/` folder. This package is prepared for separate publication later but has **not** been published to npm.

## Usage

```tsx
import { GlitchButton } from '@wormhole/glitch-button'
import '@wormhole/glitch-button/style.css'

<GlitchButton
  label="ENTER THE VOID"
  onClick={() => console.log('clicked')}
/>
```

### Props

Extends native HTML button attributes (except `children`). The optional `label` defaults to `ENTER THE VOID`. `onClick`, `disabled`, `aria-*`, `className` and `type` are supported.

The hover/focus glitch animation respects `prefers-reduced-motion`. CSS selectors are prefixed with `wh-glitch-button` to avoid collisions.
