# @wormhole/cursed-song

The game supports a default audio track named `public/cursed-song.mp3`.
**The MP3 binary is not yet in the GitHub repository.** Upload the user's supplied
song to that exact path to activate the default soundtrack across GitHub Pages,
Cloudflare Pages, and Cloudflare Workers on the next successful deployment.

Until then the experiment continues to work in silent mode or by selecting a
local file in the UI. The client checks the hosted asset with an HTTP HEAD request
and only treats responses with an audio content type as a working default.

The user-provided track is 'Master Baiter (Hyperbaiter Disstrack) - Havexy.mp3';
rename it to `cursed-song.mp3` for upload. Public publication requires the
appropriate rights to distribute the recording.

Local file choices are never uploaded. Playback only starts after user action,
and the real pause and emergency exit controls work at all times.
No forced autoplay, tracking or background audio.
