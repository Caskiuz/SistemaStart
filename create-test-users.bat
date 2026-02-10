@echo off
echo ========================================
echo   CREANDO USUARIOS DE PRUEBA
echo ========================================
echo.

cd backend
call venv\Scripts\activate.bat

python create_test_users.py

echo.
echo ========================================
echo   USUARIOS CREADOS
echo ========================================
echo.
echo Ahora puedes probar el sistema GPS con estos usuarios.
echo Ver GUIA_PRUEBAS_GPS.md para instrucciones detalladas.
echo.
pause
