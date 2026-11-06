# @wormhole/cursed-song

The interactive cursed-song prank intentionally keeps the punchline hidden:
- ENTER starts the song during the same user gesture and reveals the three-lock riddle sequence.
- Prominent EXIT and STOP SONG controls inside the puzzle are playful decoys that make silly excuses rather than identifying themselves as fake.
- The actual audio pause and real site exit are quieter, consistently accessible controls above the game; the browser's own navigation works too.
- The public MP3 is expected at `public/cursed-song.mp3`, with the `audioSrc` prop in `src/cursed-song-page.tsx`.
- Choosing an alternate local audio file is supported behind the settings button. Files are never uploaded.
- No autoplay before a user click, no forced playback, no blocked browser navigation or hidden traps. Audio pauses on leaving and after solving the riddles.
- Persian and English language pages remain distinct and indexable.
