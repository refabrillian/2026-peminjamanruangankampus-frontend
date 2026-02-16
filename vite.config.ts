import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import plugin yang baru kamu instal

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Aktifkan Tailwind di sini
  ],
})