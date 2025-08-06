import { resolve } from 'node:path'
import { defineConfig } from 'vite'
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
      entry: resolve(__dirname, 'src/analytics-script.ts'),
      name: "analytics",
      formats: ["iife"],
      fileName: () => 'analytics.js'
    },
    rollupOptions: {
      output: {
        extend: true,
        globals: {}
      }
    },
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true
  },
})
