# @wormhole/dark-sun-motion

A responsive, bilingual, cinematic React motion-graphics experiment built around
the user's supplied "Censored Dark Sun Monarch.png" image.

Features: subtle parallax, orbiting lines, animated ink, sparks, scanline, an
"awaken" overdrive button, and pause/reduced-motion support. All decorative
layers have aria-hidden, and the portrait has descriptive alt text.

**Asset:** the user's image is committed as an automatically uploaded, bandwidth-optimized
WebP preview at `public/dark-sun-monarch.webp`. A higher-resolution replacement can
be committed later without modifying the component. The package takes `imageSrc`
as a prop, so no remote dependency is required. An informative visual fallback is displayed if the image cannot load.

The homepage embeds this experiment ABOVE Adolfo, while visitors still initially
land at Adolfo in the middle of the scrollable site. A separate bilingual page
exists at /experiments/dark-sun/ and /en/experiments/dark-sun/.
