@echo off
echo ========================================
echo   APLICANDO MIGRACION GPS VENDEDORES
echo ========================================
echo.

cd backend
call venv\Scripts\activate.bat

echo [1/2] Verificando migraciones...
python manage.py showmigrations users

echo.
echo [2/2] Aplicando migracion...
python manage.py migrate users

echo.
echo ========================================
echo   MIGRACION COMPLETADA
echo ========================================
echo.
pause
