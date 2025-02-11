import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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