param(
  [string]$SkillsDir = "skills",
  [switch]$Help
)

$ErrorActionPreference = "Stop"

if ($Help) {
  Write-Host "Usage:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File scan-skill-duplicates.ps1 [-SkillsDir <path>]"
  Write-Host ""
  Write-Host "Options:"
  Write-Host "  -SkillsDir <path>  Skills directory (default: skills)"
  exit 0
}

function Get-CombinedHash {
  param([string]$Dir)

  $files = Get-ChildItem -LiteralPath $Dir -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\docs\\archives\\" -and $_.FullName -notmatch "\\.git\\" -and $_.Name -ne ".DS_Store"
  } | Sort-Object FullName

  $lines = foreach ($file in $files) {
    $rel = $file.FullName.Substring($Dir.Length + 1)
    $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName).Hash.ToLower()
    "$hash  $rel"
  }

  $temp = New-TemporaryFile
  try {
    $lines | Set-Content -LiteralPath $temp.FullName
    return (Get-FileHash -Algorithm SHA256 -LiteralPath $temp.FullName).Hash.ToLower()
  } finally {
    Remove-Item -LiteralPath $temp.FullName -ErrorAction SilentlyContinue
  }
}

$SkillsDir = (Resolve-Path -LiteralPath $SkillsDir).Path

Write-Host "Skill Duplicate Scan"
Write-Host "Skills root: $SkillsDir"
Write-Host ""

$skillDirs = Get-ChildItem -LiteralPath $SkillsDir -Directory | Where-Object {
  Test-Path -LiteralPath (Join-Path $_.FullName "SKILL.md")
}

if (-not $skillDirs) {
  Write-Host "No skills found. Expected subfolders with SKILL.md."
  exit 0
}

$hashToDirs = @{}
foreach ($dir in $skillDirs) {
  $hash = Get-CombinedHash -Dir $dir.FullName
  if (-not $hashToDirs.ContainsKey($hash)) {
    $hashToDirs[$hash] = @()
  }
  $hashToDirs[$hash] += $dir.FullName
}

$duplicateFound = $false
foreach ($entry in $hashToDirs.GetEnumerator()) {
  $dirs = $entry.Value
  if ($dirs.Count -gt 1) {
    $duplicateFound = $true
    Write-Host "Duplicate group: $($entry.Key)"
    foreach ($dupDir in $dirs) {
      Write-Host "  - $dupDir"
    }
    $canonical = $dirs[0]
    for ($i = 1; $i -lt $dirs.Count; $i++) {
      $target = $dirs[$i]
      Write-Host "  Suggest: ln -s `"$canonical`" `"$target`""
    }
    Write-Host ""
  }
}

if (-not $duplicateFound) {
  Write-Host "No duplicate skills found."
}

Write-Host "Notes:"
Write-Host "- Symlinks work best on macOS/Linux; Windows may need a copy with a clear header."
