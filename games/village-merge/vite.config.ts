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
    cssCodeSplit: mode !== 'wechat',
    modulePreload: mode === 'wechat' ? { polyfill: false } : true,
    outDir: mode === 'wechat' ? 'dist/wechat' : 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: mode === 'wechat' ? 'game.js' : 'assets/[name]-[hash].js',
        inlineDynamicImports: mode === 'wechat',
        manualChunks: mode === 'wechat' ? undefined : { phaser: ['phaser'] },
      },
    },
    sourcemap: mode !== 'wechat',
  },
}));
