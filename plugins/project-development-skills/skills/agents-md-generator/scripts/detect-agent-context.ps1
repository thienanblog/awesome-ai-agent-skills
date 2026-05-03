param(
  [string]$Root = ".",
  [string[]]$McpPath = @(),
  [switch]$Help
)

$ErrorActionPreference = "Stop"

if ($Help) {
  Write-Host "Usage:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File detect-agent-context.ps1 [-Root <path>] [-McpPath <path>]"
  Write-Host ""
  Write-Host "Options:"
  Write-Host "  -Root <path>     Project root (default: .)"
  Write-Host "  -McpPath <path>  Additional MCP config path (repeatable)"
  exit 0
}

function Write-Header {
  Write-Host "Agent Context Report"
  Write-Host "Project root: $Root"
  Write-Host ""
}

function Write-Section {
  param([string]$Title)
  Write-Host $Title
  Write-Host ("-" * $Title.Length)
}

function Report-File {
  param([string]$Label, [string]$Path)
  if (Test-Path -LiteralPath $Path -PathType Leaf) {
    Write-Host "- $Label: $Path"
    return $true
  }
  return $false
}

function Report-Dir {
  param([string]$Label, [string]$Path)
  if (Test-Path -LiteralPath $Path -PathType Container) {
    Write-Host "- $Label: $Path"
    return $true
  }
  return $false
}

function Report-Glob {
  param([string]$Label, [string]$Glob)
  $items = Get-ChildItem -Path $Glob -ErrorAction SilentlyContinue
  if ($items) {
    foreach ($item in $items) {
      Write-Host "- $Label: $($item.FullName)"
    }
    return $true
  }
  return $false
}

function Get-McpServers {
  param([string]$Path)
  try {
    $raw = Get-Content -LiteralPath $Path -Raw
    $data = $raw | ConvertFrom-Json
    $servers = $data.mcpServers
    if ($servers -and $servers.PSObject.Properties.Count -gt 0) {
      $servers.PSObject.Properties.Name | Sort-Object | ForEach-Object {
        Write-Host "  - $_"
      }
    } else {
      Write-Host "  - (no mcpServers found)"
    }
  } catch {
    Write-Host "  - ERROR: $($_.Exception.GetType().Name)"
  }
}

$Root = (Resolve-Path -LiteralPath $Root).Path
$HomeDir = $HOME

Write-Header

Write-Section "Project Instruction Files"

Report-File "CLAUDE.md" (Join-Path $Root "CLAUDE.md") | Out-Null
Report-File "AGENTS.md" (Join-Path $Root "AGENTS.md") | Out-Null
Report-File "GitHub Copilot" (Join-Path $Root ".github/copilot-instructions.md") | Out-Null
Report-File "Cursor" (Join-Path $Root ".cursorrules") | Out-Null
Report-File "Cline (.clinerules file)" (Join-Path $Root ".clinerules") | Out-Null
Report-Dir "Cline (.clinerules dir)" (Join-Path $Root ".clinerules") | Out-Null
Report-File "Kilo Code (.kilocoderules)" (Join-Path $Root ".kilocoderules") | Out-Null
Report-Dir "Kilo Code (.kilo dir)" (Join-Path $Root ".kilo") | Out-Null
Report-File "Kilo Code (.kilocodemodes)" (Join-Path $Root ".kilocodemodes") | Out-Null
Report-File "Kilo Code (.kilocode/config.json)" (Join-Path $Root ".kilocode/config.json") | Out-Null
Report-Dir "Roo Code (.roo/rules)" (Join-Path $Root ".roo/rules") | Out-Null
Report-Glob "Roo Code (.roo/rules-*)" (Join-Path $Root ".roo/rules-*") | Out-Null
Report-Glob "Roo Code (.roorules*)" (Join-Path $Root ".roorules*") | Out-Null
Report-File "OpenCode (opencode.jsonc)" (Join-Path $Root "opencode.jsonc") | Out-Null

if ($env:OPENCODE_CONFIG) {
  Report-File "OpenCode (OPENCODE_CONFIG)" $env:OPENCODE_CONFIG | Out-Null
}

Report-File "Claude Code (repo prompt)" (Join-Path $Root ".claude/CLAUDE.md") | Out-Null
Report-File "Claude Code (.mcp.json)" (Join-Path $Root ".mcp.json") | Out-Null

Write-Host ""
Write-Section "Global Instruction Files"

if ($HomeDir) {
  Report-File "Claude Code Global Prompt" (Join-Path $HomeDir ".claude/CLAUDE.md") | Out-Null
  Report-File "Codex Config" (Join-Path $HomeDir ".codex/config.toml") | Out-Null
  Report-Dir "Roo Code Global Rules" (Join-Path $HomeDir ".roo/rules") | Out-Null
  Report-Glob "Roo Code Global Rules (modes)" (Join-Path $HomeDir ".roo/rules-*") | Out-Null
  Report-Dir "Kilo Code Global Rules" (Join-Path $HomeDir ".kilocode/rules") | Out-Null
}

Write-Host ""
Write-Section "MCP Configs"

$mcpCandidates = @(
  (Join-Path $Root ".mcp.json"),
  (Join-Path $Root ".roo/mcp.json"),
  (Join-Path $Root "cline_mcp_settings.json")
)

if ($HomeDir) {
  $mcpCandidates += (Join-Path $HomeDir ".roo/mcp_settings.json")
  $mcpCandidates += (Join-Path $HomeDir ".cline/cline_mcp_settings.json")
  $mcpCandidates += (Join-Path $HomeDir ".config/cline/cline_mcp_settings.json")
}

if ($McpPath) {
  $mcpCandidates += $McpPath
}

$foundAny = $false
foreach ($candidate in $mcpCandidates) {
  if (Test-Path -LiteralPath $candidate -PathType Leaf) {
    $foundAny = $true
    Write-Host "- $candidate"
    Get-McpServers -Path $candidate
  }
}

if (-not $foundAny) {
  Write-Host "- (no MCP configs found)"
}

Write-Host ""
Write-Section "Notes"
Write-Host "- Global system prompts can override project rules. Review them for conflicts."
Write-Host "- Use --mcp-path <path> to scan additional MCP config locations."
