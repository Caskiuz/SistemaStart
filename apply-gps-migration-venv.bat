@echo off
echo ========================================
echo   APLICANDO MIGRACION GPS
echo ========================================
echo.

echo [1/3] Activando entorno virtual...
call backend\venv\Scripts\activate.bat

echo.
echo [2/3] Verificando migraciones pendientes...
cd backend
python manage.py showmigrations distribution

echo.
echo [3/3] Aplicando migracion GPS...
python manage.py migrate distribution

echo.
echo ========================================
echo   MIGRACION COMPLETADA
echo ========================================
echo.
pause
