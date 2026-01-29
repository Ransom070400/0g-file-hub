import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "0g-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/indexer-standard": {
        target: "https://indexer-storage-testnet-standard.0g.ai",
        changeOrigin: true,
        secure: true,
        ws: false,
        rewrite: (path) => path.replace(/^\/indexer-standard/, "/"),
      },
      "/indexer-turbo": {
        target: "https://indexer-storage-testnet-turbo.0g.ai",
        changeOrigin: true,
        secure: true,
        ws: false,
        rewrite: (path) => path.replace(/^\/indexer-turbo/, "/"),
      },
    },
  },
  plugins: [
    react(),
    // mode === "development" && componentTagger(),
    nodePolyfills({
      include: ["crypto", "buffer", "stream", "util", "events"],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
