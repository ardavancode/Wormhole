import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages serves this repository from a subpath; Cloudflare stays at /.
  base: mode === 'github-pages' ? '/Wormhole/' : '/',
}))
