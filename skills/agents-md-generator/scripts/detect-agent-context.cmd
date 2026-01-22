@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"

set "PS_ARGS="

:loop
if "%~1"=="" goto done

if "%~1"=="--root" (
  shift
  if "%~1"=="" goto done
  set "PS_ARGS=!PS_ARGS! -Root \"%~1\""
  shift
  goto loop
)

if "%~1"=="--mcp-path" (
  shift
  if "%~1"=="" goto done
  set "PS_ARGS=!PS_ARGS! -McpPath \"%~1\""
  shift
  goto loop
)

if "%~1"=="-h" (
  set "PS_ARGS=!PS_ARGS! -Help"
  shift
  goto loop
)

if "%~1"=="--help" (
  set "PS_ARGS=!PS_ARGS! -Help"
  shift
  goto loop
)

set "PS_ARGS=!PS_ARGS! %~1"
shift
goto loop

:done

where pwsh >nul 2>&1
if %ERRORLEVEL%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%detect-agent-context.ps1" %PS_ARGS%
  exit /b %ERRORLEVEL%
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%detect-agent-context.ps1" %PS_ARGS%
exit /b %ERRORLEVEL%
