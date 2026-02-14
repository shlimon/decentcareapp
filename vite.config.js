import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  // Check if Sentry should be enabled
  const isSentryEnabled = env.VITE_ENABLE_SENTRY === 'true';

  // Base plugins
  const plugins = [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'DC App',
        short_name: 'DCApp',
        description: 'Decent Care App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
      },
    }),
  ];

  // Conditionally add Sentry plugin
  if (isSentryEnabled && env.VITE_SENTRY_AUTH_TOKEN) {
    plugins.push(
      sentryVitePlugin({
        org: 'navigatus-au',
        project: 'kmlog-prod',
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
      })
    );
  } else {
    console.log('✗ Sentry plugin disabled');
  }

  return {
    plugins,

    resolve: {
      alias: {
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@widgets': path.resolve(__dirname, 'src/widgets'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@context': path.resolve(__dirname, 'src/context'),
        '@routes': path.resolve(__dirname, 'src/routes'),
        '@auth': path.resolve(__dirname, 'src/auth'),
      },
      extensions: ['.js', '.jsx'],
    },

    build: {
      sourcemap: isSentryEnabled, // Only generate sourcemaps when Sentry is enabled
    },
  };
});