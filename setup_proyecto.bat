@echo off
echo ========================================
echo    CONFIGURACION DEL PROYECTO SISTEMA
echo ========================================
echo.

echo 1. INSTALANDO POSTGRESQL...
echo Descargando PostgreSQL 15...
curl -L -o postgresql-15-windows-x64.exe "https://get.enterprisedb.com/postgresql/postgresql-15.8-1-windows-x64.exe"

echo.
echo EJECUTANDO INSTALADOR DE POSTGRESQL...
echo IMPORTANTE: Durante la instalacion:
echo - Usuario: postgres
echo - Contraseña: postgres123 (o la que prefieras)
echo - Puerto: 5432
echo - Acepta las configuraciones por defecto
echo.
pause
postgresql-15-windows-x64.exe

echo.
echo 2. CONFIGURANDO BACKEND DJANGO...
cd backend

echo Creando entorno virtual...
python -m venv venv

echo Activando entorno virtual e instalando dependencias...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo 3. CONFIGURANDO BASE DE DATOS...
echo Creando base de datos PostgreSQL...
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE sistema_client_db;"

echo Ejecutando migraciones...
python manage.py migrate

echo Cargando datos iniciales...
python manage.py loaddata backup_total.json

echo.
echo 4. CONFIGURANDO FRONTEND REACT...
cd ..\frontend

echo Instalando dependencias con pnpm...
pnpm install

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Para ejecutar el proyecto:
echo.
echo BACKEND (Django):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo FRONTEND (React):
echo   cd frontend  
echo   pnpm run dev
echo.
echo La aplicacion estara disponible en:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:5173
echo.
pause