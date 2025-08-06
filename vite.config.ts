import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { PreRenderedAsset } from 'rollup'
import { readFileSync } from 'node:fs'

// Read package.json to get version
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  server: {
    port: 5200,
    fs: {
      strict: false,
      allow: [".."],
    },
  },
  define: {
    __VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/analytics.ts'),
      name: "analytics",
      formats: ["es", "umd"],
      fileName: (format) => `analytics.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo: PreRenderedAsset) => {
          if (assetInfo.name === 'style.css') return 'analytics.css';
          return assetInfo.name || 'unknown';
        }
      }
    },
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true
  },
})
