# 🧪 GUÍA COMPLETA DE PRUEBAS - SISTEMA GPS STAR

## 📋 USUARIOS DE PRUEBA CREADOS

### 👤 **CREDENCIALES DE ACCESO**

| Rol | Email | Password | Nombre |
|-----|-------|----------|--------|
| **GERENCIA** | gerencia@star.com | star2024 | Luis Alejandro |
| **VENTAS 1** | ventas1@star.com | star2024 | Juan Pérez |
| **VENTAS 2** | ventas2@star.com | star2024 | María González |
| **ALMACEN** | almacen@star.com | star2024 | Carlos Rodríguez |
| **DISTRIBUCION** | distribucion@star.com | star2024 | Pedro Sánchez |
| **CONTABILIDAD** | contabilidad@star.com | star2024 | Ana Martínez |

---

## 🚀 PREPARACIÓN PARA LA DEMOSTRACIÓN

### **1. Iniciar Servidores**

```powershell
# Terminal 1 - Backend
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **2. Crear Usuarios**

```powershell
cd backend
python create_test_users.py
```

---

## 🧪 PRUEBAS DEL SISTEMA GPS

### **PRUEBA 1: RASTREO DE VENDEDORES** 👤

#### **Paso 1: Login como Vendedor**
1. Abrir navegador: http://localhost:5173
2. Login con: `ventas1@star.com` / `star2024`
3. Ir al Dashboard

#### **Paso 2: Activar GPS**
1. Ver widget flotante "📍 Rastreo GPS" (esquina inferior derecha)
2. Hacer clic en botón → **🟢 Activo**
3. Permitir acceso a ubicación cuando aparezca el popup
4. Verificar que aparezcan coordenadas:
   ```
   Latitud: -17.xxxxxx
   Longitud: -63.xxxxxx
   Última actualización: 10:30:45
   ```

#### **Paso 3: Simular Movimiento (Desktop)**
1. Presionar `F12` (DevTools)
2. `Ctrl+Shift+P` → escribir "sensors"
3. Seleccionar "Show Sensors"
4. En pestaña "Sensors" → Location
5. Ingresar coordenadas de Santa Cruz:
   ```
   Latitud: -17.783327
   Longitud: -63.182140
   ```
6. Cambiar coordenadas para simular movimiento

#### **Paso 4: Verificar en Consola**
Deberías ver:
```
📍 Ubicación vendedor enviada: -17.783327, -63.182140
```

---

### **PRUEBA 2: MONITOREO DESDE GERENCIA** 🗺️

#### **Paso 1: Login como Gerencia**
1. Abrir **NUEVA PESTAÑA** (no cerrar la del vendedor)
2. Ir a: http://localhost:5173
3. Login con: `gerencia@star.com` / `star2024`

#### **Paso 2: Abrir Mapa GPS**
1. Hacer clic en **📍 GPS** en navbar
2. Esperar a que cargue el mapa

#### **Paso 3: Verificar Visualización**
Deberías ver:
- 🗺️ Mapa de Santa Cruz, Bolivia
- 🟣 Marcador morado = Vendedor (Juan Pérez)
- Botones de control:
  - **👤 Vendedores** - Mostrar/ocultar
  - **🚚 Distribuidores** - Mostrar/ocultar
  - **🛰️ GPS Real** - Datos reales
  - **🎮 Demo** - Simulación

#### **Paso 4: Interactuar con el Mapa**
1. Hacer clic en marcador morado del vendedor
2. Ver popup con información:
   ```
   👤 Juan Pérez
   ventas1@star.com
   🔴 Trabajando
   📍 -17.7833, -63.1821
   🕗 10:30:45
   ```

#### **Paso 5: Probar Actualización en Tiempo Real**
1. Volver a pestaña del vendedor
2. Cambiar ubicación en DevTools (Sensors)
3. Volver a pestaña de gerencia
4. Esperar 5 segundos
5. Ver que el marcador se actualiza

---

### **PRUEBA 3: MÚLTIPLES VENDEDORES** 👥

#### **Paso 1: Segundo Vendedor**
1. Abrir **NUEVA PESTAÑA**
2. Login con: `ventas2@star.com` / `star2024`
3. Activar GPS Tracker
4. Simular ubicación diferente:
   ```
   Latitud: -17.785000
   Longitud: -63.180000
   ```

#### **Paso 2: Verificar en Gerencia**
1. Volver a pestaña de gerencia
2. Refrescar mapa (esperar 5 segundos)
3. Deberías ver **2 marcadores morados**:
   - Juan Pérez (-17.783327, -63.182140)
   - María González (-17.785000, -63.180000)

---

### **PRUEBA 4: GPS DE DISTRIBUIDORES** 🚚

#### **Paso 1: Crear Ruta (como Gerencia)**
1. Dashboard → Distribución → Panel Logístico
2. Crear hoja de ruta
3. Asignar preventas al distribuidor

#### **Paso 2: Login como Distribuidor**
1. Nueva pestaña
2. Login: `distribucion@star.com` / `star2024`
3. Ver rutas asignadas
4. Activar GPS Tracker

#### **Paso 3: Verificar en Mapa**
1. Volver a gerencia → Mapa GPS
2. Ver marcador **azul** del distribuidor
3. Ver línea de ruta (si hay entregas)
4. Ver marcadores **rojos** de clientes

---

## 🎛️ CONTROLES DEL MAPA GPS

### **Botones Disponibles**

| Botón | Función |
|-------|---------|
| **👤 Vendedores** | Mostrar/ocultar vendedores en el mapa |
| **🚚 Distribuidores** | Mostrar/ocultar distribuidores y rutas |
| **🛰️ GPS Real** | Usar ubicaciones reales del backend |
| **🎮 Demo** | Mostrar simulación con datos de ejemplo |
| **⏸️ Pausar** | Pausar actualización automática |
| **▶️ Reanudar** | Reanudar actualización (cada 5 segundos) |

---

## ✅ CHECKLIST DE VERIFICACIÓN

### **Sistema GPS Vendedores**
- [ ] Widget GPS aparece para rol VENTAS
- [ ] Botón activa/desactiva GPS correctamente
- [ ] Coordenadas se muestran en widget
- [ ] Ubicación se envía al backend (ver consola)
- [ ] Gerencia ve marcador morado en mapa
- [ ] Popup muestra información correcta
- [ ] Actualización automática funciona (5 seg)

### **Sistema GPS Distribuidores**
- [ ] Widget GPS aparece para rol DISTRIBUCION
- [ ] Rutas se crean correctamente
- [ ] Entregas se asignan a distribuidor
- [ ] Gerencia ve marcador azul en mapa
- [ ] Línea de ruta se muestra
- [ ] Puntos de entrega (rojos) aparecen

### **Mapa Gerencia**
- [ ] Mapa carga correctamente
- [ ] Botones de filtro funcionan
- [ ] Toggle GPS Real/Demo funciona
- [ ] Múltiples vendedores se muestran
- [ ] Múltiples distribuidores se muestran
- [ ] Popups muestran información correcta
- [ ] Leyenda muestra contadores correctos

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **Widget GPS no aparece**
✅ Verificar que el usuario tenga rol VENTAS o DISTRIBUCION
✅ Verificar que el componente esté importado en Dashboard

### **Ubicación no se actualiza**
✅ Verificar que el backend esté corriendo
✅ Verificar permisos de ubicación del navegador
✅ Revisar consola del navegador (F12)

### **Mapa no muestra marcadores**
✅ Verificar que haya vendedores con GPS activo
✅ Hacer clic en "🛰️ GPS Real"
✅ Esperar 5 segundos para actualización
✅ Revisar consola: debe mostrar "✅ GPS Real: Cargando rutas reales"

### **Error 403 Forbidden**
✅ Cerrar sesión y volver a iniciar
✅ Verificar que el token no haya expirado
✅ Verificar rol del usuario

---

## 📱 PRUEBA EN MÓVIL (OPCIONAL)

### **Preparación**
1. Obtener IP local:
   ```powershell
   ipconfig
   # Buscar IPv4: 192.168.x.x
   ```

2. Abrir en móvil:
   ```
   http://192.168.x.x:5173
   ```

3. Login como vendedor
4. Activar GPS
5. Caminar y ver actualización en mapa de gerencia

---

## 🎯 ESCENARIOS DE DEMOSTRACIÓN

### **Escenario 1: Control de Vendedores**
1. Gerencia ve que vendedor está en ubicación correcta
2. Vendedor se mueve a otra zona
3. Gerencia ve actualización en tiempo real
4. Verificar que está trabajando

### **Escenario 2: Seguimiento de Entregas**
1. Distribuidor sale con ruta asignada
2. Gerencia ve su ubicación en mapa
3. Distribuidor confirma entregas
4. Gerencia monitorea progreso

### **Escenario 3: Múltiples Usuarios**
1. 2 vendedores activos en diferentes zonas
2. 1 distribuidor con ruta
3. Gerencia ve todos en el mismo mapa
4. Puede filtrar qué ver

---

## 📊 DATOS ESPERADOS

### **En Consola del Navegador (Vendedor)**
```javascript
📍 Ubicación vendedor enviada: -17.783327, -63.182140
```

### **En Consola del Navegador (Gerencia)**
```javascript
✅ GPS Real: Cargando rutas reales del backend
```

### **En Terminal del Backend**
```
POST /api/users/sales-gps/update/ 200
GET /api/users/sales-gps/all/ 200
```

---

## 🎓 NOTAS PARA LA CAPACITACIÓN

1. **Explicar la diferencia**:
   - 🟣 Vendedores = Rastreo de trabajo
   - 🔵 Distribuidores = Seguimiento de entregas

2. **Mostrar controles**:
   - Cómo activar/desactivar GPS
   - Cómo filtrar en el mapa
   - Cómo ver información de cada usuario

3. **Demostrar actualización en tiempo real**:
   - Mover ubicación en una pestaña
   - Ver cambio en otra pestaña

4. **Explicar privacidad**:
   - Solo gerencia ve ubicaciones
   - Usuarios saben que están siendo rastreados
   - Se puede desactivar el GPS

---

**Última actualización**: 30/01/2026
**Versión**: 1.0.0
**Estado**: ✅ Listo para demostración
