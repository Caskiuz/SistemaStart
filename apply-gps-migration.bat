@echo off
echo ========================================
echo   APLICANDO MIGRACION GPS
echo ========================================
echo.

cd backend

echo [1/2] Verificando migraciones pendientes...
python manage.py showmigrations distribution

echo.
echo [2/2] Aplicando migracion GPS...
python manage.py migrate distribution

echo.
echo ========================================
echo   MIGRACION COMPLETADA
echo ========================================
echo.
echo Presiona cualquier tecla para salir...
pause > nul
