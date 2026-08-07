import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const imagensDir = path.resolve(process.cwd(), 'imagens')
const imagensExists = fs.existsSync(imagensDir)

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
    ...(imagensExists
      ? [
          viteStaticCopy({
            targets: [{ src: 'imagens', dest: '.' }],
          }),
        ]
      : []),
  ],
  publicDir: 'public',
  build: {
    minify: false,
    cssMinify: false,
  },
})