import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5180,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'index.html'),
        guide: resolve(projectRoot, 'guide/index.html'),
        halalTokyo: resolve(projectRoot, 'guide/restaurants-halal-tokyo.html'),
        shibuyaMoney: resolve(projectRoot, 'guide/change-yens-shibuya.html'),
      },
    },
  },
})
