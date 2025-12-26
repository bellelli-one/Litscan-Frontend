// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
// import { VitePWA } from 'vite-plugin-pwa' // <--- ЗАКОММЕНТИРУЙТЕ ИЛИ УДАЛИТЕ ЭТО

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    mkcert(),
    // VitePWA(...) // <--- ЗАКОММЕНТИРУЙТЕ ВЕСЬ БЛОК PWA
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.74.1:8090',
        changeOrigin: true, 
      },
      '/img': {
        target: 'http://192.168.74.1:9000',
        changeOrigin: true,
        secure: false,
        rewrite: (path: string)  => path.replace(/^\/img/, ''),
      }
    },
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
  }
})