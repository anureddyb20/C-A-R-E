import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/token': 'http://127.0.0.1:8000',
      '/patients': 'http://127.0.0.1:8000',
      '/me': 'http://127.0.0.1:8000',
      '/api-status': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
      },
    },
  },
})
