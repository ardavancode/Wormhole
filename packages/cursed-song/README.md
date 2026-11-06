# @wormhole/cursed-song

A musical, fictional escape-room experiment. The visitor optionally picks an audio
file from their own device, starts it intentionally, and solves three bilingual
text riddles to unlock the narrative exit.

## Using the user's final audio later

When the supplied audio is available, add a copy to `public/cursed-song.mp3` and
pass `audioSrc={import.meta.env.BASE_URL + 'cursed-song.mp3'}` to `CursedSong`
from `src/cursed-song-page.tsx`. Do **not** attempt to load the nonexistent
asset before the file is supplied.

Local file selections are never uploaded. Playback always has a real,
stationary pause control and an emergency exit; all sound stops when leaving.
No cookies, network uploads, hidden traps, or forced autoplay.

The fake mute button is only a prank. Riddle answers are accepted in Persian
or English regardless of selected language.
