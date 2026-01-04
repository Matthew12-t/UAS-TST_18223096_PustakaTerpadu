import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/loan': {
        target: 'http://18223096.tesatepadang.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/loan/, ''),
      },
      '/api/books': {
        target: 'http://18223014.tesatepadang.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/books/, '/api/books'),
      },
    },
  },
})
