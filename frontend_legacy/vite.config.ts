import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legacyDir = path.resolve(__dirname, 'legacy');

const LEGACY_FILE_EXTENSIONS = new Set([
    '.html',
    '.css',
    '.js',
    '.mjs',
    '.json',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.webp',
    '.woff2',
    '.woff',
    '.ttf',
]);

const MIME: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
};

/** Copy all legacy HTML/JS/CSS files into the Vite build output. */
function copyLegacyFiles(outDir: string) {
    if (!fs.existsSync(legacyDir)) return;

    for (const name of fs.readdirSync(legacyDir)) {
        const src = path.join(legacyDir, name);
        if (!fs.statSync(src).isFile()) continue;

        const ext = path.extname(name).toLowerCase();
        if (!LEGACY_FILE_EXTENSIONS.has(ext)) continue;

        fs.copyFileSync(src, path.join(outDir, name));
    }
}

/** Serve legacy HTML/JS/CSS from frontend/legacy/ during `npm run dev`. */
function legacyAppPlugin(): Plugin {
    return {
        name: 'legacy-app',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const pathname = decodeURIComponent((req.url ?? '').split('?')[0]);

                if (
                    pathname === '/' ||
                    pathname.startsWith('/@') ||
                    pathname.startsWith('/src/') ||
                    pathname.startsWith('/node_modules/')
                ) {
                    return next();
                }

                if (/\.(html|css|js|mjs|json|ico|png|jpg|jpeg|svg|webp|woff2?)$/i.test(pathname)) {
                    const filePath = path.join(legacyDir, pathname.replace(/^\//, ''));
                    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        const ext = path.extname(filePath).toLowerCase();
                        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
                        fs.createReadStream(filePath).pipe(res);
                        return;
                    }
                }

                next();
            });
        },
        closeBundle() {
            copyLegacyFiles(path.resolve(__dirname, 'dist'));
        },
    };
}

export default defineConfig({
    plugins: [react(), legacyAppPlugin()],
    build: {
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html'),
        },
    },
    server: {
        port: 3000,
    },
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
