import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

/**
 * Lean production config for Epstein Public-Record Investigation Desk.
 * Avoids full App Builder / TanStack Start / Nitro stack so Vercel can ship
 * a static + client SPA without missing scaffold files.
 */
export default defineConfig({
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2022",
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
});
