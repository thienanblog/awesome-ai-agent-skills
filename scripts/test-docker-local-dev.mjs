import assert from 'node:assert/strict';
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillRoot = path.join(repositoryRoot, 'skills/docker-local-dev');
const scripts = path.join(skillRoot, 'scripts');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    ...options,
  });
  return result;
}

function expectSuccess(result, label) {
  assert.equal(
    result.status,
    0,
    `${label} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
}

function writeExecutable(file, content) {
  writeFileSync(file, content);
  chmodSync(file, 0o755);
}

const fixture = mkdtempSync(path.join(tmpdir(), 'docker-local-dev-'));
try {
  const pythonProject = path.join(fixture, 'python-project');
  mkdirSync(pythonProject, { recursive: true });
  writeFileSync(
    path.join(pythonProject, 'pyproject.toml'),
    '[project]\nrequires-python = ">=3.12"\ndependencies = ["django==5.2"]\n',
  );
  writeFileSync(path.join(pythonProject, 'compose.yaml'), 'services: {}\n');

  const detection = run('bash', [path.join(scripts, 'detect-stack.sh'), pythonProject]);
  expectSuccess(detection, 'Python stack detection');
  const report = JSON.parse(detection.stdout);
  assert.equal(report.language, 'python');
  assert.equal(report.languageVersion, '3.12');
  assert.equal(report.framework, 'django');
  assert.equal(report.existingDocker, true);

  const emptyProject = path.join(fixture, 'empty-project');
  mkdirSync(emptyProject, { recursive: true });
  const emptyDetection = run('bash', [path.join(scripts, 'detect-stack.sh'), emptyProject]);
  expectSuccess(emptyDetection, 'Empty project detection');
  const emptyReport = JSON.parse(emptyDetection.stdout);
  assert.equal(emptyReport.detected, false);
  assert.equal(emptyReport.supported, false);

  const mockBin = path.join(fixture, 'mock-bin');
  mkdirSync(mockBin, { recursive: true });
  writeExecutable(
    path.join(mockBin, 'lsof'),
    `#!/bin/sh
case "$*" in
  *TCP:8080*|*TCP:8025*) exit 0 ;;
  *) exit 1 ;;
esac
`,
  );
  writeExecutable(path.join(mockBin, 'nc'), '#!/bin/sh\nexit 1\n');
  writeExecutable(path.join(mockBin, 'ss'), '#!/bin/sh\nexit 1\n');

  const portEnv = {
    ...process.env,
    PATH: `${mockBin}:${process.env.PATH}`,
    PORT_CHECK_DISABLE_TCP_FALLBACK: '1',
  };
  const suggestions = run('bash', [path.join(scripts, 'port-check.sh'), 'suggest'], {
    env: portEnv,
  });
  expectSuccess(suggestions, 'Port suggestions');
  const ports = JSON.parse(suggestions.stdout);
  assert.equal(ports.http, 8081);
  assert.equal(ports.mail, 8026);
  assert.equal(new Set(Object.values(ports)).size, Object.values(ports).length);

  const commonPorts = run('bash', [path.join(scripts, 'port-check.sh'), 'check'], {
    env: portEnv,
  });
  assert.equal(commonPorts.status, 1);
  assert.match(commonPorts.stdout, /Port 8080 \(HTTP\): IN USE/);
  assert.match(commonPorts.stdout, /Port 3306 \(MySQL\): AVAILABLE/);

  const dockerLog = path.join(fixture, 'docker.log');
  writeExecutable(
    path.join(mockBin, 'docker'),
    `#!/bin/sh
if [ "$1" = "compose" ] && [ "$2" = "config" ] && [ "$3" = "--services" ]; then
  printf '%s\n' app app-deps
  exit 0
fi
if [ "$1" = "compose" ] && [ "$2" = "ps" ]; then
  case "$*" in
    *app-deps) echo id-deps ;;
    *app) echo id-app ;;
  esac
  exit 0
fi
if [ "$1" = "inspect" ]; then
  case "$*" in
    *id-deps) echo 'exited|0|' ;;
    *id-app) echo "\${MOCK_APP_STATE:-running|0|healthy}" ;;
  esac
  exit 0
fi
if [ "$1" = "compose" ] && [ "$2" = "exec" ]; then
  printf '%s\n' "$*" >> "$MOCK_DOCKER_LOG"
  case "$*" in
    *updated*) echo updated ; echo 0 ;;
    *) echo 1 ;;
  esac
  exit 0
fi
printf 'Unexpected docker invocation: %s\n' "$*" >&2
exit 2
`,
  );

  const dockerEnv = {
    ...process.env,
    PATH: `${mockBin}:${process.env.PATH}`,
    MOCK_DOCKER_LOG: dockerLog,
  };
  const health = run('bash', [path.join(scripts, 'health-check.sh')], { env: dockerEnv });
  expectSuccess(health, 'Compose health summary');
  assert.match(health.stdout, /PASS  app is running and healthy/);
  assert.match(health.stdout, /PASS  app-deps completed successfully/);
  assert.match(health.stdout, /Failed: 0/);

  const unhealthy = run('bash', [path.join(scripts, 'health-check.sh')], {
    env: { ...dockerEnv, MOCK_APP_STATE: 'exited|1|' },
  });
  assert.equal(unhealthy.status, 1);
  assert.match(unhealthy.stdout, /FAIL  app is exited \(exit 1\)/);
  assert.match(unhealthy.stdout, /PASS  app-deps completed successfully/);
  assert.match(unhealthy.stdout, /Failed: 1/);

  const database = run('bash', [path.join(scripts, 'db-test.sh')], {
    env: {
      ...dockerEnv,
      DB_SERVICE: 'db',
      DB_TYPE: 'mysql',
      DB_DATABASE: 'app',
    },
  });
  expectSuccess(database, 'Read-only database check');
  let invocations = readFileSync(dockerLog, 'utf8');
  assert.match(invocations, /--database=app/);
  assert.match(invocations, /SELECT 1/);
  assert.doesNotMatch(invocations, /CREATE TEMPORARY TABLE/);

  writeFileSync(dockerLog, '');
  const crud = run('bash', [path.join(scripts, 'db-test.sh'), '--crud'], {
    env: {
      ...dockerEnv,
      DB_SERVICE: 'db',
      DB_TYPE: 'mysql',
      DB_DATABASE: 'app',
    },
  });
  expectSuccess(crud, 'Temporary database CRUD check');
  invocations = readFileSync(dockerLog, 'utf8');
  assert.match(invocations, /CREATE TEMPORARY TABLE/);
  assert.match(invocations, /DELETE FROM docker_local_dev_check/);

  const composeTemplates = path.join(skillRoot, 'assets/templates/docker-compose');
  const composeFiles = readdirSync(composeTemplates).filter((name) => name.endsWith('.yml'));
  const renderedCompose = new Map();
  for (const file of composeFiles) {
    const content = readFileSync(path.join(composeTemplates, file), 'utf8');
    assert.match(content, /^name:/m, `${file} must define a stable Compose project name`);
    assert.doesNotMatch(content, /\bcontainer_name:/, `${file} must not fix container names`);
    assert.doesNotMatch(content, /:latest\b/, `${file} must not use floating latest tags`);
    assert.doesNotMatch(content, /:-secret\b/, `${file} must not embed a default secret`);
    assert.doesNotMatch(content, /restart:\s*unless-stopped/, `${file} should not force restart policy in local development`);
    for (const mapping of content.matchAll(/^\s+-\s+"([^"\n]+:[0-9]+)"\s*$/gm)) {
      assert.match(mapping[1], /^127\.0\.0\.1:/, `${file} publishes a non-loopback port: ${mapping[1]}`);
    }
    const rendered = content.replace(/\{\{[A-Z0-9_]+\}\}/g, 'template-value');
    assert.doesNotThrow(() => YAML.parse(rendered), `${file} must remain valid YAML after marker substitution`);
    renderedCompose.set(file, rendered);
  }

  if (run('docker', ['compose', 'version']).status === 0) {
    const composeFixture = path.join(fixture, 'rendered-compose');
    mkdirSync(composeFixture, { recursive: true });
    const composeEnv = {
      ...process.env,
      DB_DATABASE: 'app',
      DB_USERNAME: 'app',
      DB_PASSWORD: 'local-test-password',
      DB_ROOT_PASSWORD: 'local-test-root-password',
      SECRET_KEY: 'local-test-secret-key',
      WORDPRESS_SECRET: 'local-test-wordpress-secret',
    };
    for (const [file, rendered] of renderedCompose) {
      if (file === 'base.yml') continue;
      const renderedPath = path.join(composeFixture, file);
      writeFileSync(renderedPath, rendered);
      const config = run('docker', ['compose', '-f', renderedPath, 'config', '--quiet'], {
        cwd: composeFixture,
        env: composeEnv,
      });
      expectSuccess(config, `Rendered Compose validation for ${file}`);
    }
  }

  const dockerfileTemplates = path.join(skillRoot, 'assets/templates/dockerfile');
  const dockerfiles = readdirSync(dockerfileTemplates)
    .filter((name) => name.endsWith('.dockerfile'))
    .map((name) => readFileSync(path.join(dockerfileTemplates, name), 'utf8'))
    .join('\n');
  assert.doesNotMatch(dockerfiles, /composer:latest/);
  assert.doesNotMatch(dockerfiles, /CMD \["\{\{START_COMMAND\}\}"\]/);
  assert.doesNotMatch(dockerfiles, /php-fpm-healthcheck/);

  const wordpressConfig = readFileSync(
    path.join(skillRoot, 'assets/templates/wordpress/wp-config-docker.php'),
    'utf8',
  );
  assert.doesNotMatch(wordpressConfig, /put-your-unique-phrase-here/);
  assert.doesNotMatch(wordpressConfig, /define\('WP_DEBUG_DISPLAY', true\)/);
  assert.doesNotMatch(wordpressConfig, /define\('SAVEQUERIES', true\)/);

  console.log('Docker local development helper tests passed.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
