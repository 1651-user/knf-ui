import { ChildProcess, spawn, execSync } from 'child_process';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { net } from 'electron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_PORT = 8765;
const isDev = !app.isPackaged;

function getBackendDir(): string {
  if (isDev) {
    return path.resolve(__dirname, '..', '..', 'nicforge-back', 'NCIForge');
  }
  return path.join(process.resourcesPath, 'backend');
}

function getPythonPath(): string {
  const candidates = [
    'python',
    'python3',
    path.join('C:\\ProgramData\\xtb\\xtb-6.7.1\\bin', 'python'),
  ];
  for (const c of candidates) {
    try {
      execSync(`${c} --version`, { stdio: 'ignore' });
      return c;
    } catch { }
  }
  return 'python';
}

let backendProcess: ChildProcess | null = null;

export async function startBackend(): Promise<void> {
  const backendDir = getBackendDir();
  const python = getPythonPath();

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PATH: [
      'C:\\ProgramData\\xtb\\xtb-6.7.1\\bin',
      path.join(app.getPath('exe'), '..', 'resources', 'backend', 'tools', 'xtb', 'bin'),
      'C:\\Users\\Administrator\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python311\\Scripts',
      process.env.PATH || '',
    ].join(';'),
  };

  backendProcess = spawn(python, ['-m', 'uvicorn', 'server:app', '--host', '127.0.0.1', '--port', String(BACKEND_PORT)], {
    cwd: backendDir,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  backendProcess.stdout?.on('data', (d: Buffer) => {
    const line = d.toString().trim();
    if (line) console.log(`[backend] ${line}`);
  });

  backendProcess.stderr?.on('data', (d: Buffer) => {
    const line = d.toString().trim();
    if (line) {
      console.error(`[backend] ${line}`);
      if (line.includes('Error') || line.includes('error')) {
        console.error('[backend] ERROR DETECTED');
      }
    }
  });

  backendProcess.on('exit', (code) => {
    console.log(`[backend] exited with code ${code}`);
    backendProcess = null;
  });

  await waitForBackend();
}

async function waitForBackend(): Promise<void> {
  const maxRetries = 30;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${BACKEND_PORT}/api/health`);
      if (res.ok) {
        console.log('[backend] ready');
        return;
      }
    } catch { }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Backend failed to start');
}

export function stopBackend(): void {
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        backendProcess.kill('SIGKILL');
      }
    }, 5000);
  }
}

export function getBackendUrl(): string {
  return `http://127.0.0.1:${BACKEND_PORT}`;
}
