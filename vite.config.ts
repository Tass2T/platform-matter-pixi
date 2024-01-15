import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    root: "./",
    publicDir: "./src/assets/",
    base: "./",
    server: { host: true },
    build: {
      outDir: "./dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
