import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactDevTools from '../src/index'

export default defineConfig({
  plugins: [
    react(),
    reactDevTools({
      port: 8097,
      componentInspector: true,
      launchEditor: 'code',
      enableInProduction: false,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
