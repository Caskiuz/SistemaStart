@echo off
echo ========================================
echo   CONFIGURACION COMPLETA GPS TEST
echo ========================================
echo.

cd backend

echo [1/2] Activando entorno virtual...
call venv\Scripts\activate.bat

echo.
echo [2/2] Ejecutando script de configuracion...
python setup_gps_test.py

echo.
echo ========================================
echo   CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Ahora puedes:
echo   1. Iniciar backend: python manage.py runserver
echo   2. Iniciar frontend: cd ..\frontend ^&^& npm run dev
echo   3. Probar GPS con las credenciales mostradas arriba
echo.
pause
