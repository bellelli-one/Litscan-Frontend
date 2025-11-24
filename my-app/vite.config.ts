// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig(({ command }) => {

  const base = command === 'build' ? '/Litscan-Frontend/' : '/'; 
  return {
    base: base,
    plugins: [
      react(),
      mkcert(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: "Litscan system",
          short_name: "Litscan",
          description: "Сервис для расчета вероятности авторства текста методом стилометрии.",
          start_url: ".",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#007bff",
          icons: [
            { src: 'logo/logo192.png', type: 'image/png', sizes: '192x192' },
            { src: 'logo/logo512.png', type: 'image/png', sizes: '512x512', purpose: 'any maskable' }
          ]
        }
      })
    ],
    server: {
      //https: true,
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8090',
          changeOrigin: true, 
        },
        '/img': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path: string)  => path.replace(/^\/img/, ''),
        }
      },
    }

  }
})