import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ASLDuolingo/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
