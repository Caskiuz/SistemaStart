# STAR System - Deployment con Cloudflare Tunnel

## Requisitos Previos

1. **Node.js y npm** instalados
2. **Python y Django** configurados
3. **Cloudflared** instalado

### Instalar Cloudflared (si no lo tienes)

```bash
winget install --id Cloudflare.cloudflared
```

O descarga desde: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

## Pasos para Deployment

### Opción 1: Scripts Automáticos (Recomendado)

1. **Construir y levantar servidores:**
   ```bash
   start-production.bat
   ```
   Esto hará:
   - Build del frontend (React + Vite)
   - Iniciar Django en puerto 8000
   - Servir el build en puerto 3000

2. **Crear túneles de Cloudflare:**
   ```bash
   start-tunnels.bat
   ```
   Esto creará 2 túneles:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000

3. **Compartir URLs:**
   - Copia la URL del túnel del **Frontend** (algo como `https://xxxxx.trycloudflare.com`)
   - Compártela con quien necesite acceder al sistema

### Opción 2: Manual

1. **Build del frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Iniciar backend:**
   ```bash
   cd backend
   venv\Scripts\activate
   python manage.py runserver 0.0.0.0:8000
   ```

3. **Servir el build:**
   ```bash
   cd frontend
   npx serve -s dist -l 3000
   ```

4. **Crear túneles (en terminales separadas):**
   ```bash
   cloudflared tunnel --url http://localhost:8000
   cloudflared tunnel --url http://localhost:3000
   ```

## Configuración del Frontend para Producción

Si necesitas cambiar la URL del backend, edita:
`frontend/src/api/axios.js`

```javascript
const api = axios.create({
    baseURL: 'https://tu-backend-tunnel.trycloudflare.com/api/',
    // ...
})
```

## Notas Importantes

- Los túneles de Cloudflare son **temporales** y cambian cada vez que los reinicias
- Para túneles permanentes, necesitas configurar Cloudflare Tunnel con autenticación
- El sistema está configurado para aceptar cualquier origen (CORS_ALLOW_ALL_ORIGINS = True)
- En producción real, deberías usar HTTPS y configurar CORS específicamente

## Troubleshooting

**Error: "cloudflared not found"**
- Instala cloudflared con winget o descárgalo manualmente

**Error: "Port already in use"**
- Cierra los procesos que usan los puertos 3000 u 8000
- O cambia los puertos en los scripts

**Frontend no conecta con Backend**
- Verifica que ambos túneles estén activos
- Actualiza la baseURL en `axios.js` con la URL del túnel del backend

## URLs del Sistema

- **Backend Local:** http://localhost:8000
- **Frontend Local:** http://localhost:3000
- **Backend Tunnel:** Se genera al ejecutar cloudflared
- **Frontend Tunnel:** Se genera al ejecutar cloudflared (esta es la que compartes)
