# Archivo para subir a /home/gstart/backend/fix_cors.py

SETTINGS_CONTENT = """
# Agregar al inicio de settings.py después de los imports

CORS_ALLOWED_ORIGINS = [
    "https://g-start.online",
    "http://g-start.online",
    "https://www.g-start.online",
    "http://www.g-start.online",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = ['*']

ALLOWED_HOSTS = ['g-start.online', 'www.g-start.online', '199.188.205.52', 'localhost']
"""

print("📝 Copia estas líneas y agrégalas al inicio de /home/gstart/backend/core/settings.py")
print(SETTINGS_CONTENT)
