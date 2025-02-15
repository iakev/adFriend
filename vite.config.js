import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: 'manifest.json', dest: '' }], // Copy manifest.json to dist/
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.js"],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    transformMode: {
      web: [/\.[jt]sx$/]
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    cors: true,
  },
});