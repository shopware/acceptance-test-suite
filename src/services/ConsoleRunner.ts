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

function getCandidateStartDirs(): string[] {
  const envRoot = process.env.SHOPWARE_PROJECT_ROOT || process.env.SHOPWARE_ROOT || process.env.PROJECT_ROOT;
  if (envRoot) return [envRoot];

  const candidates: string[] = [];
  const gh = process.env.GITHUB_WORKSPACE;
  if (gh) {
    // Try nested 'shopware' first (common when repo root holds multiple projects)
    candidates.push(path.resolve(gh, 'shopware'));
    // Then the workspace itself (if checkout already inside shopware)
    candidates.push(path.resolve(gh));
  }

  candidates.push(process.cwd());
  return Array.from(new Set(candidates));
}

function resolveRoot(): string {
  const candidates = getCandidateStartDirs();
  for (const start of candidates) {
    const root = findRoot(start);
    if (root) return root;
  }
  throw new Error(
    `Unable to resolve Shopware root. Tried: ${candidates.join(', ')}. ` +
    `Set SHOPWARE_PROJECT_ROOT explicitly.`
  );
}

export const PROJECT_ROOT = resolveRoot();
const DEFAULT_PHP = process.env.SHOPWARE_PHP || 'php';
const DEFAULT_TIMEOUT = Number(process.env.SHOPWARE_CONSOLE_TIMEOUT_MS || 60000);

export interface CommandResult {
  success: boolean;
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  argv: string[];
}

/**
 * Allow‑listed console commands permitted in tests.
 * Extend if more commands are needed.
 */
const ALLOWED_COMMANDS = new Set<string>([
  'scheduled-task:run-single',
  'cache:clear',
  'cache:warmup',
  'database:migrate',
  'dal:refresh:index',
  'theme:compile',
]);

type CommandOptions = {
  safe?: boolean;
  env?: Record<string, string>;
  timeoutMs?: number;
  phpBinary?: string;
};

/**
 * Run a Shopware bin/console command.
 * Example:
 *   runCommand('cache:clear');
 *   runCommand('scheduled-task:run-single', 'b2b_components_budget_management_task');
 *   runCommand('scheduled-task:run-single', 'b2b_components_budget_management_task', { safe: true });
 */
export function runCommand(
  command: string,
  ...rest: Array<string | CommandOptions>
): CommandResult {
  if (!command) throw new Error('runCommand: missing command.');
  if (!ALLOWED_COMMANDS.has(command)) {
    throw new Error(`runCommand: command "${command}" not in allow list.`);
  }

  // Extract options object if present
  let options: CommandOptions = {};
  if (rest.length && typeof rest[rest.length - 1] === 'object') {
    const maybeOpts = rest[rest.length - 1] as CommandOptions;
    if (
      Object.prototype.hasOwnProperty.call(maybeOpts, 'safe') ||
      Object.prototype.hasOwnProperty.call(maybeOpts, 'env') ||
      Object.prototype.hasOwnProperty.call(maybeOpts, 'timeoutMs') ||
      Object.prototype.hasOwnProperty.call(maybeOpts, 'phpBinary')
    ) {
      options = maybeOpts;
      rest = rest.slice(0, -1);
    }
  }

  const args = rest.filter(r => typeof r === 'string') as string[];
  const {
    safe = false,
    env = {},
    timeoutMs = DEFAULT_TIMEOUT,
    phpBinary = DEFAULT_PHP,
  } = options;

  const fullArgs = ['bin/console', command, ...args];

  const res = spawnSync(phpBinary, fullArgs, {
    cwd: PROJECT_ROOT,
    timeout: timeoutMs,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...env },
  });

  const timedOut = !!res.error && (res.error as { code?: string }).code === 'ETIMEDOUT';

  const result: CommandResult = {
    success: res.status === 0 && !timedOut,
    code: res.status,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    timedOut,
    argv: [phpBinary, ...fullArgs],
  };

  if (!safe && (!result.success || timedOut)) {
    throw new Error(
      `Console failed: ${result.argv.join(' ')}\n` +
      (timedOut ? 'Timed out\n' : '') +
      (result.stderr || '') +
      (result.stdout ? `\nstdout:\n${result.stdout}` : ''),
    );
  }

  return result;
}