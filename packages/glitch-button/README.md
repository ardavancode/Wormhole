# @wormhole/glitch-button

A self-contained React + TypeScript package for the Wormhole playground.

Click the glitch button to make it teleport randomly around the viewport, then fall into a full-screen glitching void. **Double click or double tap** the void to return; `Escape` works as a keyboard exit. The overlay uses a portal to `document.body` so the experience covers the whole screen.

## Usage

```tsx
import { GlitchButton } from '@wormhole/glitch-button'
import '@wormhole/glitch-button/style.css'

<GlitchButton label="ENTER THE VOID" />
```

The component accepts normal HTML button props and an optional `label`. An `onClick` handler still runs before the glitch sequence (calling `event.preventDefault()` cancels entry).

## Build

```bash
npm install
npm run build -w @wormhole/glitch-button
```

Library output: ESM, CSS, and TypeScript declarations. React and React DOM are peer dependencies. Motion preferences are respected.
