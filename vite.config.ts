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
      entry: resolve(__dirname, 'src/99dev.ts'),
      name: '99dev',
      // the proper extensions will be added
      fileName: '99dev',
    },
  },
})
