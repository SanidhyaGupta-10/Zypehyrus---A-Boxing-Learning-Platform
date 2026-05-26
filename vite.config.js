import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs, { copyFileSync } from 'fs';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html')).reduce((acc, f) => {
  acc[f.replace('.html', '')] = resolve(__dirname, f);
  return acc;
}, {});

const staticRootScripts = [
  'techniques-data.js',
  'guru-media.js',
  'planner-plan-builder.js',
  'planner-gemini.js',
  'protocol-session-utils.js',
  'vision-gemini-init.js',
];

export default defineConfig({
  publicDir: 'public',
  plugins: [
    {
      name: 'copy-guru-static-scripts',
      closeBundle() {
        staticRootScripts.forEach((file) => {
          copyFileSync(resolve(__dirname, file), resolve(__dirname, 'dist', file));
        });
      }
    }
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000'
    }
  },
  build: {
    rollupOptions: {
      input: htmlFiles
    }
  }
});
