@echo off
echo Creando base de datos PostgreSQL...
echo.
echo IMPORTANTE: Ingresa la contraseña del usuario 'postgres' cuando se solicite
echo (La contraseña que configuraste durante la instalacion de PostgreSQL)
echo.
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE sistema_client_db;"
echo.
echo Base de datos creada exitosamente!
pause