@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║     SISTEMA STAR - DEPLOYMENT AUTOMATIZADO                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado
    pause
    exit /b 1
)

REM Ejecutar script Python
python deploy-auto.py

pause
