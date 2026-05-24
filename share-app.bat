@echo off
title ZEPHYR Boxing App - Share Mode
echo ======================================================
echo          ZEPHYR BOXING APP - REMOTE SHARING
echo ======================================================
echo.
echo [1/2] Starting Local Development Server...
set __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=all
start "Vite Server" cmd /c "npm run dev -- --host"

echo [2/2] Waiting for server to initialize (5s)...
timeout /t 5 /nobreak > nul

echo.
echo [3/2] Starting Ngrok Tunnel...
echo IMPORTANT: If this is your first time, make sure you have 
echo added your authtoken as per directives/share_preview.md
echo.
npx ngrok http 5173

echo.
echo ======================================================
echo Tunnel closed. Close this window to finish.
echo ======================================================
pause
