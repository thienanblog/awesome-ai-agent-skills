param(
  [string]$SkillDir = "skills/agents-md-generator",
  [int]$Limit = 300,
  [switch]$Fix,
  [switch]$DryRun,
  [switch]$NoBackup
)

$ErrorActionPreference = "Stop"

function Write-Usage {
  @"
Usage:
  powershell -ExecutionPolicy Bypass -File skills/agents-md-generator/scripts/archive-roadmap-progress.ps1 [-SkillDir <path>] [-Limit <n>] [-Fix] [-DryRun] [-NoBackup]

Notes:
  - Only archives content from the first matching section header:
      '## Completed' or '## Done'
  - Archives oldest entries from the bottom of that section until the file is <= Limit.
  - Writes archives to: <SkillDir>/docs/archives/{ROADMAP|PROGRESS}-YYYY-MM.md (append).
"@ | Write-Host
}

if ($PSBoundParameters.ContainsKey("Help")) { Write-Usage; exit 0 }

function Get-SectionBounds {
  param(
    [string[]]$Lines
  )

  $headerIndex = -1
  for ($i = 0; $i -lt $Lines.Length; $i++) {
    if ($Lines[$i] -match '^\s*##\s+(Completed|Done)(\s|$)') { $headerIndex = $i; break }
  }
  if ($headerIndex -lt 0) { throw "missing_completed_or_done_section" }

  $sectionStart = $headerIndex + 1
  $sectionEnd = $Lines.Length - 1
  for ($i = $sectionStart; $i -lt $Lines.Length; $i++) {
    if ($Lines[$i] -match '^\s*##\s+') { $sectionEnd = $i - 1; break }
  }
  if ($sectionEnd -lt $sectionStart) { throw "empty_completed_or_done_section" }

  return @{
    HeaderIndex = $headerIndex
    SectionStart = $sectionStart
    SectionEnd = $sectionEnd
  }
}

function Get-EntryStarts {
  param(
    [string[]]$Lines,
    [int]$SectionStart,
    [int]$SectionEnd
  )

  $starts = New-Object System.Collections.Generic.List[int]
  for ($i = $SectionStart; $i -le $SectionEnd; $i++) {
    if ($Lines[$i] -match '^\s*[-*]\s+') { $starts.Add($i) }
  }
  return $starts
}

function Process-File {
  param(
    [string]$FilePath
  )

  if (-not (Test-Path $FilePath)) { throw "Missing file: $FilePath" }

  $lines = Get-Content -LiteralPath $FilePath
  $total = $lines.Length
  if ($total -le $Limit) {
    Write-Host "OK: $FilePath ($total lines <= $Limit)"
    return
  }

  $bounds = Get-SectionBounds -Lines $lines
  $headerIndex = $bounds.HeaderIndex
  $sectionStart = $bounds.SectionStart
  $sectionEnd = $bounds.SectionEnd

  $starts = Get-EntryStarts -Lines $lines -SectionStart $sectionStart -SectionEnd $sectionEnd
  if ($starts.Count -eq 0) { throw "no_entries_in_completed_or_done_section" }

  # Compute entry ends.
  $ends = New-Object System.Collections.Generic.List[int]
  for ($k = 0; $k -lt $starts.Count; $k++) {
    if ($k -lt ($starts.Count - 1)) { $ends.Add($starts[$k + 1] - 1) }
    else { $ends.Add($sectionEnd) }
  }

  $need = $total - $Limit
  $removed = 0
  $removeFrom = -1
  for ($k = $starts.Count - 1; $k -ge 0; $k--) {
    $len = ($ends[$k] - $starts[$k] + 1)
    $removed += $len
    $removeFrom = $starts[$k]
    if ($removed -ge $need) { break }
  }
  if ($removeFrom -lt 0) { throw "unable_to_compute_removal" }

  Write-Host "NEEDS ARCHIVE: $FilePath ($total lines > $Limit)"
  Write-Host ("  - Completed/Done header at line: {0}" -f ($headerIndex + 1))
  Write-Host ("  - Section range: {0}..{1}" -f ($sectionStart + 1), ($sectionEnd + 1))
  Write-Host ("  - Would remove: {0}..{1} ({2} lines)" -f ($removeFrom + 1), ($sectionEnd + 1), $removed)

  if (-not $Fix) { return }

  $ym = Get-Date -Format "yyyy-MM"
  $today = Get-Date -Format "yyyy-MM-dd"
  $base = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
  $archiveDir = Join-Path $SkillDir "docs/archives"
  $archiveFile = Join-Path $archiveDir ("{0}-{1}.md" -f $base, $ym)

  if ($DryRun) {
    Write-Host "DRY RUN: would append to $archiveFile and rewrite $FilePath"
    return
  }

  New-Item -ItemType Directory -Force -Path $archiveDir | Out-Null

  if (-not (Test-Path $archiveFile)) {
    @(
      "# $base Archive — $ym",
      ""
    ) | Set-Content -LiteralPath $archiveFile
  }

  $removedLines = $lines[$removeFrom..$sectionEnd]
  $newLines = @()
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($i -lt $removeFrom -or $i -gt $sectionEnd) { $newLines += $lines[$i] }
  }

  if (-not $NoBackup) {
    Copy-Item -LiteralPath $FilePath -Destination ($FilePath + ".bak") -Force
  }

  @(
    "",
    "## Archived from $base.md on $today",
    ""
  ) + $removedLines + @("") | Add-Content -LiteralPath $archiveFile

  $newLines | Set-Content -LiteralPath $FilePath

  Write-Host "ARCHIVED: $FilePath -> $archiveFile"
}

Process-File (Join-Path $SkillDir "ROADMAP.md")
Process-File (Join-Path $SkillDir "PROGRESS.md")

