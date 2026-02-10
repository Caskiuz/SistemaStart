@echo off
echo ========================================
echo   RECONSTRUIR FRONTEND
echo   Actualizando endpoints de API
echo ========================================
echo.

cd frontend

echo [1/2] Limpiando cache y build anterior...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo OK - Cache limpiado
echo.

echo [2/2] Reconstruyendo frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo en build
    pause
    exit /b 1
)
echo OK - Frontend reconstruido
echo.

echo ========================================
echo   RECONSTRUCCION COMPLETADA
echo ========================================
echo.
echo El frontend ha sido actualizado con los nuevos endpoints.
echo.
echo Proximo paso:
echo   1. Reiniciar servidor frontend: npm run dev
echo   2. Verificar que no haya errores 404
echo.
pause
