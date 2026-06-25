import { defineConfig } from 'vite';

const engineEntry = new URL('../../packages/merge-engine/src/index.ts', import.meta.url).pathname;
const assetPublicDir = new URL('../../assets', import.meta.url).pathname;

export default defineConfig(({ mode }) => ({
  publicDir: assetPublicDir,
  resolve: {
    alias: {
      '@merge-engine/core': engineEntry,
    },
  },
  server: {
    port: 5173,
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1800,
    outDir: mode === 'wechat' ? 'dist/wechat' : 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: mode === 'wechat' ? 'game.js' : 'assets/[name]-[hash].js',
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    sourcemap: mode !== 'wechat',
  },
}));
