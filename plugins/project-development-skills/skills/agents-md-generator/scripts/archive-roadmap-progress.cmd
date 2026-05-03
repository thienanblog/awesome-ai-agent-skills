@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"

REM Translate GNU-style args (--fix, --dry-run, etc.) to PowerShell params.
set "PS_ARGS="

:loop
if "%~1"=="" goto done

if "%~1"=="--fix" (
  set "PS_ARGS=!PS_ARGS! -Fix"
  shift
  goto loop
)
if "%~1"=="--check" (
  REM default behavior; no switch needed
  shift
  goto loop
)
if "%~1"=="--dry-run" (
  set "PS_ARGS=!PS_ARGS! -Fix -DryRun"
  shift
  goto loop
)
if "%~1"=="--no-backup" (
  set "PS_ARGS=!PS_ARGS! -NoBackup"
  shift
  goto loop
)
if "%~1"=="--limit" (
  shift
  if "%~1"=="" goto done
  set "PS_ARGS=!PS_ARGS! -Limit %~1"
  shift
  goto loop
)
if "%~1"=="--skill-dir" (
  shift
  if "%~1"=="" goto done
  set "PS_ARGS=!PS_ARGS! -SkillDir \"%~1\""
  shift
  goto loop
)

set "PS_ARGS=!PS_ARGS! %~1"
shift
goto loop

:done

where pwsh >nul 2>&1
if %ERRORLEVEL%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%archive-roadmap-progress.ps1" %PS_ARGS%
  exit /b %ERRORLEVEL%
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%archive-roadmap-progress.ps1" %PS_ARGS%
exit /b %ERRORLEVEL%

