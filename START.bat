@echo off
title SkillBridge Launcher
color 0A

echo.
echo  ========================================
echo        SkillBridge - Starting Up
echo  ========================================
echo.

cd /d "%~dp0"

echo  [1/2] Starting Backend Server (port 5000)...
start "SkillBridge Backend" cmd /k "cd /d "%~dp0" && node server/index.js"

timeout /t 2 /nobreak >nul

echo  [2/2] Starting Frontend (port 3000)...
start "SkillBridge Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

timeout /t 3 /nobreak >nul

echo  [3/3] Opening browser...
start "" "http://localhost:3000"

echo.
echo  All done! Frontend: http://localhost:3000 | Backend: http://localhost:5000
echo.
