import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [vue()],
  base: './',

  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version)
  },

  build: {
    outDir: 'www',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})
