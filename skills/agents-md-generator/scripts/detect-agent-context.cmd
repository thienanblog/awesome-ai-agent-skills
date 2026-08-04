@echo off
setlocal EnableExtensions EnableDelayedExpansion
set "SCRIPT_DIR=%~dp0"

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  py -3 -c "import sys; raise SystemExit(sys.version_info ^< (3, 8))" >nul 2>&1
  if !ERRORLEVEL!==0 (
    py -3 "%SCRIPT_DIR%detect-agent-context.py" %*
    exit /b !ERRORLEVEL!
  )
)

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  python -c "import sys; raise SystemExit(sys.version_info ^< (3, 8))" >nul 2>&1
  if !ERRORLEVEL!==0 (
    python "%SCRIPT_DIR%detect-agent-context.py" %*
    exit /b !ERRORLEVEL!
  )
)

echo Python is unavailable; using the PowerShell text detector. 1>&2
set "PS_ARGS="
set "AGENT_CONTEXT_CONFIG_PATHS="
:parse
if "%~1"=="" goto run_ps
if "%~1"=="--root" (
  set "PS_ARGS=!PS_ARGS! -Root "%~2""
  shift
  shift
  goto parse
)
if "%~1"=="--include-global" (
  set "PS_ARGS=!PS_ARGS! -IncludeGlobal"
  shift
  goto parse
)
if "%~1"=="--config-path" (
  if defined AGENT_CONTEXT_CONFIG_PATHS (
    set "AGENT_CONTEXT_CONFIG_PATHS=!AGENT_CONTEXT_CONFIG_PATHS!;%~2"
  ) else (
    set "AGENT_CONTEXT_CONFIG_PATHS=%~2"
  )
  shift
  shift
  goto parse
)
if "%~1"=="--mcp-path" (
  if defined AGENT_CONTEXT_CONFIG_PATHS (
    set "AGENT_CONTEXT_CONFIG_PATHS=!AGENT_CONTEXT_CONFIG_PATHS!;%~2"
  ) else (
    set "AGENT_CONTEXT_CONFIG_PATHS=%~2"
  )
  shift
  shift
  goto parse
)
if "%~1"=="--format" (shift&shift&goto parse)
if "%~1"=="--max-depth" (
  set "PS_ARGS=!PS_ARGS! -MaxDepth %~2"
  shift
  shift
  goto parse
)
if "%~1"=="--help" set "PS_ARGS=!PS_ARGS! -Help"
if "%~1"=="-h" set "PS_ARGS=!PS_ARGS! -Help"
shift
goto parse

:run_ps
where pwsh >nul 2>&1
if %ERRORLEVEL%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%detect-agent-context.ps1" !PS_ARGS!
  exit /b %ERRORLEVEL%
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%detect-agent-context.ps1" !PS_ARGS!
exit /b %ERRORLEVEL%
