# @wormhole/language-toggle

A keyboard-accessible Farsi/English switcher. The app owns state, persists it in localStorage, and updates the page's `lang` and `dir` attributes. Default language is Farsi.

## Indexable language URLs

The Persian homepage is `/` and the English homepage is `/en/` on Cloudflare.
On GitHub Pages they are `/Wormhole/` and `/Wormhole/en/`.
The switcher navigates rather than swapping content at a single URL, so search engines
can discover both pages. The URL (not localStorage) determines the language.
