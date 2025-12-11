import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    basicSsl() 
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