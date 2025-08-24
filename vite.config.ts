import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    plugins: [
      react(),
      ...(isProd ? [] : [runtimeErrorOverlay()]),
      // Bundle analyzer for production builds
      ...(isProd ? [visualizer({
        filename: 'bundle-report.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      })] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      sourcemap: false, // Disable sourcemaps in production
      minify: 'esbuild', // Use esbuild for better Vite 7 compatibility
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-ui": ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-aspect-ratio", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-collapsible", "@radix-ui/react-context-menu", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-hover-card", "@radix-ui/react-label", "@radix-ui/react-menubar", "@radix-ui/react-navigation-menu", "@radix-ui/react-popover", "@radix-ui/react-progress", "@radix-ui/react-radio-group", "@radix-ui/react-scroll-area", "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-slider", "@radix-ui/react-slot", "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-toast", "@radix-ui/react-toggle", "@radix-ui/react-toggle-group", "@radix-ui/react-tooltip"],
            "vendor-icons": ["lucide-react", "react-icons"],
            "vendor-utils": ["clsx", "class-variance-authority", "tailwind-merge", "date-fns", "zod"],
            "vendor-zip": ["jszip"],
            "vendor-motion": ["framer-motion"],
          },
        },
      },
      // Enable tree-shaking
      target: 'esnext',
      modulePreload: false, // Disable for better performance
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
