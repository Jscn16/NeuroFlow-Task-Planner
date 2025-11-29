import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
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
            // Core React and utilities
            'react-vendor': ['react', 'react-dom', 'framer-motion'],

            // UI components and icons
            'ui-vendor': ['lucide-react'],

            // Charts and data visualization
            'charts-vendor': ['recharts'],

            // Feature chunks for lazy-loaded components
            'features-board': [
              './src/components/features/board/WeekView',
              './src/components/features/board/GridCell'
            ],
            'features-dashboard': [
              './src/components/features/dashboard/FocusMode',
              './src/components/features/dashboard/AnalyticsDashboard',
              './src/components/features/dashboard/EisenhowerMatrix'
            ],
            'features-tools': [
              './src/components/features/tools/HabitTracker',
              './src/components/features/tools/BrainDump',
              './src/components/features/tools/PomodoroTimer'
            ],

            // Layout components (always loaded)
            'layout-core': [
              './src/components/layout/MainLayout',
              './src/components/layout/Header',
              './src/components/layout/Sidebar',
              './src/components/layout/SettingsModal'
            ],

            // Utilities and constants
            'utils-core': [
              './src/utils/animations',
              './src/constants',
              './src/types'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 600 // Slightly increase to accommodate our chunks
    }
  };
});
