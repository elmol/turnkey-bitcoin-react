import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.browser': 'true',
    'process.version': '"v16.0.0"',
    'process.versions': '{}',
    'process.platform': '"browser"',
  },
  resolve: {
    alias: {
      process: path.resolve(__dirname, 'node_modules/process/browser'),
      buffer: path.resolve(__dirname, 'node_modules/buffer'),
      util: path.resolve(__dirname, 'node_modules/util'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
      vm: path.resolve(__dirname, 'node_modules/vm-browserify'),
      os: path.resolve(__dirname, 'node_modules/os-browserify/browser'),
      events: path.resolve(__dirname, 'node_modules/events'),
    },
  },
  optimizeDeps: {
    include: [
      'process', 
      'buffer', 
      'util', 
      'stream-browserify', 
      'crypto-browserify',
      'events',
      'vm-browserify',
      'os-browserify'
    ],
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
