# @wormhole/rickroll-launcher 🎬

Independent TypeScript/React workspace for the floating **شروع** button.

- A tap/click plays the supplied **Rick Roll Link.mp4** video in a fullscreen overlay with sound.
- Video ends → the overlay closes; users can also press **بستن** or Escape.
- Plays inline on mobile to avoid switching to the browser's native fullscreen player.
- If autoplay is blocked, a secondary **پخش ویدیو** button appears.
- Original media stays in `media/rickroll.mp4`; a copy at `public/rickroll.mp4` is served by the site's own CDN for faster startup.

```tsx
import { RickrollLauncher } from '@wormhole/rickroll-launcher'
import '@wormhole/rickroll-launcher/style.css'

<RickrollLauncher />
```

Package is not published to npm. No manual build, test, or debug was performed.
