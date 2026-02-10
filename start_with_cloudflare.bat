@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   SISTEMA STAR - Iniciar con Cloudflare Tunnel
echo ============================================================
echo.

REM Verificar si cloudflared está instalado
where cloudflared >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: cloudflared no esta instalado
    echo.
    echo Descarga e instala cloudflared:
    echo https://github.com/cloudflare/cloudflared/releases
    echo.
    echo O usa: winget install --id Cloudflare.cloudflared
    echo.
    pause
    exit /b 1
)

echo [1/4] Iniciando Backend Django...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
timeout /t 5 >nul
echo OK - Backend iniciado en http://localhost:8000
echo.

echo [2/4] Iniciando Cloudflare Tunnel...
echo Espera 10 segundos para obtener la URL publica...
echo.
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:8000 2>&1 | findstr /C:\"trycloudflare.com\""
timeout /t 10 >nul

echo.
echo ============================================================
echo   IMPORTANTE: Copia la URL de Cloudflare
echo ============================================================
echo.
echo En la ventana "Cloudflare Tunnel" busca una linea como:
echo   https://xxxxx-xxx-xxx.trycloudflare.com
echo.
echo Copia esa URL completa (sin /api al final)
echo ============================================================
echo.
set /p TUNNEL_URL="Pega la URL aqui: "

REM Validar que no esté vacío
if "!TUNNEL_URL!"==" " (
    echo ERROR: Debes ingresar la URL de Cloudflare
    pause
    exit /b 1
)

REM Remover espacios y barras finales
set "TUNNEL_URL=!TUNNEL_URL: =!"
if "!TUNNEL_URL:~-1!"=="/" set "TUNNEL_URL=!TUNNEL_URL:~0,-1!"

echo.
echo URL configurada: !TUNNEL_URL!
echo.

echo [3/4] Actualizando Frontend con nueva URL...

REM Crear backup
copy frontend\src\api\axios.js frontend\src\api\axios.backup.js >nul 2>nul

REM Crear nuevo archivo
(
echo import axios from 'axios';
echo.
echo const api = axios.create^({
echo     baseURL: '!TUNNEL_URL!/api/',
echo     headers: { 'Content-Type': 'application/json' },
echo }^)
echo.
echo api.interceptors.request.use^(
echo     ^(config^) =^> {
echo         const token = localStorage.getItem^('token'^);
echo         if ^(token^) {
echo             config.headers.Authorization = `Bearer ${token}`;
echo         }
echo         return config;
echo     },
echo     ^(error^) =^> Promise.reject^(error^)
echo ^);
echo.
echo export default api
) > frontend\src\api\axios.js

echo OK - Frontend actualizado
echo.

echo [4/4] Iniciando Frontend React...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul
echo OK - Frontend iniciado
echo.

echo ============================================================
echo   SERVIDORES INICIADOS CON CLOUDFLARE TUNNEL
echo ============================================================
echo.
echo Backend Local:   http://localhost:8000
echo Backend Publico: !TUNNEL_URL!
echo Frontend Local:  http://localhost:5173
echo.
echo El frontend apunta a: !TUNNEL_URL!/api/
echo.
echo Abre en el navegador: http://localhost:5173
echo.
echo Para detener: Cierra las 3 ventanas (Django, Cloudflare, React)
echo.
echo Para volver a localhost:
echo   copy frontend\src\api\axios.backup.js frontend\src\api\axios.js
echo ============================================================
echo.
pause
