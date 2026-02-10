@echo off
echo ============================================================
echo   SISTEMA STAR - Iniciar Servidores
echo ============================================================
echo.

echo [1/2] Iniciando Backend Django...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
timeout /t 3 >nul
echo OK - Backend iniciado en http://localhost:8000
echo.

echo [2/2] Iniciando Frontend React...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul
echo OK - Frontend iniciado en http://localhost:5173
echo.

echo ============================================================
echo   SERVIDORES INICIADOS
echo ============================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Abre el navegador en: http://localhost:5173
echo.
echo Para detener: Cierra las ventanas de los servidores
echo ============================================================
pause
