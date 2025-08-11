import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
   optimizeDeps: {
    exclude: ['three'], // 防止 Three.js 被预构建
  },
  plugins: [vue()],
})
