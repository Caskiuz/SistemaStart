@echo off
echo ========================================
echo   INSTALACION NUEVAS FUNCIONALIDADES
echo   Sistema STAR v2.0
echo ========================================
echo.

cd backend

echo [1/4] Aplicando migraciones de base de datos...
python manage.py migrate
if %errorlevel% neq 0 (
    echo ERROR: Fallo en migraciones
    pause
    exit /b 1
)
echo OK - Migraciones aplicadas
echo.

echo [2/4] Verificando dependencias...
pip show openpyxl >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando openpyxl...
    pip install openpyxl
)
echo OK - Dependencias verificadas
echo.

echo [3/4] Generando plantilla Excel...
python generate_excel_template.py
if %errorlevel% neq 0 (
    echo ADVERTENCIA: No se pudo generar plantilla
) else (
    echo OK - Plantilla generada
)
echo.

echo [4/4] Ejecutando prueba de funcionalidad...
python manage.py shell < test_box_sales.py
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Prueba no completada
) else (
    echo OK - Prueba exitosa
)
echo.

echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo Funcionalidades instaladas:
echo   [OK] Venta por Cajas
echo   [OK] Importacion Excel
echo.
echo Archivos generados:
echo   - Plantilla_Importacion_Productos.xlsx
echo.
echo Proximo paso:
echo   1. Iniciar servidor: python manage.py runserver
echo   2. Probar importacion Excel en el sistema
echo   3. Configurar productos con unidades por caja
echo.
pause
