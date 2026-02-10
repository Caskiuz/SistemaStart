# 📍 SISTEMA DE RASTREO GPS - DOCUMENTACIÓN

## 🎯 RESUMEN

El sistema ahora cuenta con **GPS REAL** integrado que permite:
- ✅ Rastreo en tiempo real de distribuidores desde sus móviles
- ✅ Visualización en mapa para gerencia
- ✅ Datos de ejemplo (demo) para pruebas sin GPS
- ✅ Toggle entre modo GPS Real y modo Demo

---

## 🏗️ ARQUITECTURA

### **Backend (Django)**

#### Modelo: `DeliveryBatch`
```python
# Nuevos campos GPS
current_latitude = DecimalField(max_digits=11, decimal_places=8)
current_longitude = DecimalField(max_digits=11, decimal_places=8)
last_gps_update = DateTimeField()
gps_enabled = BooleanField(default=False)
```

#### Endpoints API

1. **POST** `/api/distribution/batches/update_gps_location/`
   - **Rol**: DISTRIBUCION
   - **Función**: Distribuidor envía su ubicación GPS
   - **Body**:
     ```json
     {
       "latitude": -17.783327,
       "longitude": -63.182140
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Ubicación actualizada",
       "data": {
         "latitude": "-17.78332700",
         "longitude": "-63.18214000",
         "timestamp": "2024-01-15T10:30:00Z"
       }
     }
     ```

2. **GET** `/api/distribution/batches/get_all_gps_locations/`
   - **Rol**: GERENCIA
   - **Función**: Obtener todas las ubicaciones GPS activas
   - **Response**:
     ```json
     {
       "success": true,
       "data": [
         {
           "batch_id": 1,
           "distributor_id": 5,
           "distributor_name": "Carlos Rodríguez",
           "route_name": "Ruta Centro",
           "latitude": "-17.783327",
           "longitude": "-63.182140",
           "last_update": "2024-01-15T10:30:00Z",
           "status": "EN_RUTA"
         }
       ],
       "count": 1
     }
     ```

---

### **Frontend (React)**

#### Componentes

1. **GPSTracker.jsx** (Distribuidores)
   - Widget flotante en esquina inferior derecha
   - Botón ON/OFF para activar/desactivar GPS
   - Usa `navigator.geolocation.watchPosition()`
   - Envía ubicación cada vez que cambia
   - Muestra lat/long actual y última actualización

2. **GPSMonitoring.jsx** (Gerencia)
   - Mapa interactivo con Leaflet
   - Toggle "GPS Real" vs "Demo"
   - Actualización automática cada 5 segundos
   - Marcadores de distribuidores con popup de info
   - Marcadores de clientes (puntos de entrega)

#### Servicios

```javascript
// distributionService.js

// Enviar ubicación (distribuidor)
updateGPSLocation(latitude, longitude)

// Obtener todas las ubicaciones (gerencia)
getAllGPSLocations()
```

---

## 🚀 FLUJO DE USO

### **Para Distribuidores (DISTRIBUCION)**

1. Iniciar sesión con rol DISTRIBUCION
2. Ir al Dashboard → Ver rutas asignadas
3. En la esquina inferior derecha aparece el widget "📍 GPS Tracker"
4. Hacer clic en el botón para activar (🟢 Activo)
5. El navegador pedirá permiso para acceder a la ubicación
6. Una vez activado, la ubicación se envía automáticamente al backend
7. El widget muestra:
   - Latitud y longitud actual
   - Última actualización
   - Estado (Activo/Inactivo)

### **Para Gerencia (GERENCIA)**

1. Iniciar sesión con rol GERENCIA
2. Ir a la página `/gps` (📍 GPS en navbar)
3. Ver el mapa con todos los distribuidores activos
4. Toggle entre:
   - **🛰️ GPS Real**: Muestra ubicaciones reales de distribuidores
   - **🎮 Demo**: Muestra datos de ejemplo con simulación
5. Seleccionar distribuidor del dropdown para ver su ruta
6. Ver información en tiempo real:
   - Ubicación actual del distribuidor
   - Puntos de entrega (clientes)
   - Última actualización
   - Clientes atendidos

---

## 🔧 CONFIGURACIÓN

### **Migración de Base de Datos**

```bash
# Aplicar migración para agregar campos GPS
cd backend
python manage.py migrate distribution
```

### **Permisos del Navegador**

Para que funcione el GPS, el navegador debe:
- Tener permisos de geolocalización activados
- Estar en HTTPS (o localhost para desarrollo)
- El usuario debe aceptar el permiso cuando se solicite

### **Coordenadas de Santa Cruz, Bolivia**

```javascript
// Centro de Santa Cruz
const center = [-17.783327, -63.182140];

// Ejemplos de ubicaciones en Santa Cruz
const locations = [
  [-17.783327, -63.182140], // Plaza 24 de Septiembre
  [-17.785000, -63.180000], // Zona Norte
  [-17.790000, -63.185000], // Zona Este
  [-17.780000, -63.190000], // Zona Oeste
];
```

---

## 📱 PRUEBAS

### **Probar GPS Real**

1. **Desde móvil**:
   - Abrir la app en el móvil
   - Iniciar sesión como distribuidor
   - Activar GPS Tracker
   - Caminar/moverse y ver cómo se actualiza

2. **Desde desktop (simulación)**:
   - Abrir DevTools (F12)
   - Ir a "Sensors" o "Location"
   - Cambiar ubicación manualmente
   - Ver actualización en el mapa de gerencia

### **Probar Modo Demo**

1. Ir a `/gps` como gerencia
2. Hacer clic en "🎮 Demo"
3. Ver simulación con 3 distribuidores ficticios
4. Los marcadores se mueven automáticamente

---

## 🐛 TROUBLESHOOTING

### **GPS no funciona en móvil**

- ✅ Verificar que el navegador tenga permisos de ubicación
- ✅ Verificar que el GPS del dispositivo esté activado
- ✅ Verificar que la app esté en HTTPS (no HTTP)
- ✅ Revisar console del navegador para errores

### **Mapa no muestra distribuidores**

- ✅ Verificar que haya rutas con status "EN_RUTA"
- ✅ Verificar que los distribuidores tengan GPS activado
- ✅ Verificar que el backend esté respondiendo correctamente
- ✅ Revisar console: debe mostrar "✅ GPS Real: Cargando rutas reales"

### **Error 403 Forbidden**

- ✅ Verificar que el usuario tenga rol GERENCIA
- ✅ Verificar que el token JWT sea válido
- ✅ Verificar CORS en settings.py

---

## 📊 DATOS DE EJEMPLO

El sistema incluye datos de ejemplo que se muestran cuando:
- No hay rutas reales en el backend
- Se activa el modo "Demo"
- Hay error al cargar datos reales

**Distribuidores de ejemplo**:
1. Carlos Rodríguez - Ruta Centro-Norte
2. María González - Ruta Sur-Este
3. José Martínez - Ruta Oeste

**Ubicaciones simuladas**: Maracay, Venezuela (para demo)
**Ubicaciones reales**: Santa Cruz, Bolivia

---

## 🔐 SEGURIDAD

- ✅ Solo distribuidores pueden enviar su ubicación
- ✅ Solo gerencia puede ver todas las ubicaciones
- ✅ Las ubicaciones se almacenan en la base de datos
- ✅ Se registra timestamp de cada actualización
- ✅ Los datos GPS se transmiten por HTTPS

---

## 📈 MEJORAS FUTURAS

- [ ] Historial de rutas (tracking completo del día)
- [ ] Alertas cuando distribuidor se desvía de la ruta
- [ ] Cálculo de distancia recorrida
- [ ] Tiempo estimado de llegada a cada cliente
- [ ] Notificaciones push cuando distribuidor llega a cliente
- [ ] Exportar rutas a KML/GPX
- [ ] Integración con Google Maps API
- [ ] Modo offline con sincronización posterior

---

## 📞 SOPORTE

Para problemas o dudas:
1. Revisar console del navegador (F12)
2. Revisar logs del backend Django
3. Verificar que la migración se aplicó correctamente
4. Verificar permisos de usuario y roles

---

**Última actualización**: 2024-01-15
**Versión**: 1.0.0
**Estado**: ✅ Producción
