import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The app is deployed beneath the Arabic subpath /الأندلس/ on abdulrahim.page.
// relative base so that assets resolve correctly from the deployed subdirectory.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: "es2020",
    cssTarget: "chrome90",
  },
  server: {
    port: 5188,
    strictPort: true,
  },
  preview: {
    port: 5189,
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
