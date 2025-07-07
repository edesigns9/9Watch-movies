import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite Configuration
 *
 * This configuration file controls how Vite builds and serves the frontend application.
 * It's designed to work with the project structure where frontend code is in the 'frontend' directory
 * and configuration files are at the root level.
 */
export default defineConfig({
  // Use React plugin for JSX support
  plugins: [react()],

  // Set the root directory to 'frontend'
  root: "frontend",

  // Serve static assets from the 'public' directory
  publicDir: "../public",

  // Development server configuration
  server: {
    port: 5173,
    open: true,
    // Add CORS headers for API requests during development
    cors: true,
  },

  // Path aliases for imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "frontend"),
    },
  },

  // CSS processing configuration
  css: {
    postcss: "./postcss.config.js",
  },

  // Build configuration
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // Improve production builds
    minify: "terser",
    sourcemap: false,
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
