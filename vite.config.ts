import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      'react-helmet': 'react-helmet-async'
    }
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: 'imagens', dest: '.' }],
    }),
  ],
  publicDir: 'public',
  build: {
    minify: false,
    cssMinify: false,
  },
})