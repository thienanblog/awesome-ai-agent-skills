param(
  [string]$Root = ".",
  [string[]]$ConfigPath = @(),
  [int]$MaxDepth = 8,
  [switch]$IncludeGlobal,
  [switch]$Help
)

$ErrorActionPreference = "Stop"
if ($Help) {
  Write-Host "Usage: detect-agent-context.ps1 [-Root PATH] [-IncludeGlobal] [-ConfigPath PATH]"
  exit 0
}
if (-not (Test-Path -LiteralPath $Root -PathType Container)) {
  Write-Error "Root directory does not exist: $Root"
  exit 2
}
$Root = (Resolve-Path -LiteralPath $Root).Path
if ($env:AGENT_CONTEXT_CONFIG_PATHS) {
  $ConfigPath += $env:AGENT_CONTEXT_CONFIG_PATHS.Split(';', [System.StringSplitOptions]::RemoveEmptyEntries)
}

function Section([string]$Title) { Write-Host "`n$Title" }
function Report-File([string]$Path, [string]$Kind) {
  if (Test-Path -LiteralPath $Path -PathType Leaf) { Write-Host "  - $Path ($Kind)" }
}
function Has-Pattern([string]$Path, [string]$Pattern) {
  if ((Test-Path -LiteralPath $Path -PathType Leaf) -and -not ((Get-Item -LiteralPath $Path).Attributes -band [IO.FileAttributes]::ReparsePoint)) {
    return [bool](Select-String -LiteralPath $Path -Pattern $Pattern -Quiet)
  }
  return $false
}
function Signal([string]$Name, [string]$Path) { Write-Host "  - $Name (evidence=$Path)" }
function Get-JsonDependencyNames([string]$Path, [string[]]$Sections) {
  try {
    $data = Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
    foreach ($section in $Sections) {
      $property = $data.PSObject.Properties[$section]
      if ($property -and $property.Value) {
        $property.Value.PSObject.Properties.Name
      }
    }
  } catch {
    Write-Warning "Could not parse selected manifest: $Path"
  }
}

Write-Host "Agent context evidence report (PowerShell fallback)"
Write-Host "Root: $Root"
Section "Instruction and agent configuration paths:"
@("AGENTS.override.md", "AGENTS.md", "CLAUDE.md", "CLAUDE.local.md", "GEMINI.md", ".github/copilot-instructions.md", ".cursorrules", ".clinerules", ".mcp.json", ".cursor/mcp.json", ".cline/mcp_settings.json", ".roo/mcp.json", ".roo/mcp_settings.json", ".kilocode/mcp.json", ".kilocode/config.json", ".kilo/config.json", ".kilocodemodes", "cline_mcp_settings.json", "opencode.json", "opencode.jsonc") | ForEach-Object {
  Report-File (Join-Path $Root $_) "project"
}
if ($env:OPENCODE_CONFIG) { Report-File $env:OPENCODE_CONFIG "OPENCODE_CONFIG" }
$ConfigPath | ForEach-Object { Report-File $_ "custom" }
if ($IncludeGlobal) {
  $codexDir = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
  $override = Join-Path $codexDir "AGENTS.override.md"
  $agents = Join-Path $codexDir "AGENTS.md"
  $activeOverride = (Test-Path -LiteralPath $override -PathType Leaf) -and ((Get-Item -LiteralPath $override).Length -gt 0)
  if ($activeOverride) {
    Report-File $override "global Codex override; active"
  } elseif (Test-Path -LiteralPath $override -PathType Leaf) {
    Write-Host "  - $override (global Codex override; empty and ignored)"
  }
  if ($activeOverride -and (Test-Path -LiteralPath $agents)) {
    Write-Host "  - $agents (global Codex instructions; shadowed by override)"
  } else { Report-File $agents "global Codex instructions" }
  Report-File (Join-Path $HOME ".claude/CLAUDE.md") "global Claude instructions"
}

$ignored = @(".git", "node_modules", "vendor", "dist", "build", "target", ".venv")
$manifestNames = @("package.json", "composer.json", "pyproject.toml", "requirements.txt", "Gemfile", "pom.xml", "build.gradle", "build.gradle.kts", "go.mod", "Cargo.toml", "pubspec.yaml")
$lockNames = @("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "composer.lock", "uv.lock", "poetry.lock")
function Get-ProjectFiles([string]$Directory, [int]$Depth) {
  if ($Depth -gt $MaxDepth) { return }
  foreach ($item in Get-ChildItem -LiteralPath $Directory -Force -ErrorAction SilentlyContinue) {
    if ($item.PSIsContainer) {
      if (($ignored -notcontains $item.Name) -and -not ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
        Get-ProjectFiles $item.FullName ($Depth + 1)
      }
    } else {
      $item
    }
  }
}
$files = @(Get-ProjectFiles $Root 0)
$manifests = $files | Where-Object {
  ($manifestNames -contains $_.Name) -and -not ($_.Attributes -band [IO.FileAttributes]::ReparsePoint)
}
$instructionNames = @("AGENTS.md", "AGENTS.override.md", "CLAUDE.md", "CLAUDE.local.md", "GEMINI.md", ".cursorrules", ".clinerules")
$files | Where-Object {
  (($_.DirectoryName -ne $Root) -and ($instructionNames -contains $_.Name)) -or
  ($_.FullName -match '[\\/]\.(claude|cursor|roo|kilocode|kilo)[\\/]rules(?:-[^\\/]+)?[\\/]') -or
  ($_.Name -like '.roorules*') -or ($_.Name -like '.kilocoderules*')
} | Sort-Object FullName | ForEach-Object { Write-Host "  - $($_.FullName) (scoped instructions)" }

Section "Project manifests and lockfiles:"
$files | Where-Object { ($manifestNames + $lockNames) -contains $_.Name } | Sort-Object FullName | ForEach-Object { Write-Host "  - $($_.FullName)" }

Section "Technology signals:"
foreach ($manifest in $manifests) {
  if ($manifest.Name -eq "package.json") {
    $dependencies = @(Get-JsonDependencyNames $manifest.FullName @("dependencies", "devDependencies", "peerDependencies"))
    @(@("Next.js", "next"), @("Nuxt", "nuxt"), @("React", "react"), @("Vue", "vue"), @("Angular", "@angular/core"), @("SvelteKit", "@sveltejs/kit"), @("NestJS", "@nestjs/core"), @("Express", "express"), @("Fastify", "fastify"), @("Vitest", "vitest"), @("Jest", "jest"), @("Playwright", "@playwright/test"), @("ESLint", "eslint"), @("Prettier", "prettier")) | ForEach-Object {
      if ($dependencies -contains $_[1]) { Signal $_[0] $manifest.FullName }
    }
    continue
  }
  if ($manifest.Name -eq "composer.json") {
    $dependencies = @(Get-JsonDependencyNames $manifest.FullName @("require", "require-dev"))
    @(@("Laravel", "laravel/framework"), @("Symfony", "symfony/framework-bundle"), @("Drupal", "drupal/core-recommended"), @("Joomla", "joomla/cms"), @("Pest", "pestphp/pest"), @("PHPUnit", "phpunit/phpunit"), @("Laravel Pint", "laravel/pint"), @("PHPStan", "phpstan/phpstan")) | ForEach-Object {
      if ($dependencies -contains $_[1]) { Signal $_[0] $manifest.FullName }
    }
    continue
  }
  $rules = switch ($manifest.Name) {
    { $_ -in @("pyproject.toml", "requirements.txt") } { @(@("Django", "django"), @("Flask", "flask"), @("FastAPI", "fastapi"), @("pytest", "pytest"), @("Ruff", "ruff")) }
    "Gemfile" { @(@("Rails", "gem.*rails")) }
    { $_ -in @("pom.xml", "build.gradle", "build.gradle.kts") } { @(@("Spring Boot", "org.springframework.boot")) }
    "go.mod" { @(@("Gin", "github.com/gin-gonic/gin"), @("Fiber", "github.com/gofiber/fiber")) }
    "Cargo.toml" { @(@("Axum", "^\s*axum\s*="), @("Actix Web", "^\s*actix-web\s*=")) }
    "pubspec.yaml" { @(@("Flutter", "^\s*flutter:")) }
    default { @() }
  }
  foreach ($rule in $rules) { if (Has-Pattern $manifest.FullName $rule[1]) { Signal $rule[0] $manifest.FullName } }
}

Section "Notes:"
Write-Host "  - This fallback reads only selected public manifests and reports paths, never secrets or source contents."
Write-Host "  - Use the Python detector when JSON output, command extraction, or stricter conflict reporting is required."
