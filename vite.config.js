import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Exact match for your repository name
  base: '/RadiologyAnalyticsReact/', 
  build: {
    chunkSizeWarningLimit: 1600,
  }
})