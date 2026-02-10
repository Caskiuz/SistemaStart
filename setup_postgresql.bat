@echo off
echo ========================================
echo    CONFIGURACION DE POSTGRESQL
echo ========================================
echo.
echo Intentando conectar a PostgreSQL...
echo Si te pide contraseña, prueba con:
echo - (vacio - solo presiona Enter)
echo - postgres
echo - admin
echo - password
echo.

echo 1. Listando bases de datos existentes...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -l

echo.
echo 2. Creando base de datos sistema_client_db...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE sistema_client_db;"

echo.
echo 3. Verificando que la base de datos se creo...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -l

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
pause