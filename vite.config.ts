import { resolve } from 'path'
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
      // Could also be a dictionary or array of multiple entry points
      // entry: resolve(__dirname, 'src/analytics.ts'),
      entry: {
        "analytics": resolve(__dirname, 'src/analytics.ts'),
      },
      name: "analytics",
      formats: ["es", "umd"],
      // the proper extensions will be added
      fileName (format, name) {
        return `${name}.${format}.js`;
      },
    },
    emptyOutDir: false,
  },
})
