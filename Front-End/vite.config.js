import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Use Render's assigned port
    host: "0.0.0.0" // Allow external access
  },
  define: {
    global: "window", // Fix SockJS issue
  },
});
