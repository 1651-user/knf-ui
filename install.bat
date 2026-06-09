@echo off
setlocal

set "ROOT=%~dp0"
set "BOOTSTRAP=%ROOT%scripts\bootstrap.ps1"

if not exist "%BOOTSTRAP%" (
  echo Missing bootstrap script: %BOOTSTRAP%
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%BOOTSTRAP%" -InstallNodeIfMissing
set "EXITCODE=%ERRORLEVEL%"

if not "%EXITCODE%"=="0" (
  echo.
  echo Setup failed with exit code %EXITCODE%.
  pause
)

exit /b %EXITCODE%
