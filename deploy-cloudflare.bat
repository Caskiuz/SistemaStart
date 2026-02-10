@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║     SISTEMA STAR - DEPLOYMENT AUTOMATIZADO                ║
echo ║     Cloudflare Tunnel + Build Automático                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ============================================
REM PASO 1: VERIFICAR DEPENDENCIAS
REM ============================================
echo [1/7] Verificando dependencias...

where cloudflared >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: cloudflared no está instalado
    echo.
    echo Instala Cloudflare Tunnel:
    echo https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
    pause
    exit /b 1
)

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js/npm no está instalado
    pause
    exit /b 1
)

echo ✅ Todas las dependencias están instaladas
echo.

REM ============================================
REM PASO 2: INICIAR BACKEND
REM ============================================
echo [2/7] Iniciando servidor Django...

cd backend
start "Django Backend" cmd /k "venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"
cd ..

timeout /t 5 /nobreak >nul
echo ✅ Backend iniciado en http://localhost:8000
echo.

REM ============================================
REM PASO 3: CREAR TÚNEL BACKEND
REM ============================================
echo [3/7] Creando túnel Cloudflare para Backend...

start "Cloudflare Backend" cmd /k "cloudflared tunnel --url http://localhost:8000"

echo ⏳ Esperando 10 segundos para que el túnel se establezca...
timeout /t 10 /nobreak >nul

REM Capturar URL del backend desde el log
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  IMPORTANTE: Copia la URL del Backend                     ║
echo ║  Busca en la ventana "Cloudflare Backend" la línea:       ║
echo ║  https://xxxxx.trycloudflare.com                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set /p BACKEND_URL="Pega aquí la URL del Backend (sin /api/): "

if "%BACKEND_URL%"=="" (
    echo ❌ ERROR: No se proporcionó URL del backend
    pause
    exit /b 1
)

echo.
echo ✅ URL del Backend capturada: %BACKEND_URL%
echo.

REM ============================================
REM PASO 4: ACTUALIZAR AXIOS CONFIG
REM ============================================
echo [4/7] Actualizando configuración de axios...

REM Crear script Python para actualizar axios.js
echo import re > update_axios.py
echo import sys >> update_axios.py
echo. >> update_axios.py
echo backend_url = sys.argv[1] >> update_axios.py
echo file_path = 'frontend/src/api/axios.js' >> update_axios.py
echo. >> update_axios.py
echo with open(file_path, 'r', encoding='utf-8') as f: >> update_axios.py
echo     content = f.read() >> update_axios.py
echo. >> update_axios.py
echo # Actualizar baseURL >> update_axios.py
echo pattern = r"baseURL:\s*['\"].*?['\"]" >> update_axios.py
echo replacement = f"baseURL: '{backend_url}/api/'" >> update_axios.py
echo content = re.sub(pattern, replacement, content) >> update_axios.py
echo. >> update_axios.py
echo with open(file_path, 'w', encoding='utf-8') as f: >> update_axios.py
echo     f.write(content) >> update_axios.py
echo. >> update_axios.py
echo print(f'✅ axios.js actualizado con: {backend_url}/api/') >> update_axios.py

python update_axios.py "%BACKEND_URL%"
del update_axios.py

echo ✅ Configuración actualizada
echo.

REM ============================================
REM PASO 5: BUILD FRONTEND
REM ============================================
echo [5/7] Construyendo frontend con nueva configuración...

cd frontend
call npm run build

if %errorlevel% neq 0 (
    echo ❌ ERROR: Build del frontend falló
    cd ..
    pause
    exit /b 1
)

cd ..
echo ✅ Frontend construido exitosamente
echo.

REM ============================================
REM PASO 6: SERVIR FRONTEND
REM ============================================
echo [6/7] Iniciando servidor frontend...

start "Frontend Server" cmd /k "npx serve -s frontend/dist -l 3000"

timeout /t 3 /nobreak >nul
echo ✅ Frontend sirviendo en http://localhost:3000
echo.

REM ============================================
REM PASO 7: CREAR TÚNEL FRONTEND
REM ============================================
echo [7/7] Creando túnel Cloudflare para Frontend...

start "Cloudflare Frontend" cmd /k "cloudflared tunnel --url http://localhost:3000"

timeout /t 5 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ✅ DEPLOYMENT COMPLETO                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 RESUMEN:
echo ═══════════════════════════════════════════════════════════
echo.
echo 🔧 Backend Local:    http://localhost:8000
echo 🌐 Backend Público:  %BACKEND_URL%
echo.
echo 🔧 Frontend Local:   http://localhost:3000
echo 🌐 Frontend Público: [Ver ventana "Cloudflare Frontend"]
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 📝 INSTRUCCIONES:
echo.
echo 1. Busca la URL del Frontend en la ventana "Cloudflare Frontend"
echo 2. Comparte esa URL con tu cliente
echo 3. El sistema está listo para usar
echo.
echo ⚠️  IMPORTANTE:
echo    - NO cierres ninguna de las ventanas abiertas
echo    - Las URLs de Cloudflare cambian cada vez que reinicias
echo    - Mantén este script corriendo durante la presentación
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo Presiona cualquier tecla para ver las URLs activas...
pause >nul

echo.
echo 🔍 VERIFICANDO TÚNELES ACTIVOS...
echo.

REM Mostrar procesos activos
echo Servidores corriendo:
tasklist | findstr /i "python.exe node.exe cloudflared.exe" 2>nul

echo.
echo ═══════════════════════════════════════════════════════════
echo Para detener todos los servicios, cierra esta ventana
echo o presiona Ctrl+C
echo ═══════════════════════════════════════════════════════════
echo.

REM Mantener el script corriendo
:loop
timeout /t 60 /nobreak >nul
goto loop
