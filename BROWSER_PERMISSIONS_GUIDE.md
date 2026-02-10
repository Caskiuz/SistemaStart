# 🌐 GUÍA DE PERMISOS DEL NAVEGADOR PARA GPS

## 📱 PERMISOS NECESARIOS

Para que el sistema GPS funcione correctamente, el navegador necesita:
- ✅ Permiso de geolocalización
- ✅ Conexión HTTPS (o localhost para desarrollo)
- ✅ GPS activado en el dispositivo (móvil)

---

## 🖥️ CONFIGURAR PERMISOS EN DESKTOP

### **Google Chrome / Edge**

1. **Permitir ubicación para localhost**:
   - Ir a: `chrome://settings/content/location`
   - En "Permitidos", agregar: `http://localhost:5173`
   - Agregar también: `http://localhost:3000`

2. **Durante la prueba**:
   - Cuando aparezca el popup "Permitir ubicación"
   - Hacer clic en **"Permitir"**
   - Si no aparece, hacer clic en el ícono 🔒 en la barra de direcciones
   - Seleccionar "Configuración del sitio"
   - Cambiar "Ubicación" a **"Permitir"**

3. **Simular ubicación GPS** (para pruebas en desktop):
   - Abrir DevTools (F12)
   - Presionar `Ctrl + Shift + P` (o `Cmd + Shift + P` en Mac)
   - Escribir "sensors" y seleccionar "Show Sensors"
   - En la pestaña "Sensors":
     - Seleccionar "Location"
     - Elegir "Santa Cruz, Bolivia" o ingresar coordenadas:
       - Latitud: `-17.783327`
       - Longitud: `-63.182140`
   - O usar "Other..." para coordenadas personalizadas

### **Firefox**

1. **Permitir ubicación**:
   - Ir a: `about:preferences#privacy`
   - Buscar "Permisos" → "Ubicación" → "Configuración"
   - Agregar `http://localhost:5173` y marcar "Permitir"

2. **Durante la prueba**:
   - Hacer clic en "Permitir" cuando aparezca el popup
   - Si no aparece, hacer clic en el ícono 🔒
   - Seleccionar "Permisos" → "Ubicación" → "Permitir"

---

## 📱 CONFIGURAR PERMISOS EN MÓVIL

### **Android (Chrome)**

1. **Activar GPS del dispositivo**:
   - Configuración → Ubicación → Activar

2. **Permisos del navegador**:
   - Configuración → Aplicaciones → Chrome
   - Permisos → Ubicación → **"Permitir todo el tiempo"** o **"Solo mientras se usa"**

3. **Durante la prueba**:
   - Cuando aparezca el popup, tocar **"Permitir"**
   - Si no funciona:
     - Tocar el ícono 🔒 en la barra de direcciones
     - Permisos → Ubicación → Permitir

### **iOS (Safari)**

1. **Activar Servicios de ubicación**:
   - Ajustes → Privacidad → Servicios de ubicación → Activar

2. **Permisos de Safari**:
   - Ajustes → Safari → Ubicación → **"Preguntar"** o **"Permitir"**

3. **Durante la prueba**:
   - Tocar **"Permitir"** cuando aparezca el popup
   - Si no funciona:
     - Ajustes → Safari → Borrar historial y datos
     - Volver a intentar

---

## 🧪 PROBAR PERMISOS

### **Verificar que el GPS funciona**:

1. Abrir la consola del navegador (F12)
2. Ejecutar este código:

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('✅ GPS funciona!');
    console.log('Latitud:', position.coords.latitude);
    console.log('Longitud:', position.coords.longitude);
  },
  (error) => {
    console.error('❌ Error GPS:', error.message);
  }
);
```

3. **Resultados esperados**:
   - ✅ Si funciona: Verás las coordenadas en la consola
   - ❌ Si falla: Verás un mensaje de error

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error: "User denied Geolocation"**
- **Causa**: Usuario rechazó el permiso
- **Solución**: 
  1. Hacer clic en 🔒 en la barra de direcciones
  2. Cambiar "Ubicación" a "Permitir"
  3. Recargar la página

### **Error: "Geolocation not supported"**
- **Causa**: Navegador muy antiguo o no soporta GPS
- **Solución**: Actualizar navegador o usar Chrome/Firefox moderno

### **Error: "Position unavailable"**
- **Causa**: GPS del dispositivo desactivado
- **Solución**: Activar GPS en configuración del dispositivo

### **Error: "Timeout"**
- **Causa**: GPS tarda mucho en obtener ubicación
- **Solución**: 
  1. Salir al exterior (mejor señal GPS)
  2. Esperar unos segundos
  3. Reiniciar el navegador

### **No aparece el popup de permisos**
- **Causa**: Permiso ya fue denegado anteriormente
- **Solución**:
  1. Chrome: `chrome://settings/content/location`
  2. Buscar el sitio y cambiar a "Permitir"
  3. O borrar datos del sitio y recargar

---

## 🌍 COORDENADAS DE PRUEBA

### **Santa Cruz, Bolivia**:
```
Latitud: -17.783327
Longitud: -63.182140
```

### **Otras ubicaciones en Santa Cruz**:
```
Plaza 24 de Septiembre: -17.783889, -63.182222
Zona Norte: -17.770000, -63.180000
Zona Este: -17.785000, -63.170000
Zona Sur: -17.800000, -63.185000
Zona Oeste: -17.780000, -63.200000
```

---

## 📊 VERIFICAR EN LA APP

### **Como Distribuidor**:
1. Iniciar sesión
2. Ver widget "📍 GPS Tracker" en esquina inferior derecha
3. Hacer clic en botón para activar
4. Debe aparecer popup de permisos → Permitir
5. Widget debe mostrar:
   - 🟢 Activo
   - Latitud y longitud
   - Última actualización

### **Como Gerencia**:
1. Iniciar sesión
2. Ir a 📍 GPS en navbar
3. Toggle "🛰️ GPS Real"
4. Debe aparecer marcador del distribuidor en el mapa
5. Hacer clic en marcador para ver info

---

## 🔐 SEGURIDAD

- ✅ Los permisos solo se solicitan cuando el usuario activa el GPS
- ✅ El usuario puede revocar permisos en cualquier momento
- ✅ La ubicación solo se envía cuando el GPS está activo
- ✅ Solo gerencia puede ver las ubicaciones
- ✅ Los datos se transmiten por HTTPS en producción

---

## 📞 AYUDA ADICIONAL

Si después de seguir estos pasos el GPS no funciona:

1. Verificar en consola del navegador (F12) si hay errores
2. Verificar que el backend esté corriendo
3. Verificar que la migración GPS se aplicó correctamente
4. Probar en modo incógnito (sin extensiones)
5. Probar en otro navegador

---

**Última actualización**: 2024-01-15
