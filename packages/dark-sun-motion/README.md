# @wormhole/dark-sun-motion

A responsive, bilingual, cinematic React motion-graphics experiment built around
the user's supplied "Censored Dark Sun Monarch.png" image.

Features: subtle parallax, orbiting lines, animated ink, sparks, scanline, an
"awaken" overdrive button, and pause/reduced-motion support. All decorative
layers have aria-hidden, and the portrait has descriptive alt text.

**Asset:** the source image is user-provided and must be stored at
`public/dark-sun-monarch.webp` in the root repo. The package takes `imageSrc`
as a prop, so no remote dependency is required. An informative visual fallback
appears if the image hasn't been uploaded yet.

The homepage embeds this experiment ABOVE Adolfo, while visitors still initially
land at Adolfo in the middle of the scrollable site. A separate bilingual page
exists at /experiments/dark-sun/ and /en/experiments/dark-sun/.
