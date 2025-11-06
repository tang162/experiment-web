import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: "./postcss.config.ts",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
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
