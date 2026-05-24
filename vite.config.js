import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html')).reduce((acc, f) => {
  acc[f.replace('.html', '')] = resolve(__dirname, f);
  return acc;
}, {});

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app']
  },
  build: {
    rollupOptions: {
      input: htmlFiles
    }
  }
});
