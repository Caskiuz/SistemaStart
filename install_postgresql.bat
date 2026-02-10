@echo off
echo Descargando PostgreSQL 15...
curl -L -o postgresql-15-windows-x64.exe "https://get.enterprisedb.com/postgresql/postgresql-15.8-1-windows-x64.exe"

echo.
echo Ejecutando instalador de PostgreSQL...
echo IMPORTANTE: Durante la instalacion:
echo 1. Recuerda la contraseña del usuario 'postgres'
echo 2. El puerto por defecto es 5432
echo 3. Acepta las configuraciones por defecto
echo.
pause

postgresql-15-windows-x64.exe

echo.
echo Instalacion completada. Presiona cualquier tecla para continuar...
pause