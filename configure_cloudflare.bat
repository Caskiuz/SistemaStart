@echo off
echo ============================================================
echo   SISTEMA STAR - Configurar URL de Cloudflare
echo ============================================================
echo.

echo Este script actualiza la URL del backend en el frontend
echo.

REM Pedir URL de Cloudflare
set /p CLOUDFLARE_URL="Ingresa la URL de Cloudflare (ej: https://xxx.trycloudflare.com): "

REM Validar que no esté vacío
if "%CLOUDFLARE_URL%"=="" (
    echo ERROR: Debes ingresar una URL
    pause
    exit /b 1
)

echo.
echo Actualizando frontend\src\api\axios.js con URL: %CLOUDFLARE_URL%/api/
echo.

REM Crear backup
copy frontend\src\api\axios.js frontend\src\api\axios.backup.js >nul
echo Backup creado: axios.backup.js

REM Crear nuevo archivo
(
echo import axios from 'axios';
echo.
echo const api = axios.create^(^{
echo     baseURL: '%CLOUDFLARE_URL%/api/',
echo     headers: { 'Content-Type': 'application/json' },
echo }^)
echo.
echo api.interceptors.request.use^(
echo     ^(config^) =^> ^{
echo         const token = localStorage.getItem^('token'^);
echo         if ^(token^) ^{
echo             config.headers.Authorization = `Bearer ${token}`;
echo         ^}
echo         return config; 
echo     ^},
echo     ^(error^) =^> Promise.reject^(error^)
echo ^);
echo.
echo export default api
) > frontend\src\api\axios.js

echo.
echo ============================================================
echo   CONFIGURACION COMPLETADA
echo ============================================================
echo.
echo URL configurada: %CLOUDFLARE_URL%/api/
echo.
echo Ahora ejecuta: start_servers.bat
echo.
echo Para volver a localhost, restaura el backup:
echo   copy frontend\src\api\axios.backup.js frontend\src\api\axios.js
echo ============================================================
pause
