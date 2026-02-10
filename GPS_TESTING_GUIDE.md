# 🧪 GUÍA COMPLETA DE PRUEBAS GPS

## 🚀 INICIO RÁPIDO

### **1. Ejecutar configuración automática**

```powershell
# Desde: C:\Users\rijar\Proyectos\Sistema_client\Sistema_client
.\setup-gps-test.bat
```

Esto creará:
- ✅ Usuario distribuidor (distribuidor@star.com / distribuidor123)
- ✅ 5 clientes en Santa Cruz
- ✅ 5 preventas con productos
- ✅ 1 ruta GPS con entregas asignadas
- ✅ Batch activo para el distribuidor

---

## 🖥️ PRUEBA EN DESKTOP (Simulación)

### **Terminal 1 - Backend**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### **Terminal 2 - Frontend**
```powershell
cd frontend
npm run dev
```

### **Navegador 1 - DISTRIBUIDOR**

1. **Abrir**: http://localhost:5173
2. **Login**:
   - Email: `distribuidor@star.com`
   - Password: `distribuidor123`
3. **Activar GPS**:
   - Ver widget flotante "📍 GPS Tracker" (esquina inferior derecha)
   - Hacer clic en botón → **🟢 Activo**
   - Permitir ubicación cuando aparezca el popup
4. **Simular movimiento** (DevTools):
   - Presionar F12
   - Ctrl+Shift+P → "Show Sensors"
   - Location → Ingresar coordenadas de Santa Cruz:
     ```
     Latitud: -17.783327
     Longitud: -63.182140
     ```
   - Cambiar coordenadas para simular movimiento

### **Navegador 2 - GERENCIA**

1. **Abrir**: http://localhost:5173 (nueva pestaña/ventana)
2. **Login**:
   - Email: `dev@admin.com`
   - Password: `password`
3. **Ver mapa GPS**:
   - Hacer clic en **📍 GPS** en navbar
   - Toggle **🛰️ GPS Real**
   - Ver marcador del distribuidor en el mapa
   - Hacer clic en marcador para ver información
4. **Verificar actualización**:
   - Cambiar ubicación en navegador del distribuidor
   - Ver actualización en mapa (cada 5 segundos)

---

## 📱 PRUEBA EN MÓVIL (GPS Real)

### **Preparación**

1. **Obtener URL del backend**:
   - Si usas Cloudflare Tunnel: `https://tu-tunnel.trycloudflare.com`
   - Si usas ngrok: `https://tu-id.ngrok.io`
   - Si usas red local: `http://192.168.x.x:8000`

2. **Actualizar frontend**:
   ```javascript
   // frontend/src/api/axios.js
   baseURL: 'https://tu-backend-url/api/'
   ```

3. **Rebuild frontend**:
   ```powershell
   cd frontend
   npm run build
   ```

### **En el Móvil del Distribuidor**

1. **Activar GPS del dispositivo**:
   - Android: Configuración → Ubicación → Activar
   - iOS: Ajustes → Privacidad → Servicios de ubicación → Activar

2. **Abrir app en navegador**:
   - Chrome/Safari → Ir a la URL del frontend
   - Login: `distribuidor@star.com` / `distribuidor123`

3. **Activar GPS Tracker**:
   - Ver widget flotante en esquina inferior derecha
   - Tocar botón para activar
   - Permitir acceso a ubicación
   - Ver coordenadas actuales

4. **Probar movimiento**:
   - Caminar/moverse con el móvil
   - Ver cómo cambian las coordenadas en el widget
   - Cada cambio se envía automáticamente al backend

### **En Desktop/Tablet de Gerencia**

1. **Abrir mapa GPS**:
   - Login como gerencia
   - Ir a 📍 GPS
   - Toggle 🛰️ GPS Real

2. **Monitorear en tiempo real**:
   - Ver marcador del distribuidor moviéndose
   - Actualización cada 5 segundos
   - Ver última actualización en popup

---

## ✅ CHECKLIST DE VERIFICACIÓN

### **Backend**
- [ ] Migración GPS aplicada correctamente
- [ ] Usuario distribuidor creado
- [ ] Ruta y batch creados
- [ ] Preventas asignadas al batch
- [ ] Backend corriendo sin errores

### **Frontend**
- [ ] Frontend corriendo en localhost:5173
- [ ] Login funciona correctamente
- [ ] Widget GPS aparece para distribuidor
- [ ] Mapa GPS aparece para gerencia

### **Permisos**
- [ ] Navegador tiene permiso de ubicación
- [ ] GPS del dispositivo activado (móvil)
- [ ] No hay errores en consola del navegador

### **Funcionalidad GPS**
- [ ] Widget GPS se activa correctamente
- [ ] Coordenadas se muestran en widget
- [ ] Ubicación se envía al backend (ver consola)
- [ ] Mapa muestra marcador del distribuidor
- [ ] Marcador se actualiza cada 5 segundos
- [ ] Popup muestra información correcta

---

## 🔍 VERIFICAR EN CONSOLA

### **Distribuidor (F12)**

Deberías ver:
```
📍 Ubicación enviada: -17.783327, -63.182140
```

Si hay error:
```
❌ Error al enviar ubicación: [mensaje de error]
```

### **Gerencia (F12)**

Deberías ver:
```
✅ GPS Real: Cargando rutas reales del backend
```

O si no hay datos:
```
📦 GPS Demo: Usando datos de ejemplo
```

---

## 🎯 ESCENARIOS DE PRUEBA

### **Escenario 1: GPS Real Básico**
1. Distribuidor activa GPS
2. Gerencia ve ubicación en mapa
3. Distribuidor se mueve
4. Gerencia ve actualización

**Resultado esperado**: ✅ Marcador se mueve en el mapa

### **Escenario 2: Múltiples Distribuidores**
1. Crear segundo distribuidor
2. Asignar ruta al segundo distribuidor
3. Ambos activan GPS
4. Gerencia ve ambos en el mapa

**Resultado esperado**: ✅ Dos marcadores diferentes en el mapa

### **Escenario 3: Toggle GPS Real/Demo**
1. Gerencia en mapa GPS
2. Hacer clic en "🎮 Demo"
3. Ver simulación con 3 distribuidores
4. Hacer clic en "🛰️ GPS Real"
5. Ver distribuidores reales

**Resultado esperado**: ✅ Cambio entre modos funciona

### **Escenario 4: Desactivar GPS**
1. Distribuidor con GPS activo
2. Hacer clic en botón para desactivar
3. Widget muestra "⚪ Inactivo"
4. Gerencia deja de recibir actualizaciones

**Resultado esperado**: ✅ GPS se desactiva correctamente

### **Escenario 5: Reconexión**
1. Distribuidor activa GPS
2. Cerrar navegador
3. Volver a abrir y login
4. Activar GPS nuevamente

**Resultado esperado**: ✅ GPS funciona después de reconectar

---

## 📊 DATOS DE PRUEBA CREADOS

### **Usuario Distribuidor**
```
Email: distribuidor@star.com
Password: distribuidor123
Rol: DISTRIBUCION
Nombre: Juan Pérez
```

### **Clientes (5)**
1. Farmacia San José
2. Supermercado El Triunfo
3. Panadería La Estrella
4. Bodega Don Pedro
5. Restaurante El Sabor

### **Ruta**
```
Nombre: Ruta GPS Santa Cruz Centro
Descripción: Ruta de prueba para sistema GPS
Estado: EN_RUTA
Entregas: 5
```

---

## 🐛 TROUBLESHOOTING

### **Widget GPS no aparece**
- Verificar que el usuario tenga rol DISTRIBUCION
- Verificar que el componente GPSTracker esté importado en Dashboard
- Revisar consola por errores

### **Mapa no muestra distribuidores**
- Verificar que haya batch con status EN_RUTA
- Verificar que el distribuidor tenga GPS activado
- Toggle a modo Demo para verificar que el mapa funciona
- Revisar consola del navegador

### **Ubicación no se actualiza**
- Verificar que el backend esté corriendo
- Verificar que no haya errores 401 (token expirado)
- Verificar que el endpoint update_gps_location funcione
- Probar con Postman/curl

### **Error 403 Forbidden**
- Verificar que el usuario tenga el rol correcto
- Verificar que el token JWT sea válido
- Cerrar sesión y volver a iniciar

---

## 📞 COMANDOS ÚTILES

### **Ver logs del backend**
```powershell
# En la terminal del backend, verás:
# POST /api/distribution/batches/update_gps_location/ 200
# GET /api/distribution/batches/get_all_gps_locations/ 200
```

### **Verificar batch activo**
```python
# En Django shell
python manage.py shell

from apps.distribution.models import DeliveryBatch
batches = DeliveryBatch.objects.filter(status='EN_RUTA')
for b in batches:
    print(f"Batch {b.id}: {b.distributor.email} - GPS: {b.gps_enabled}")
```

### **Verificar ubicación guardada**
```python
# En Django shell
from apps.distribution.models import DeliveryBatch
batch = DeliveryBatch.objects.filter(gps_enabled=True).first()
if batch:
    print(f"Lat: {batch.current_latitude}, Lng: {batch.current_longitude}")
    print(f"Última actualización: {batch.last_gps_update}")
```

---

## ✨ PRÓXIMOS PASOS

Una vez que todo funcione:

1. **Probar en producción** con Cloudflare Tunnel
2. **Crear más distribuidores** para pruebas simultáneas
3. **Probar en diferentes dispositivos** móviles
4. **Documentar cualquier bug** encontrado
5. **Optimizar intervalos** de actualización si es necesario

---

**¡Listo para probar! 🚀**
