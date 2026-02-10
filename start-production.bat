@echo off
echo ========================================
echo   STAR System - Production Build
echo ========================================
echo.

echo [1/3] Building frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Django backend on port 8000...
cd ..\backend
start cmd /k "venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

echo.
echo [3/3] Starting frontend build on port 3000...
cd ..\frontend
start cmd /k "npx serve -s dist -l 3000"

echo.
echo ========================================
echo   Servers started successfully!
echo ========================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.
echo   To create Cloudflare tunnels, run:
echo   cloudflared tunnel --url http://localhost:8000
echo   cloudflared tunnel --url http://localhost:3000
echo ========================================
pause
