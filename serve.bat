@echo off
REM ============================================================
REM  Web3 Learning Wiki - one-click local preview (Windows)
REM  Double-click this file, then open
REM    http://127.0.0.1:8000/web3-learning-wiki/
REM  Uses the project venv when it actually works, otherwise falls
REM  back to the first global Python (python, then py) that has the
REM  MkDocs packages installed.
REM ============================================================
cd /d "%~dp0"
set "CHECK=import mkdocs, material, mkdocs_static_i18n"

if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" -c "%CHECK%" >nul 2>nul
  if not errorlevel 1 (
    set "PY=.venv\Scripts\python.exe"
    goto run
  )
  echo [Info] .venv is broken or missing packages, trying the global Python ...
)

set "PY="
set "ANY="
for %%P in (python py) do (
  if not defined PY (
    where %%P >nul 2>nul
    if not errorlevel 1 (
      if not defined ANY set "ANY=%%P"
      %%P -c "%CHECK%" >nul 2>nul
      if not errorlevel 1 set "PY=%%P"
    )
  )
)
if defined PY goto run

if defined ANY (
  echo [Error] MkDocs packages are missing. Run this once, then double-click again:
  echo     %ANY% -m pip install -r requirements.txt
) else (
  echo [Error] Python was not found.
  echo Install Python from https://www.python.org and tick "Add python.exe to PATH".
)
pause
goto :eof

:run
echo Using %PY%
echo Preview: http://127.0.0.1:8000/web3-learning-wiki/
"%PY%" -m mkdocs serve %*
