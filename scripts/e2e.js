/**
 * Menjalankan pengujian End-to-End dengan satu perintah: `npm run e2e`.
 *
 * 1. Menyalakan dev server Vite melalui API-nya di port 5173.
 * 2. Menjalankan `cypress run` (headless) sebagai child process.
 * 3. Mematikan server dan keluar dengan exit code hasil pengujian Cypress.
 *
 * Server hidup di dalam proses ini, sehingga dapat dimatikan dengan bersih di
 * Windows, macOS, maupun Linux/GitHub Actions tanpa utilitas OS tambahan.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'vite';

const PORT = 5173;

const runCypress = () => new Promise((resolve) => {
  const child = spawn(`npx cypress run --config baseUrl=http://localhost:${PORT}`, {
    stdio: 'inherit',
    shell: true,
  });
  child.on('close', (code) => resolve(code ?? 1));
  child.on('error', () => resolve(1));
});

const server = await createServer({
  server: { port: PORT, strictPort: true },
  logLevel: 'warn',
});

let exitCode = 1;
try {
  await server.listen();
  exitCode = await runCypress();
} finally {
  await server.close();
}

process.exitCode = exitCode;
