import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5200,
    fs: {
      strict: false,
      allow: [".."],
    },
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
