import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: resolve(__dirname, 'dist/umd'),
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'VisualElement',
      fileName: `index`,
      formats: [ 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
        assetFileNames:(assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'visual-element.css';
          }
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        }
      },
    },
  },
})
