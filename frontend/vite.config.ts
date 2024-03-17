import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin()],
    build: {
        manifest: true,
        chunkSizeWarningLimit: 1600,
        emptyOutDir: true,
        assetsDir: "src/assets",
        rollupOptions: {
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]",
            },
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            clientPort: 5173,
        },
    },
    resolve: {
        alias: {
            src: "/src",
        },
    },
});
