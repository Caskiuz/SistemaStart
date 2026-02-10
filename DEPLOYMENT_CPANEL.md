# 🚀 GUÍA DE DEPLOYMENT EN cPANEL

## ⚠️ REQUISITOS PREVIOS

Tu cPanel debe tener:
- ✅ "Setup Python App" disponible
- ✅ Python 3.8+ instalado
- ✅ PostgreSQL o MySQL
- ✅ Acceso SSH (opcional pero recomendado)

---

## 📦 PASO 1: PREPARAR BACKEND

### 1.1 Comprimir backend
```bash
cd backend
# Excluir venv y archivos innecesarios
zip -r backend.zip . -x "venv/*" "*.pyc" "__pycache__/*" "*.sqlite3"
```

O en Windows:
- Selecciona toda la carpeta `backend` (excepto `venv`)
- Click derecho → Enviar a → Carpeta comprimida
- Renombra a `backend.zip`

---

## 📤 PASO 2: SUBIR BACKEND A cPANEL

### 2.1 Acceder a cPanel
1. Ve a tu cPanel
2. Busca "Administrador de Archivos" (File Manager)
3. Navega a `/home/tuusuario/` (raíz del home)

### 2.2 Subir archivo
1. Click en "Cargar" (Upload)
2. Selecciona `backend.zip`
3. Espera a que termine
4. Click derecho en `backend.zip` → "Extraer" (Extract)
5. Extrae en `/home/tuusuario/backend/`

---

## 🐍 PASO 3: CONFIGURAR PYTHON APP

### 3.1 Crear aplicación Python
1. En cPanel, busca "Setup Python App"
2. Click en "Create Application"
3. Configura:

```
Python version: 3.10 (o la más reciente disponible)
Application root: backend
Application URL: api.tudominio.com (o /api)
Application startup file: passenger_wsgi.py
Application Entry point: application
```

4. Click "Create"

### 3.2 Instalar dependencias
Después de crear la app, cPanel te mostrará comandos. Copia y ejecuta en Terminal SSH:

```bash
source /home/tuusuario/virtualenv/backend/3.10/bin/activate
cd /home/tuusuario/backend
pip install -r requirements.txt
```

Si no tienes SSH, usa el Terminal de cPanel.

---

## 🗄️ PASO 4: CONFIGURAR BASE DE DATOS

### 4.1 Crear base de datos PostgreSQL (si está disponible)
1. En cPanel → "PostgreSQL Databases"
2. Crear base de datos: `sistema_star_db`
3. Crear usuario: `star_user`
4. Asignar usuario a la base de datos

### 4.2 O usar MySQL (alternativa)
1. En cPanel → "MySQL Databases"
2. Crear base de datos: `sistema_star_db`
3. Crear usuario: `star_user`
4. Asignar permisos

### 4.3 Actualizar .env
Edita `/home/tuusuario/backend/.env`:

```env
SECRET_KEY=tu-secret-key-super-segura-aqui
DEBUG=False

# PostgreSQL
DB_NAME=tuusuario_sistema_star_db
DB_USER=tuusuario_star_user
DB_PASSWORD=tu_password_segura
DB_HOST=localhost
DB_PORT=5432

# O MySQL
# DB_ENGINE=django.db.backends.mysql
# DB_PORT=3306
```

**IMPORTANTE**: El nombre real será `tuusuario_sistema_star_db` (cPanel agrega prefijo)

---

## 🔧 PASO 5: MIGRAR BASE DE DATOS

En Terminal SSH o Terminal de cPanel:

```bash
source /home/tuusuario/virtualenv/backend/3.10/bin/activate
cd /home/tuusuario/backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

---

## 🎨 PASO 6: PREPARAR FRONTEND

### 6.1 Build de producción
En tu computadora local:

```bash
cd frontend
npm run build
```

Esto genera la carpeta `dist/`

### 6.2 Actualizar URL del backend
Antes del build, edita `frontend/src/api/axios.js`:

```javascript
const api = axios.create({
    baseURL: 'https://api.tudominio.com/api/',  // Tu URL de cPanel
    headers: { 'Content-Type': 'application/json' },
})
```

### 6.3 Subir frontend a public_html
1. Comprimir carpeta `dist/`
2. En cPanel → Administrador de Archivos
3. Ir a `public_html/`
4. Subir `dist.zip`
5. Extraer contenido directamente en `public_html/`

---

## 🔐 PASO 7: CONFIGURAR DOMINIOS

### 7.1 Backend (API)
1. En cPanel → "Subdominios"
2. Crear: `api.tudominio.com`
3. Document Root: `/home/tuusuario/backend`

### 7.2 Frontend
- Ya está en `public_html/` → `tudominio.com`

### 7.3 Configurar .htaccess para React
Crear `/home/tuusuario/public_html/.htaccess`:

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

---

## ✅ PASO 8: VERIFICAR Y PROBAR

### 8.1 Verificar backend
Visita: `https://api.tudominio.com/admin`

Deberías ver el admin de Django.

### 8.2 Verificar frontend
Visita: `https://tudominio.com`

Deberías ver el login del sistema.

### 8.3 Probar login
Usa las credenciales que creaste con `createsuperuser`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error 500 en backend
```bash
# Ver logs
tail -f /home/tuusuario/logs/error_log

# Verificar permisos
chmod 755 /home/tuusuario/backend
chmod 644 /home/tuusuario/backend/passenger_wsgi.py
```

### Base de datos no conecta
- Verifica que el nombre incluya el prefijo: `tuusuario_nombredb`
- Verifica host: `localhost` o IP del servidor
- Verifica que el usuario tenga permisos

### Frontend no carga
- Verifica que los archivos estén en `public_html/` (no en subcarpeta)
- Verifica que `.htaccess` exista
- Limpia caché del navegador

### CORS errors
En `backend/core/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://tudominio.com',
    'https://www.tudominio.com',
]
```

---

## 📝 CHECKLIST FINAL

- [ ] Backend subido y extraído en `/home/tuusuario/backend/`
- [ ] Python App creada y configurada
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Base de datos creada (PostgreSQL o MySQL)
- [ ] `.env` configurado con credenciales correctas
- [ ] Migraciones ejecutadas (`python manage.py migrate`)
- [ ] Archivos estáticos recolectados (`collectstatic`)
- [ ] Superusuario creado
- [ ] Frontend buildeado (`npm run build`)
- [ ] Frontend subido a `public_html/`
- [ ] `.htaccess` configurado para React
- [ ] Subdominios configurados (api.tudominio.com)
- [ ] ALLOWED_HOSTS actualizado en settings.py
- [ ] CORS configurado correctamente
- [ ] Sistema probado y funcionando

---

## 🆘 SOPORTE

Si algo no funciona:

1. Revisa los logs: `/home/tuusuario/logs/error_log`
2. Verifica Python App status en cPanel
3. Prueba el backend directamente: `https://api.tudominio.com/admin`
4. Verifica la consola del navegador (F12) para errores de frontend

---

## 🔄 ACTUALIZAR EL SISTEMA

Para actualizar después de cambios:

```bash
# Backend
cd /home/tuusuario/backend
source /home/tuusuario/virtualenv/backend/3.10/bin/activate
git pull  # Si usas git
python manage.py migrate
python manage.py collectstatic --noinput
touch tmp/restart.txt  # Reinicia la app

# Frontend
# Hacer build local y subir dist/ nuevamente
```

---

## 💡 TIPS

- Usa SSH para comandos más rápidos
- Mantén backups de la base de datos
- Usa variables de entorno para secretos
- Monitorea los logs regularmente
- Configura SSL (Let's Encrypt gratis en cPanel)
