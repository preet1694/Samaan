import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT) || 3000, // Bind to Render's dynamic port
    host: "0.0.0.0", // Allow external access
  },
  preview: {
    port: parseInt(process.env.PORT) || 3000,
    host: "0.0.0.0", // Allow Render to serve the app
    allowedHosts: ["samaan.onrender.com"], // Allow your domain
  },
  define: {
    global: "window",
  },
});
