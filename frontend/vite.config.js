import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'VODhub',
        short_name: 'VODhub',
        description:
          'App for searching,watching and saving VODs and clips from Twitch',
        theme_color: '#000000',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
