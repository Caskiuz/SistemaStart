import os
import shutil
import zipfile
from pathlib import Path

print("=" * 50)
print("PREPARAR DEPLOY PARA cPANEL")
print("=" * 50)
print()

# Verificar carpetas
if not os.path.exists("backend"):
    print("ERROR: No se encuentra la carpeta backend")
    input("Presiona Enter para salir...")
    exit(1)

if not os.path.exists("frontend"):
    print("ERROR: No se encuentra la carpeta frontend")
    input("Presiona Enter para salir...")
    exit(1)

# Crear carpeta deploy
print("PASO 1: Crear carpeta deploy...")
if os.path.exists("deploy"):
    shutil.rmtree("deploy")
os.makedirs("deploy")
print("OK: Carpeta deploy creada")
print()

# Copiar backend
print("PASO 2: Copiar backend...")
backend_temp = "deploy/backend_temp"
shutil.copytree("backend", backend_temp, ignore=shutil.ignore_patterns(
    'venv', '__pycache__', '*.pyc', '.env', 'db.sqlite3', '*.pyo'
))
print(f"OK: Backend copiado")
print()

# Comprimir backend
print("PASO 3: Comprimir backend...")
backend_zip = "deploy/backend_deploy.zip"
with zipfile.ZipFile(backend_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(backend_temp):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, backend_temp)
            zipf.write(file_path, arcname)

# Limpiar temporal
shutil.rmtree(backend_temp)

# Verificar tamaño
size = os.path.getsize(backend_zip)
print(f"OK: backend_deploy.zip creado ({size:,} bytes)")
print()

# Frontend
print("PASO 4: Verificar frontend...")
if not os.path.exists("frontend/dist"):
    print("ADVERTENCIA: No existe frontend/dist/")
    print("Ejecuta: cd frontend && npm run build")
    input("Presiona Enter para continuar sin frontend...")
else:
    print("PASO 5: Comprimir frontend...")
    frontend_zip = "deploy/frontend_deploy.zip"
    with zipfile.ZipFile(frontend_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("frontend/dist"):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, "frontend/dist")
                zipf.write(file_path, arcname)
    
    size = os.path.getsize(frontend_zip)
    print(f"OK: frontend_deploy.zip creado ({size:,} bytes)")
    print()

print("=" * 50)
print("COMPLETADO")
print("=" * 50)
print()
print("Archivos en carpeta deploy/:")
print("  - backend_deploy.zip")
if os.path.exists("deploy/frontend_deploy.zip"):
    print("  - frontend_deploy.zip")
print()
print("Sube a cPanel:")
print("  1. backend_deploy.zip a /home/gstart/backend/")
print("  2. frontend_deploy.zip a /home/gstart/public_html/")
print()
input("Presiona Enter para salir...")
