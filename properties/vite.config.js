import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000, // Your dev server port
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
