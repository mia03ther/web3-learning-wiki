@echo off
REM ============================================================
REM  Web3 Learning Wiki - one-click local preview (Windows)
REM  Double-click this file, then open http://127.0.0.1:8000
REM  Prefers the project venv if present, otherwise falls back
REM  to the global Python.
REM ============================================================
cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
  echo Using project venv (.venv) ...
  ".venv\Scripts\python.exe" -m mkdocs serve %*
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting MkDocs preview at http://127.0.0.1:8000 ...
  python -m mkdocs serve %*
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
  echo Starting MkDocs preview at http://127.0.0.1:8000 ...
  py -m mkdocs serve %*
  goto :eof
)

echo [Error] Python was not found.
echo Install Python from https://www.python.org and tick "Add python.exe to PATH".
pause
