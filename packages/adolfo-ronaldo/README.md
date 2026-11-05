# @wormhole/adolfo-ronaldo

A full-screen lo-fi meme reel made from six user-supplied pictures and the accompanying 10.71-second song. The source media is assembled into one synchronized MP4 with slow crossfades.

The component is independent, with its own TypeScript entry point, CSS, build settings and media directory. The app uses:

```tsx
import { AdolfoRonaldo } from '@wormhole/adolfo-ronaldo'
import '@wormhole/adolfo-ronaldo/style.css'

<AdolfoRonaldo />
```

## Media file

Put the supplied `adolfo-ronaldo.mp4` into `packages/adolfo-ronaldo/media/adolfo-ronaldo.mp4`.

This package reads the clip from GitHub raw content so the audio and image transitions stay in sync without any additional dependencies. The fallback file chooser permits local preview before the media file is hosted.

Browsers generally block automatic **unmuted** playback. Visitors tap **PLAY WITH SOUND** to start the music and animation. The clip loops at its natural duration.

No automated testing or debugging is run unless explicitly requested.
