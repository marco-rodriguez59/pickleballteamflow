import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
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
