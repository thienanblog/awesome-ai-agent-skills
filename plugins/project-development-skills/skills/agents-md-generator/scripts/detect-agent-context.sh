#!/usr/bin/env sh
set -eu

root=.
include_global=false
format=text
max_depth=8
config_paths=""

usage() {
  echo "Usage: detect-agent-context.sh [--root PATH] [--format text] [--include-global] [--config-path PATH]"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --root) root=${2:?missing path}; shift 2 ;;
    --format) format=${2:?missing format}; shift 2 ;;
    --max-depth) max_depth=${2:?missing depth}; shift 2 ;;
    --include-global) include_global=true; shift ;;
    --config-path|--mcp-path) config_paths="$config_paths
${2:?missing path}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [ ! -d "$root" ]; then
  echo "error: root directory does not exist: $root" >&2
  exit 2
fi
root=$(CDPATH= cd -- "$root" && pwd)
case "$max_depth" in
  ''|*[!0-9]*) echo "error: --max-depth must be zero or greater" >&2; exit 2 ;;
esac
find_depth=$((max_depth + 1))
if find "$root" -maxdepth 0 -print >/dev/null 2>&1; then
  depth_option="-maxdepth $find_depth"
else
  depth_option=""
  echo "Portable find does not support -maxdepth; depth limit is unavailable." >&2
fi
if [ "$format" != text ]; then
  echo "Portable fallback supports text output only; continuing with text." >&2
fi

section() { printf '\n%s\n' "$1"; }
report_file() { [ -f "$2" ] && printf '  - %s (%s)\n' "$2" "$1" || true; }
manifest_has() {
  [ -f "$1" ] && [ ! -L "$1" ] && grep -Eiq "$2" "$1" 2>/dev/null
}
signal() { printf '  - %s (evidence=%s)\n' "$1" "$2"; }
json_manifest_signals() {
  node -e '
const fs = require("fs");
const path = process.argv[1];
const kind = process.argv[2];
const rules = kind === "package"
  ? {next:"Next.js",nuxt:"Nuxt",react:"React",vue:"Vue","@angular/core":"Angular","@sveltejs/kit":"SvelteKit","@nestjs/core":"NestJS",express:"Express",fastify:"Fastify",vitest:"Vitest",jest:"Jest","@playwright/test":"Playwright",eslint:"ESLint",prettier:"Prettier"}
  : {"laravel/framework":"Laravel","symfony/framework-bundle":"Symfony","drupal/core-recommended":"Drupal","joomla/cms":"Joomla","pestphp/pest":"Pest","phpunit/phpunit":"PHPUnit","laravel/pint":"Laravel Pint","phpstan/phpstan":"PHPStan"};
const sections = kind === "package"
  ? ["dependencies", "devDependencies", "peerDependencies"]
  : ["require", "require-dev"];
try {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const dependencies = new Set(sections.flatMap(section => Object.keys(data[section] || {})));
  for (const [dependency, name] of Object.entries(rules)) {
    if (dependencies.has(dependency)) console.log(`  - ${name} (evidence=${path})`);
  }
} catch (error) {
  console.error(`  - Could not parse selected manifest: ${path}`);
}
' "$1" "$2"
}

printf 'Agent context evidence report (portable fallback)\nRoot: %s\n' "$root"
section "Instruction and agent configuration paths:"
find "$root" $depth_option -type d \( -name .git -o -name node_modules -o -name vendor -o -name dist -o -name build -o -name target -o -name .venv \) -prune -o -type f \( -name AGENTS.md -o -name AGENTS.override.md -o -name CLAUDE.md -o -name CLAUDE.local.md -o -name GEMINI.md -o -name .cursorrules -o -name .clinerules -o -name '.roorules*' -o -name '.kilocoderules*' -o -path '*/.github/instructions/*.instructions.md' -o -path '*/.claude/rules/*.md' -o -path '*/.cursor/rules/*.md' -o -path '*/.cursor/rules/*.mdc' -o -path '*/.roo/rules/*.md' -o -path '*/.kilocode/rules/*.md' -o -path '*/.kilo/rules/*.md' \) -print 2>/dev/null | sed 's/^/  - /'
for item in .github/copilot-instructions.md .mcp.json .cursor/mcp.json .cline/mcp_settings.json .roo/mcp.json .roo/mcp_settings.json .kilocode/mcp.json .kilocode/config.json .kilo/config.json .kilocodemodes cline_mcp_settings.json opencode.json opencode.jsonc; do
  report_file "project" "$root/$item"
done
if [ -n "${OPENCODE_CONFIG:-}" ]; then report_file "OPENCODE_CONFIG" "$OPENCODE_CONFIG"; fi
printf '%s\n' "$config_paths" | while IFS= read -r item; do
  if [ -n "$item" ]; then report_file "custom" "$item"; fi
done
if [ "$include_global" = true ]; then
  codex_dir=${CODEX_HOME:-${HOME:-}/.codex}
  if [ -s "$codex_dir/AGENTS.override.md" ]; then
    report_file "global Codex override (active)" "$codex_dir/AGENTS.override.md"
    [ -f "$codex_dir/AGENTS.md" ] && printf '  - %s (global Codex instructions; shadowed by override)\n' "$codex_dir/AGENTS.md"
  else
    [ -f "$codex_dir/AGENTS.override.md" ] && printf '  - %s (global Codex override; empty and ignored)\n' "$codex_dir/AGENTS.override.md"
    report_file "global Codex instructions" "$codex_dir/AGENTS.md"
  fi
  [ -n "${HOME:-}" ] && report_file "global Claude instructions" "$HOME/.claude/CLAUDE.md"
fi

section "Project manifests and lockfiles:"
find "$root" $depth_option -type d \( -name .git -o -name node_modules -o -name vendor -o -name dist -o -name build -o -name target -o -name .venv \) -prune -o -type f \( -name package.json -o -name composer.json -o -name pyproject.toml -o -name requirements.txt -o -name Gemfile -o -name pom.xml -o -name build.gradle -o -name build.gradle.kts -o -name go.mod -o -name Cargo.toml -o -name pubspec.yaml -o -name package-lock.json -o -name pnpm-lock.yaml -o -name yarn.lock -o -name bun.lock -o -name composer.lock -o -name uv.lock -o -name poetry.lock \) -print 2>/dev/null | sed 's/^/  - /'

section "Technology signals and candidates:"
found=false
find "$root" $depth_option -type d \( -name .git -o -name node_modules -o -name vendor -o -name dist -o -name build -o -name target -o -name .venv \) -prune -o -type f \( -name package.json -o -name composer.json -o -name pyproject.toml -o -name requirements.txt -o -name Gemfile -o -name pom.xml -o -name build.gradle -o -name build.gradle.kts -o -name go.mod -o -name Cargo.toml -o -name pubspec.yaml \) -print 2>/dev/null | while IFS= read -r manifest; do
  case "${manifest##*/}" in
    package.json)
      if command -v node >/dev/null 2>&1; then
        json_manifest_signals "$manifest" package
      else
        for spec in 'Next.js|"next"' 'Nuxt|"nuxt"' 'React|"react"' 'Vue|"vue"' 'Angular|"@angular/core"' 'SvelteKit|"@sveltejs/kit"' 'NestJS|"@nestjs/core"' 'Express|"express"' 'Fastify|"fastify"' 'Vitest|"vitest"' 'Jest|"jest"' 'Playwright|"@playwright/test"' 'ESLint|"eslint"' 'Prettier|"prettier"'; do
          name=${spec%%|*}; pattern=${spec#*|}; manifest_has "$manifest" "$pattern" && signal "$name" "$manifest"
        done
      fi ;;
    composer.json)
      if command -v node >/dev/null 2>&1; then
        json_manifest_signals "$manifest" composer
      else
        for spec in 'Laravel|"laravel/framework"' 'Symfony|"symfony/framework-bundle"' 'Drupal|"drupal/core' 'Joomla|"joomla/cms"' 'Pest|"pestphp/pest"' 'PHPUnit|"phpunit/phpunit"' 'Laravel Pint|"laravel/pint"' 'PHPStan|"phpstan/phpstan"'; do
          name=${spec%%|*}; pattern=${spec#*|}; manifest_has "$manifest" "$pattern" && signal "$name" "$manifest"
        done
      fi ;;
    pyproject.toml|requirements.txt)
      for spec in 'Django|django' 'Flask|flask' 'FastAPI|fastapi' 'pytest|pytest' 'Ruff|ruff'; do
        name=${spec%%|*}; pattern=${spec#*|}; manifest_has "$manifest" "$pattern" && signal "$name" "$manifest"
      done ;;
    Gemfile) manifest_has "$manifest" "gem.*rails" && signal "Rails" "$manifest" ;;
    pom.xml|build.gradle|build.gradle.kts) manifest_has "$manifest" "org.springframework.boot" && signal "Spring Boot" "$manifest" ;;
    go.mod)
      manifest_has "$manifest" "github.com/gin-gonic/gin" && signal "Gin" "$manifest"
      manifest_has "$manifest" "github.com/gofiber/fiber" && signal "Fiber" "$manifest" ;;
    Cargo.toml)
      manifest_has "$manifest" "^[[:space:]]*axum[[:space:]]*=" && signal "Axum" "$manifest"
      manifest_has "$manifest" "^[[:space:]]*actix-web[[:space:]]*=" && signal "Actix Web" "$manifest" ;;
    pubspec.yaml) manifest_has "$manifest" "^[[:space:]]*flutter:" && signal "Flutter" "$manifest" ;;
  esac
  :
done

section "Notes:"
echo "  - This fallback reads only selected public manifests and reports paths, never secrets or source contents."
echo "  - JSON manifests use Node when available; remaining grep-based candidates require dependency verification."
echo "  - Use the Python detector when JSON output, command extraction, or stricter conflict reporting is required."
