import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Change this to whatever port you want
  },
  define: {
    global: 'window', // ✅ This fixes "global is not defined"
  },
})
