import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

function findRoot(start: string): string | null {
  let dir = start;
  const { root } = path.parse(dir);
  while (dir && dir !== root) {
    if (fs.existsSync(path.join(dir, 'bin', 'console'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function resolveRoot(): string {
  const start =
    process.env.SHOPWARE_PROJECT_ROOT ||
    process.env.SHOPWARE_ROOT ||
    process.env.PROJECT_ROOT ||
    (process.env.GITHUB_WORKSPACE ? path.join(process.env.GITHUB_WORKSPACE, 'shopware') : process.cwd());

  const root = findRoot(start);
  if (!root) {
    throw new Error(`Unable to resolve Shopware root from: ${start}. Set SHOPWARE_PROJECT_ROOT.`);
  }
  return root;
}

export const PROJECT_ROOT = resolveRoot();
const PHP = process.env.SHOPWARE_PHP || 'php';
const DEFAULT_TIMEOUT = Number(process.env.SHOPWARE_CONSOLE_TIMEOUT_MS || 60000);

export interface ConsoleResult {
  success: boolean;
  status: number | null;
  stdout: string;
  stderr: string;
  args: string[];
  timedOut: boolean;
}

export function runConsole(...args: string[]): string {
  if (!args.length) throw new Error('runConsole: missing command.');
  const full = [path.join('bin', 'console'), ...args];
  const res = spawnSync(PHP, full, {
    cwd: PROJECT_ROOT,
    timeout: DEFAULT_TIMEOUT,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const timedOut = !!res.error && (res.error as any).code === 'ETIMEDOUT';
  if (res.status !== 0 || timedOut) {
    throw new Error(
      `Console failed: ${PHP} ${full.join(' ')}\n` +
      (timedOut ? 'Timed out\n' : '') +
      (res.stderr || '') +
      (res.stdout ? `\nstdout:\n${res.stdout}` : '')
    );
  }
  return res.stdout || '';
}