import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
        registerType: 'autoUpdate',
        manifest: false, // usa il manifest.json che c'è in public/
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
        },
        devOptions: {
          enabled: true,
        },
      }),
  ],
  resolve: {
    alias: {
      // Configurazione di Vite: '@' punta alla cartella 'src'
      '@': resolve(__dirname, './src'), 
      // A seconda di come hai impostato 'paths' in tsconfig, potresti avere anche:
      // "@components": resolve(__dirname, "./src/components"),
    }
  }
});