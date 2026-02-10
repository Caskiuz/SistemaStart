@echo off
echo ========================================
echo   STAR System - Cloudflare Tunnels
echo ========================================
echo.
echo Make sure the production servers are running first!
echo Run start-production.bat if you haven't already.
echo.
pause

echo.
echo [1/2] Creating tunnel for Backend (Django)...
start cmd /k "cloudflared tunnel --url http://localhost:8000"

timeout /t 3 /nobreak >nul

echo.
echo [2/2] Creating tunnel for Frontend (React)...
start cmd /k "cloudflared tunnel --url http://localhost:3000"

echo.
echo ========================================
echo   Tunnels created!
echo ========================================
echo   Check the terminal windows for the URLs
echo   Share the Frontend URL with others
echo ========================================
pause
