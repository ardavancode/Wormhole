import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Keep Cloudflare at / while serving GitHub Pages from /Wormhole/.
  base: mode === 'github-pages' ? '/Wormhole/' : '/',
  build: {
    rollupOptions: {
      // Separate, crawlable URLs for Persian and English.
      input: {
        fa: 'index.html',
        en: 'en/index.html',
      },
    },
  },
}))
