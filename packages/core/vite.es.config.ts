import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import dts from 'vite-plugin-dts'
// Get all component directories
function getDirectoriesSync(basePath: string): string[] {
  const entries = readdirSync(basePath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export default defineConfig({
  optimizeDeps: {
    exclude: ['three'], // 防止 Three.js 被预构建
  },
  plugins: [vue(), dts({
    tsconfigPath: resolve(__dirname, '../../tsconfig.build.json'),
    outDir: resolve(__dirname, 'dist/types'),
  })],
  build: {
    outDir: resolve(__dirname, 'dist/es'),
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'VisualElement',
      fileName: `index`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@popperjs/core',
        'async-validator',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'visual-element.css';
          }
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('packages/hooks')) {
            return 'hooks';
          }
          if (id.includes('packages/utils')) {
            return 'utils';
          }

          for (const compName of getDirectoriesSync(resolve(__dirname, '../components'))) {
            if (id.includes(`packages/components/${compName}`)) {
              return compName;
            }
          }
        }
      },
    },
  },
})
