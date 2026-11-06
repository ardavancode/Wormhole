# @wormhole/cursed-song

The supplied track is served as `public/cursed-song.mp3`. There is no
music picker, no play or entry button and no direct back-to-site button.

The three riddles appear as soon as the page loads. The game attempts to play
the looped MP3 immediately. Modern browsers may block audible autoplay until
a user gesture; the first pointer or keyboard interaction retries playback
automatically, with no dedicated opt-in control.

A real, working STOP AUDIO control remains available to avoid trapping visitors
in unwanted audio, and the final solved-riddle exit still returns to the
homepage. The browser's own back and close controls cannot be hijacked.
A stopped track stays stopped until the visitor restarts the game.

## Trusted-gesture entry from homepage

The teaser's ordinary click activates the site MP3 **synchronously**, then uses
history.pushState and a same-document React route switch. The game gets a
persistent Audio instance. This keeps audible playback unlocked by that click
without adding an entry/play button or selecting a track.

Direct visits to the standalone bilingual HTML pages still attempt autoplay,
and retry on the first genuine pointer/keyboard interaction when blocked by
the browser. Programmatic clicks do not grant activation and cannot guarantee
sound on direct entry. All in-game music stops when the game unmounts.
