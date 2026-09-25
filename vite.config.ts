import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Lean production config — Epstein Public-Record Investigation Desk SPA. */
export default defineConfig({
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
});
