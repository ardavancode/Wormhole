# @wormhole/hiring-form

Full-bleed **WE ARE HIRING** footer + parody application dialog. Two role selections both use the exact same uploaded clip as a preview; the dialog also includes candidate name, email, and résumé selection.

## One required media step

Copy the uploaded `1000104059.mp4` to `public/hiring-video.mp4` in the repository. This chat's GitHub connector currently supports text and Git object blobs by content but cannot access the binary upload directly. Until that file is committed, the dialog shows a fallback and allows picking the clip locally for the current browser session.

This is **a local demo form**, not a working application endpoint. The résumé and contact information **are not submitted or saved**. Don't imply a submission succeeds without adding a secure backend and a privacy policy.

```tsx
import { HiringForm } from '@wormhole/hiring-form'
import '@wormhole/hiring-form/style.css'

<HiringForm />
```

## Faster preview playback

The dialog stays mounted (but inert and invisible while closed), allowing browser video preloading before the footer button is pressed. Both clips remain paused until a wage option is selected. Selecting an option immediately plays that option's video, attempting sound during the radio click and falling back to mute if browser policy blocks audio. Changing the option pauses and rewinds the previous preview. No native video controls are shown.

**Important:** `public/hiring-video.mp4` still needs to be added to the repository for hosted playback to work. The local file picker remains available when the media URL is missing.
