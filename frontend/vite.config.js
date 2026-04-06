import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        configure(proxy) {
          proxy.on("proxyRes", (proxyRes) => {
            const raw = proxyRes.headers["set-cookie"];
            if (!raw) return;
            const fixed = (Array.isArray(raw) ? raw : [raw]).map((cookie) =>
              cookie.replace(/;\s*Domain=[^;]+/i, "")
            );
            proxyRes.headers["set-cookie"] = fixed;
          });
        },
      },
    },
  },
});
