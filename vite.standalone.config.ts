import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteSingleFile(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: './', // Important for relative paths in standalone mode
    build: {
        outDir: 'dist-standalone',
        emptyOutDir: true,
        assetsInlineLimit: 100000000, // Try to inline everything
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false, // Put CSS in the JS/HTML
        rollupOptions: {
            output: {
                manualChunks: undefined, // Disable code splitting
            },
        },
    },
});
