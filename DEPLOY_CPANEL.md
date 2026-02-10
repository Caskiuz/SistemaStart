# Deployment en Hosting Compartido (cPanel)

## ⚠️ IMPORTANTE
Este sistema Django + React NO puede correr completamente en hosting compartido tradicional.
Necesitas dividir el deployment:

---

## PASO 1: Backend Django → PythonAnywhere (GRATIS)

### 1.1 Crear cuenta
- Ve a https://www.pythonanywhere.com
- Crea cuenta gratuita

### 1.2 Subir código
```bash
# En tu computadora
cd backend
pip freeze > requirements.txt

# Comprimir backend
tar -czf backend.tar.gz .
```

### 1.3 En PythonAnywhere
1. Files → Upload → Sube `backend.tar.gz`
2. Bash console:
```bash
tar -xzf backend.tar.gz
mkvirtualenv --python=/usr/bin/python3.10 myenv
pip install -r requirements.txt
```

### 1.4 Configurar Base de Datos
- Usa PostgreSQL de PythonAnywhere (plan pagado)
- O usa MySQL gratuito (requiere cambios en settings.py)

### 1.5 Configurar WSGI
Web → Add new web app → Manual configuration → Python 3.10

Edita `/var/www/tuusuario_pythonanywhere_com_wsgi.py`:
```python
import os
import sys

path = '/home/tuusuario/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 1.6 Configurar settings.py
```python
ALLOWED_HOSTS = ['tuusuario.pythonanywhere.com', 'tudominio.com']
CORS_ALLOWED_ORIGINS = [
    'https://tudominio.com',
]
```

### 1.7 Colectar archivos estáticos
```bash
python manage.py collectstatic
python manage.py migrate
```

**Tu API estará en**: `https://tuusuario.pythonanywhere.com/api/`

---

## PASO 2: Frontend React → cPanel public_html

### 2.1 Configurar API URL
Edita `frontend/src/api/axios.js`:
```javascript
const api = axios.create({
    baseURL: 'https://tuusuario.pythonanywhere.com/api/',
    headers: { 'Content-Type': 'application/json' },
})
```

### 2.2 Build de producción
```bash
cd frontend
npm run build
```

Esto genera carpeta `dist/` con archivos estáticos.

### 2.3 Subir a cPanel
1. Accede a cPanel → File Manager
2. Ve a `public_html/`
3. Sube TODO el contenido de `frontend/dist/`:
   - index.html
   - assets/
   - vite.svg
   - etc.

### 2.4 Configurar .htaccess
Crea `public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Tu frontend estará en**: `https://tudominio.com`

---

## PASO 3: Configurar CORS en Backend

En `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'https://tudominio.com',
    'http://tudominio.com',
]

CSRF_TRUSTED_ORIGINS = [
    'https://tudominio.com',
]
```

---

## ALTERNATIVA COMPLETA: Railway.app (MÁS FÁCIL)

### 1. Preparar proyecto
```bash
# Crear Procfile
echo "web: gunicorn config.wsgi --bind 0.0.0.0:$PORT" > backend/Procfile

# Crear railway.json
echo '{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && python manage.py migrate && gunicorn config.wsgi"
  }
}' > railway.json
```

### 2. Deploy
1. Sube código a GitHub
2. Ve a https://railway.app
3. New Project → Deploy from GitHub
4. Selecciona tu repositorio
5. Agrega PostgreSQL desde Add Service
6. Configura variables de entorno:
   - `DATABASE_URL` (automático)
   - `SECRET_KEY`
   - `ALLOWED_HOSTS`

### 3. Frontend
Railway puede servir el frontend también o usa Vercel/Netlify (gratis).

**Costo**: ~$5/mes con $5 gratis al inicio

---

## Resumen de Costos

| Opción | Backend | Frontend | DB | Costo/mes |
|--------|---------|----------|-----|-----------|
| PythonAnywhere + cPanel | PythonAnywhere | cPanel | MySQL | $0-5 |
| Railway | Railway | Railway | PostgreSQL | $5 |
| Render | Render | Render | PostgreSQL | $0 |
| VPS | VPS | VPS | PostgreSQL | $5-10 |

---

## ⚠️ Limitaciones Hosting Compartido

**NO puedes**:
- Correr Django como servicio
- Usar PostgreSQL (solo MySQL)
- Tener procesos background
- Usar WebSockets
- Instalar paquetes Python globalmente

**Por eso se recomienda PythonAnywhere o Railway para el backend.**
