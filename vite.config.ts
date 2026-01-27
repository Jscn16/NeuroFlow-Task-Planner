import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const pwaManifest = {
  name: 'WeekFlux',
  short_name: 'WeekFlux',
  theme_color: '#09090b',
  background_color: '#09090b',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ]
};

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      watch: {
        ignored: ['**/backup-standalone/**'],
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      // Keep plugin registered so virtual:pwa-register resolves in dev; dev SW stays disabled.
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: false },
        includeAssets: ['favicon.png'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        manifest: pwaManifest as any,
        workbox: {
          // Ensure any navigation (including deep links) falls back to index.html
          navigateFallback: 'index.html',
          navigateFallbackAllowlist: [/^\/.*$/],
          // Silence "No route found" noise for source files by letting them pass through
          runtimeCaching: [
            {
              urlPattern: /^\/src\/.*$/,
              handler: 'NetworkOnly'
            }
          ]
        }
      })
    ],
    optimizeDeps: {
      include: ['react-window', 'react-virtualized-auto-sizer'],
    },
    define: {
      // Removed unused GEMINI_API_KEY for security hardening
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-is'],
            'vendor-recharts': ['recharts'],
            'vendor-lucide': ['lucide-react'],
            'vendor-framer': ['framer-motion'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-utils': ['react-window', 'react-virtualized-auto-sizer']
          }
        }
      }
    }
  };
});
