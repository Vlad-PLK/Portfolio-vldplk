import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Production optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Enable source maps for debugging (set to false for production if not needed)
    sourcemap: false,
    
    // Minification
    minify: 'esbuild',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for better code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunk
          vendor: ['react', 'react-dom'],
        },
        // Asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Entry file names
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Target modern browsers
    target: 'es2015',
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  
  // Preview configuration
  preview: {
    port: 3000,
    host: true,
    strictPort: true,
  },
})
