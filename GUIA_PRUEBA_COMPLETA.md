# ========================================
# GUIA DE PRUEBA COMPLETA DEL SISTEMA
# Tiempo estimado: 10 minutos
# ========================================

## PREPARACION (1 minuto)
1. Tener 3 ventanas del navegador abiertas:
   - Ventana 1: Usuario VENTAS
   - Ventana 2: Usuario ALMACEN/GERENCIA  
   - Ventana 3: Usuario DISTRIBUCION (distribuidor_pedro)

2. Servidor Django corriendo
3. Frontend corriendo (npm run dev)

## ========================================
## PRUEBA 1: CICLO COMPLETO DE VENTA (3 min)
## ========================================

### PASO 1: VENTAS crea preventa (Ventana 1)
1. Login como usuario VENTAS
2. Ir a "Preventas" o "Crear Preventa"
3. Seleccionar cliente
4. Agregar 2-3 productos
5. Guardar preventa
   ✅ Verificar: Preventa creada con status PENDIENTE

### PASO 2: ALMACEN asigna ruta (Ventana 2)
1. Login como ALMACEN o GERENCIA
2. Ir a "Gestión de Rutas" o "Distribución"
3. Seleccionar preventas pendientes
4. Asignar a distribuidor_pedro
5. Seleccionar ruta (ej: "Ruta Centro Comercial")
6. Crear hoja de ruta
   ✅ Verificar: Preventa cambia a ASIGNADO

### PASO 3: DISTRIBUIDOR recibe y completa (Ventana 3)
1. Login como distribuidor_pedro
2. Ver ruta asignada
3. Presionar botones en orden:
   - 🚗 En Camino
   - 📍 Llegado
   - 📦 Entregando
4. Marcar devoluciones (opcional): 
   - Escribir "2" en un producto
5. Presionar:
   - 🔄 Entrega Parcial (si hay devoluciones)
   - ✅ Entrega Completa (si no hay devoluciones)
   ✅ Verificar: Ruta pasa al historial

## ========================================
## PRUEBA 2: GPS EN TIEMPO REAL (2 min)
## ========================================

### PASO 1: Activar GPS (Ventana 3 - Distribuidor)
1. En la vista de distribución, buscar botón GPS
2. Activar GPS
3. Permitir permisos de ubicación
   ✅ Verificar: GPS activo

### PASO 2: Ver ubicación (Ventana 2 - Gerencia)
1. Ir a "📍 GPS" en navbar
2. Ver mapa con ubicación del distribuidor
3. Ver estado de la entrega en tiempo real
   ✅ Verificar: Marcador en mapa con nombre del distribuidor

## ========================================
## PRUEBA 3: DEVOLUCIONES AL ALMACEN (2 min)
## ========================================

### PASO 1: Crear entrega con devoluciones
1. Repetir PRUEBA 1 pero en PASO 3:
2. Marcar devoluciones: "3" unidades de un producto
3. Presionar "🔄 Entrega Parcial"
   ✅ Verificar: Entrega completada

### PASO 2: Almacén confirma devoluciones (Ventana 2)
1. Login como ALMACEN
2. Ir a "Devoluciones Pendientes" o similar
3. Ver productos devueltos
4. Confirmar recepción
   ✅ Verificar: Stock actualizado (+3 unidades)

## ========================================
## PRUEBA 4: VISTA DE GERENCIA (1 min)
## ========================================

### Monitoreo en tiempo real (Ventana 2)
1. Login como GERENCIA
2. Ir a vista de distribución
3. Ver dropdown con todos los distribuidores
4. Cambiar entre distribuidores
5. Ver estado de cada entrega
   ✅ Verificar: Puede ver todas las rutas activas

## ========================================
## PRUEBA 5: HISTORIAL Y REPORTES (1 min)
## ========================================

### Distribuidor (Ventana 3)
1. Ver sección "📊 Historial de Entregas"
2. Ver rutas completadas con:
   - Fecha y hora
   - Número de entregas
   - Estado completado
   ✅ Verificar: Historial visible

### Gerencia (Ventana 2)
1. Ir a reportes o dashboard
2. Ver estadísticas:
   - Ventas del día
   - Entregas completadas
   - Devoluciones
   ✅ Verificar: Datos actualizados

## ========================================
## CASOS ESPECIALES (OPCIONAL)
## ========================================

### REPROGRAMACION
1. Distribuidor en estado "Entregando"
2. Buscar botón "Reprogramar"
3. Seleccionar nueva fecha
4. Escribir motivo
5. Confirmar
   ✅ Verificar: Preventa vuelve a PENDIENTE

### CANCELACION
1. Distribuidor en estado "Entregando"
2. Buscar botón "Cancelar"
3. Confirmar cancelación
   ✅ Verificar: Productos regresan al stock

## ========================================
## CHECKLIST FINAL
## ========================================

✅ Preventa creada por VENTAS
✅ Ruta asignada por ALMACEN
✅ Entrega completada por DISTRIBUIDOR
✅ GPS funcionando en tiempo real
✅ Devoluciones registradas y confirmadas
✅ Historial visible
✅ GERENCIA puede monitorear todo
✅ Stock actualizado correctamente
✅ Reportes generados

## ========================================
## PROBLEMAS COMUNES
## ========================================

❌ "No veo la ruta" → Recargar página
❌ "GPS no funciona" → Permitir permisos en navegador
❌ "Botones deshabilitados" → Verificar estado correcto
❌ "No pasa al historial" → Verificar que servidor esté corriendo

## ========================================
## DATOS DE PRUEBA
## ========================================

Usuarios:
- VENTAS: (tu usuario de ventas)
- ALMACEN: (tu usuario de almacén)
- GERENCIA: (tu usuario de gerencia)
- DISTRIBUCION: distribuidor_pedro

Rutas disponibles:
- Ruta Centro Comercial
- Ruta Norte Industrial
- Ruta GPS Santa Cruz Centro

Clientes: Polar, Caskiuz Business, etc.
Productos: Franela negra, Aceite de coco, etc.
