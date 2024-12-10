import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    build: {
      outDir: './dist',
      emptyOutDir: true,
      sourcemap: true,
    },
  }
})
