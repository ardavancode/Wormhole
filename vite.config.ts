import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Keep Cloudflare at / while serving GitHub Pages from /Wormhole/.
  base: mode === 'github-pages' ? '/Wormhole/' : '/',
  build: {
    rollupOptions: {
      // Separate, crawlable URLs for Persian and English.
      input: {
        fa: fileURLToPath(new URL('./index.html', import.meta.url)),
        en: fileURLToPath(new URL('./en/index.html', import.meta.url)),
      },
    },
  },
}))
