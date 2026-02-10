# 🚀 DEPLOYMENT AUTOMATIZADO - SISTEMA STAR

## 📋 Descripción

Script automatizado que:
1. ✅ Construye el frontend con la configuración correcta
2. ✅ Levanta el servidor Django (Backend)
3. ✅ Crea túnel Cloudflare para el Backend
4. ✅ Actualiza automáticamente axios.js con la URL del Backend
5. ✅ Reconstruye el frontend con la nueva configuración
6. ✅ Sirve el frontend construido
7. ✅ Crea túnel Cloudflare para el Frontend
8. ✅ Muestra la URL final para compartir con el cliente
9. ✅ Copia la URL al portapapeles automáticamente
10. ✅ Guarda las URLs en un archivo de texto

---

## 🔧 Requisitos Previos

### 1. Instalar Cloudflare Tunnel

**Windows:**
```bash
# Descargar desde:
https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# O con winget:
winget install --id Cloudflare.cloudflared
```

**Linux/Mac:**
```bash
# Homebrew (Mac)
brew install cloudflare/cloudflare/cloudflared

# Debian/Ubuntu
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Instalar Python (si no lo tienes)
- Python 3.8 o superior
- Descargar desde: https://www.python.org/downloads/

### 3. Instalar Node.js (si no lo tienes)
- Node.js 16 o superior
- Descargar desde: https://nodejs.org/

### 4. Instalar pyperclip (opcional, para copiar al portapapeles)
```bash
pip install pyperclip
```

---

## 🚀 Uso

### Opción 1: Script Automático (RECOMENDADO)

**Windows:**
```bash
# Doble clic en:
deploy.bat

# O desde terminal:
deploy.bat
```

**Linux/Mac:**
```bash
python3 deploy-auto.py
```

### Opción 2: Script Manual

**Windows:**
```bash
deploy-cloudflare.bat
```

---

## 📝 Proceso Paso a Paso

### 1. Ejecutar el Script

```bash
deploy.bat
```

### 2. El Script Hará Automáticamente:

```
[1/6] Iniciando servidor Django...
✅ Backend iniciado en http://localhost:8000

[2/6] Creando túnel Cloudflare para Backend...
⏳ Esperando URL del túnel...
✅ Túnel Backend creado: https://xxxxx.trycloudflare.com

[3/6] Actualizando configuración de axios...
✅ axios.js actualizado con: https://xxxxx.trycloudflare.com/api/

[4/6] Construyendo frontend...
✅ Frontend construido exitosamente

[5/6] Iniciando servidor frontend...
✅ Frontend sirviendo en http://localhost:3000

[6/6] Creando túnel Cloudflare para Frontend...
✅ Túnel Frontend creado: https://yyyyy.trycloudflare.com
```

### 3. Resultado Final

```
╔════════════════════════════════════════════════════════════╗
║                    ✅ DEPLOYMENT COMPLETO                  ║
╚════════════════════════════════════════════════════════════╝

📋 RESUMEN:
============================================================

🔧 Backend Local:    http://localhost:8000
🌐 Backend Público:  https://xxxxx.trycloudflare.com

🔧 Frontend Local:   http://localhost:3000
🌐 Frontend Público: https://yyyyy.trycloudflare.com

############################################################
#                                                          #
#  📱 URL PARA COMPARTIR CON EL CLIENTE:                   #
#                                                          #
#  https://yyyyy.trycloudflare.com                        #
#                                                          #
#  ✅ URL copiada al portapapeles                          #
#                                                          #
############################################################

📝 INSTRUCCIONES:
   1. Comparte la URL destacada arriba con tu cliente
   2. El cliente puede acceder desde cualquier dispositivo
   3. El sistema está listo para usar

⚠️  IMPORTANTE:
   - NO cierres este script
   - Las URLs cambian cada vez que reinicias
   - Presiona Ctrl+C para detener todos los servicios

💾 URLs guardadas en: DEPLOYMENT_URLS.txt
```

---

## 📄 Archivo de URLs

El script crea automáticamente un archivo `DEPLOYMENT_URLS.txt` con:

```
SISTEMA STAR - URLs de Deployment
============================================================

Backend Público:  https://xxxxx.trycloudflare.com
Frontend Público: https://yyyyy.trycloudflare.com

Fecha: 2026-01-30 18:30:00
```

---

## 🔄 Flujo Técnico

```
1. Django Backend (Puerto 8000)
   ↓
2. Cloudflare Tunnel → Backend Público
   ↓
3. Capturar URL del Backend
   ↓
4. Actualizar frontend/src/api/axios.js
   ↓
5. npm run build (Frontend)
   ↓
6. Servir frontend/dist (Puerto 3000)
   ↓
7. Cloudflare Tunnel → Frontend Público
   ↓
8. Mostrar URL al usuario
```

---

## ⚠️ Solución de Problemas

### Problema: "cloudflared no está instalado"
**Solución:** Instala Cloudflare Tunnel (ver sección Requisitos)

### Problema: "Python no está instalado"
**Solución:** Instala Python 3.8+ desde python.org

### Problema: "npm run build falló"
**Solución:**
```bash
cd frontend
npm install
npm run build
```

### Problema: "No se capturó la URL automáticamente"
**Solución:** El script te pedirá que ingreses la URL manualmente. Búscala en la ventana del túnel.

### Problema: "Puerto 8000 o 3000 ya está en uso"
**Solución:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

---

## 🛑 Detener los Servicios

### Opción 1: Presionar Ctrl+C en el script

### Opción 2: Cerrar todas las ventanas

### Opción 3: Matar procesos manualmente

**Windows:**
```bash
taskkill /F /IM python.exe
taskkill /F /IM node.exe
taskkill /F /IM cloudflared.exe
```

**Linux/Mac:**
```bash
pkill -f python
pkill -f node
pkill -f cloudflared
```

---

## 📊 Ventajas del Script

✅ **Automatización Total:** Un solo comando para todo
✅ **Sin Configuración Manual:** Actualiza axios.js automáticamente
✅ **URLs Capturadas:** No necesitas buscarlas manualmente
✅ **Portapapeles:** URL copiada automáticamente
✅ **Archivo de Respaldo:** URLs guardadas en archivo de texto
✅ **Fácil de Compartir:** Solo envía la URL al cliente

---

## 🎯 Casos de Uso

### 1. Presentación a Cliente
```bash
deploy.bat
# Comparte la URL destacada
```

### 2. Demo Rápido
```bash
deploy.bat
# Accede desde tu celular con la URL
```

### 3. Testing Remoto
```bash
deploy.bat
# Comparte con tu equipo de testing
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que todos los requisitos estén instalados
2. Revisa la sección de Solución de Problemas
3. Verifica que los puertos 8000 y 3000 estén libres
4. Asegúrate de tener conexión a internet

---

## 📝 Notas Importantes

⚠️ **Las URLs de Cloudflare son temporales**
- Cambian cada vez que reinicias el script
- Son válidas mientras el script esté corriendo
- Para URLs permanentes, considera un dominio propio

⚠️ **Seguridad**
- Las URLs son públicas pero difíciles de adivinar
- Para producción, usa autenticación adicional
- No compartas URLs en lugares públicos

⚠️ **Rendimiento**
- Cloudflare Tunnel puede tener latencia
- Para mejor rendimiento, usa hosting dedicado
- Ideal para demos y presentaciones

---

## 🎉 ¡Listo!

Ahora puedes hacer deployment del Sistema STAR con un solo comando y compartir la URL con tu cliente en segundos.

**¡Buena suerte con tu presentación! 🚀**
