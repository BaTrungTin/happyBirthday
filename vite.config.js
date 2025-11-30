import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Su dung relative path de tranh loi 404 khi deploy
  build: {
    assetsDir: 'assets',
  },
})
