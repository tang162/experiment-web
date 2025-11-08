import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5867,
    proxy: {
      "/api": {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // mock代理目标地址
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
});
