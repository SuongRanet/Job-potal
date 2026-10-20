import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// The API sets httpOnly SameSite=Strict cookies and its CORS is not credentialed,
// so the dev server proxies /api to keep the admin and API on one origin.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    proxy: {
      "/api": process.env.VITE_API_PROXY ?? "http://localhost:3000",
    },
  },
});
