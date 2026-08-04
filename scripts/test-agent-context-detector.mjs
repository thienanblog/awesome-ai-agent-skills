import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const detector = path.join(
  repositoryRoot,
  'skills/agents-md-generator/scripts/detect-agent-context.py',
);
const shellFallback = path.join(
  repositoryRoot,
  'skills/agents-md-generator/scripts/detect-agent-context.sh',
);

function findPython() {
  const candidates = process.platform === 'win32'
    ? [['py', ['-3']], ['python', []], ['python3', []]]
    : [['python3', []], ['python', []]];
  for (const [command, prefix] of candidates) {
    const check = spawnSync(command, [...prefix, '--version'], { encoding: 'utf8' });
    if (check.status === 0) return { command, prefix };
  }
  throw new Error('Python 3 is required to test the full detector');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    ...options,
  });
  assert.equal(
    result.status,
    0,
    `${command} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  return result.stdout;
}

const fixture = mkdtempSync(path.join(tmpdir(), 'agent-context-detector-'));
try {
  mkdirSync(path.join(fixture, 'nested/deeper'), { recursive: true });
  mkdirSync(path.join(fixture, 'codex-home'), { recursive: true });
  writeFileSync(
    path.join(fixture, 'package.json'),
    JSON.stringify({
      packageManager: 'npm@11',
      scripts: { next: 'echo not-a-framework' },
      devDependencies: { vitest: 'latest' },
    }),
  );
  writeFileSync(path.join(fixture, 'package-lock.json'), '{}');
  writeFileSync(
    path.join(fixture, 'nested/deeper/composer.json'),
    JSON.stringify({ require: { 'laravel/framework': '^12' } }),
  );
  writeFileSync(path.join(fixture, 'codex-home/AGENTS.override.md'), '');
  writeFileSync(path.join(fixture, 'codex-home/AGENTS.md'), '# Active base\n');
  writeFileSync(path.join(fixture, 'real-makefile'), 'test:\n\t@true\n');
  if (process.platform !== 'win32') {
    symlinkSync(path.join(fixture, 'real-makefile'), path.join(fixture, 'Makefile'));
  }

  const python = findPython();
  const output = run(
    python.command,
    [
      ...python.prefix,
      detector,
      '--root',
      fixture,
      '--format',
      'json',
      '--include-global',
    ],
    {
      env: {
        ...process.env,
        CODEX_HOME: path.join(fixture, 'codex-home'),
        PYTHONDONTWRITEBYTECODE: '1',
      },
    },
  );
  const report = JSON.parse(output);
  const technologies = new Set(report.technology_signals.map(({ name }) => name));
  assert(!technologies.has('Next.js'), 'script names must not become framework signals');
  assert(technologies.has('Vitest'));
  assert(technologies.has('Laravel'));

  const globalCodex = report.instruction_sources.filter(
    ({ scope, tool }) => scope === 'global' && tool === 'codex',
  );
  assert.equal(globalCodex.length, 1);
  assert.equal(path.basename(globalCodex[0].path), 'AGENTS.md');
  assert.equal(globalCodex[0].active, true);
  if (process.platform !== 'win32') {
    assert(report.errors.some((error) => error.includes('Skipped symlinked command file')));
  }

  if (process.platform !== 'win32') {
    const fallback = run('sh', [
      shellFallback,
      '--root',
      fixture,
      '--max-depth',
      '0',
      '--format',
      'text',
      '--include-global',
    ], {
      env: { ...process.env, CODEX_HOME: path.join(fixture, 'codex-home') },
    });
    assert(fallback.includes('package.json'));
    assert(!fallback.includes('nested/deeper/composer.json'));
    assert(fallback.includes('Vitest'));
    assert(!fallback.includes('Next.js'));
    assert(fallback.includes('empty and ignored'));
    assert(fallback.includes('AGENTS.md (global Codex instructions)'));
  }

  console.log('Agent context detector tests passed.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
