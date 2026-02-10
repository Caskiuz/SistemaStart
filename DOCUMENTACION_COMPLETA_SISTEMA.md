# 📘 DOCUMENTACIÓN COMPLETA DEL SISTEMA
## Sistema de Gestión Empresarial STAR - Santa Cruz, Bolivia

---

## 📋 ÍNDICE

1. [¿Qué es el Sistema STAR?](#qué-es-el-sistema-star)
2. [Beneficios para su Empresa](#beneficios-para-su-empresa)
3. [Módulos del Sistema](#módulos-del-sistema)
4. [Roles de Usuario](#roles-de-usuario)
5. [Flujo Completo del Sistema](#flujo-completo-del-sistema)
6. [Guía de Uso por Rol](#guía-de-uso-por-rol)
7. [Características Especiales](#características-especiales)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 ¿QUÉ ES EL SISTEMA STAR?

El Sistema STAR es una **plataforma integral de gestión empresarial** diseñada específicamente para empresas distribuidoras en Santa Cruz, Bolivia. Integra todos los procesos de su negocio en una sola aplicación web accesible desde cualquier dispositivo.

### **Problema que Resuelve:**

Antes del Sistema STAR, las empresas enfrentaban:
- ❌ Pérdida de información en papeles y hojas de cálculo
- ❌ Falta de control sobre distribuidores en campo
- ❌ Inventario desactualizado
- ❌ Devoluciones no registradas
- ❌ Imposibilidad de rastrear entregas en tiempo real
- ❌ Reportes manuales que toman horas

### **Solución:**

✅ **Todo digitalizado y en tiempo real**
✅ **Control total de inventario, ventas y distribución**
✅ **Rastreo GPS de distribuidores**
✅ **Reportes automáticos**
✅ **Gestión de devoluciones**
✅ **Acceso desde cualquier lugar**

---

## 💼 BENEFICIOS PARA SU EMPRESA

### **1. AHORRO DE TIEMPO**
- Reducción del 70% en tiempo de generación de reportes
- Automatización de procesos manuales
- Eliminación de papeleo

### **2. CONTROL TOTAL**
- Visibilidad en tiempo real de todas las operaciones
- Rastreo GPS de distribuidores
- Alertas automáticas de stock bajo
- Historial completo de transacciones

### **3. REDUCCIÓN DE PÉRDIDAS**
- Control preciso de inventario
- Registro automático de devoluciones
- Verificación GPS de entregas
- Trazabilidad completa

### **4. MEJOR TOMA DE DECISIONES**
- Reportes en tiempo real
- Estadísticas de ventas por producto
- Análisis de desempeño por vendedor/distribuidor
- Identificación de productos más vendidos

### **5. ESCALABILIDAD**
- Crece con su negocio
- Múltiples usuarios simultáneos
- Sin límite de productos o clientes
- Accesible desde cualquier dispositivo

### **6. GESTIÓN MULTI-MONEDA**
- Soporte para Bolivianos (Bs) y Dólares (USD)
- Tipo de cambio configurable
- Conversión automática en reportes

---

## 🧩 MÓDULOS DEL SISTEMA

### **1. MÓDULO DE USUARIOS Y AUTENTICACIÓN**
**¿Qué hace?**
- Gestión de usuarios con diferentes roles
- Login seguro con tokens JWT
- Control de permisos por rol

**Beneficio:**
Cada empleado solo ve y accede a lo que necesita para su trabajo.

---

### **2. MÓDULO DE INVENTARIO**
**¿Qué hace?**
- Registro de productos con código, nombre, descripción
- Control de stock en tiempo real
- Tres tipos de precios (Horizontal, Mayorista, Moderno)
- Ubicación en almacén
- Imágenes de productos
- Alertas de stock mínimo
- Historial de movimientos

**Beneficio:**
Nunca más se quedará sin stock o tendrá productos vencidos. Sabe exactamente qué tiene, dónde está y cuánto vale.

**Funciones Clave:**
- ✅ Agregar/Editar/Eliminar productos
- ✅ Categorización de productos
- ✅ Stock reservado vs disponible
- ✅ Movimientos de entrada/salida
- ✅ Cálculo automático de cajas

---

### **3. MÓDULO DE VENTAS (PREVENTAS)**
**¿Qué hace?**
- Creación de preventas por vendedores
- Asignación de clientes
- Selección de productos con precios según tipo de cliente
- Cálculo automático de totales
- Estados: Pendiente → Asignado → Confirmado
- Generación de PDF de preventa

**Beneficio:**
Los vendedores registran pedidos en campo desde su celular. La oficina ve todo en tiempo real.

**Funciones Clave:**
- ✅ Crear preventa con múltiples productos
- ✅ Seleccionar tipo de venta (Mayorista/Supermercado/Horizontal)
- ✅ Asignar a distribuidor
- ✅ Reprogramar entregas
- ✅ Cancelar preventas
- ✅ Historial completo

---

### **4. MÓDULO DE CLIENTES**
**¿Qué hace?**
- Registro completo de clientes
- Datos del negocio y dueño
- Ubicación GPS del local
- Foto del negocio
- Historial de compras
- Asignación a vendedor

**Beneficio:**
Base de datos completa de clientes con ubicación exacta para optimizar rutas de entrega.

**Funciones Clave:**
- ✅ Registro con RIF/Cédula
- ✅ Captura de ubicación GPS
- ✅ Foto del local
- ✅ Contacto (teléfono, email)
- ✅ Dirección completa

---

### **5. MÓDULO DE DISTRIBUCIÓN (CORE DEL SISTEMA)**
**¿Qué hace?**
- Creación de hojas de ruta
- Asignación de preventas a distribuidores
- Optimización automática de rutas
- Seguimiento en tiempo real con GPS
- Estados de entrega:
  - 🚗 En Camino
  - 📍 Llegado
  - 📦 Entregando
  - ✅ Entregado
- Registro de devoluciones
- Verificación GPS de proximidad
- Historial de entregas

**Beneficio:**
Control total de sus distribuidores. Sabe dónde están, qué están entregando y si hay problemas.

**Funciones Clave:**
- ✅ Crear rutas maestras
- ✅ Asignar múltiples preventas a una ruta
- ✅ Optimización de orden de entregas
- ✅ Rastreo GPS en tiempo real
- ✅ Registro de devoluciones por producto
- ✅ Justificación de entregas fuera de ubicación
- ✅ Historial completo de entregas
- ✅ Tiempo de entrega por cliente

---

### **6. MÓDULO DE CONTABILIDAD**
**¿Qué hace?**
- Registro automático de ventas confirmadas
- Control de ingresos y egresos
- Gestión de tipo de cambio Bs/USD
- Reportes financieros
- Cuentas por cobrar

**Beneficio:**
Contabilidad automática. Cada venta confirmada se registra automáticamente.

---

### **7. MÓDULO DE GPS Y RASTREO**
**¿Qué hace?**
- Captura de ubicación GPS de distribuidores
- Visualización en mapa en tiempo real
- Historial de ubicaciones
- Verificación de proximidad al cliente
- Alertas de entregas fuera de ubicación

**Beneficio:**
Seguridad y control. Sabe dónde están sus distribuidores y verifica que las entregas sean reales.

---

## 👥 ROLES DE USUARIO

### **1. GERENCIA**
**Acceso Total al Sistema**

**Puede:**
- ✅ Ver todos los módulos
- ✅ Crear usuarios
- ✅ Ver todas las rutas y distribuidores
- ✅ Acceder a reportes completos
- ✅ Monitorear GPS de todos los distribuidores
- ✅ Gestionar inventario
- ✅ Ver contabilidad

**Vista Principal:**
Dashboard con estadísticas generales, acceso a todos los módulos.

---

### **2. ALMACÉN**
**Gestión de Inventario y Distribución**

**Puede:**
- ✅ Gestionar productos (agregar, editar, eliminar)
- ✅ Controlar stock
- ✅ Crear hojas de ruta
- ✅ Asignar preventas a distribuidores
- ✅ Confirmar devoluciones
- ✅ Ver GPS de distribuidores
- ✅ Generar reportes de inventario

**Vista Principal:**
Inventario y gestión de rutas.

---

### **3. VENTAS**
**Creación de Preventas**

**Puede:**
- ✅ Crear preventas
- ✅ Gestionar clientes
- ✅ Ver productos disponibles
- ✅ Capturar ubicación GPS de clientes
- ✅ Ver historial de sus ventas
- ✅ Generar PDF de preventas

**Vista Principal:**
Lista de preventas y formulario de creación.

---

### **4. DISTRIBUCIÓN**
**Ejecución de Entregas**

**Puede:**
- ✅ Ver su ruta asignada
- ✅ Actualizar estados de entrega
- ✅ Registrar devoluciones
- ✅ Activar GPS
- ✅ Ver historial de entregas
- ✅ Confirmar entregas

**Vista Principal:**
Lista de entregas pendientes con botones de acción.

---

## 🔄 FLUJO COMPLETO DEL SISTEMA

### **CICLO DE VENTA COMPLETO**

```
1. VENTAS crea preventa
   ↓
2. ALMACÉN asigna a ruta y distribuidor
   ↓
3. DISTRIBUIDOR recibe ruta en su dispositivo
   ↓
4. DISTRIBUIDOR actualiza estados:
   - En Camino → Llegado → Entregando
   ↓
5. DISTRIBUIDOR registra devoluciones (si hay)
   ↓
6. DISTRIBUIDOR confirma entrega
   ↓
7. SISTEMA verifica GPS (proximidad al cliente)
   ↓
8. SISTEMA actualiza inventario automáticamente
   ↓
9. SISTEMA registra venta en contabilidad
   ↓
10. ALMACÉN confirma devoluciones
    ↓
11. SISTEMA devuelve productos al stock
    ↓
12. GERENCIA ve reportes actualizados
```

---

## 📖 GUÍA DE USO POR ROL

### **GUÍA PARA GERENCIA**

#### **1. Acceso al Sistema**
1. Abrir navegador web
2. Ir a la URL del sistema
3. Ingresar usuario y contraseña
4. Hacer clic en "Iniciar Sesión"

#### **2. Dashboard Principal**
Al iniciar sesión verá:
- Estadísticas generales
- Ventas del día
- Entregas pendientes
- Alertas de stock bajo

#### **3. Crear Usuarios**
1. Clic en "Admin" en la barra superior
2. Clic en "Nuevo Usuario"
3. Llenar formulario:
   - Nombre completo
   - Usuario
   - Contraseña
   - Rol (Ventas/Almacén/Distribución)
4. Guardar

#### **4. Monitorear Distribuidores**
1. Clic en "📍 GPS" en la barra superior
2. Ver mapa con ubicación de todos los distribuidores
3. Hacer clic en marcador para ver detalles:
   - Nombre del distribuidor
   - Ruta asignada
   - Estado actual
   - Última actualización

#### **5. Ver Reportes**
1. Ir a módulo de Reportes
2. Seleccionar tipo:
   - Ventas por período
   - Productos más vendidos
   - Desempeño por vendedor
   - Devoluciones
3. Seleccionar fechas
4. Generar reporte
5. Exportar a PDF/Excel

#### **6. Gestionar Inventario**
1. Ir a "Inventario"
2. Ver lista de productos
3. Opciones:
   - Agregar producto nuevo
   - Editar producto existente
   - Ver movimientos
   - Ajustar stock

---

### **GUÍA PARA ALMACÉN**

#### **1. Gestionar Productos**

**Agregar Producto:**
1. Ir a "Inventario"
2. Clic en "Nuevo Producto"
3. Llenar datos:
   - Código
   - Nombre
   - Categoría
   - Descripción
   - Stock inicial
   - Precio Horizontal
   - Precio Mayorista
   - Precio Moderno
   - Ubicación en almacén
   - Unidades por caja
4. Subir imagen (opcional)
5. Guardar

**Ajustar Stock:**
1. Buscar producto
2. Clic en "Ajustar Stock"
3. Seleccionar tipo:
   - Ingreso (compra, devolución)
   - Egreso (venta, baja)
4. Ingresar cantidad
5. Escribir motivo
6. Confirmar

#### **2. Crear Hoja de Ruta**

1. Ir a "Distribución" o "Rutas"
2. Clic en "Nueva Hoja de Ruta"
3. Seleccionar:
   - Ruta maestra (ej: Ruta Centro)
   - Distribuidor disponible
4. Seleccionar preventas pendientes:
   - Marcar checkbox de cada preventa
   - Ver detalles (cliente, productos, total)
5. Opciones:
   - ✅ Optimizar ruta automáticamente
6. Clic en "Crear Hoja de Ruta"
7. Sistema asigna y notifica al distribuidor

#### **3. Confirmar Devoluciones**

1. Ir a "Devoluciones Pendientes"
2. Ver lista de productos devueltos
3. Para cada devolución:
   - Ver cliente
   - Ver productos y cantidades
   - Ver motivo
4. Verificar físicamente los productos
5. Clic en "Confirmar Recepción"
6. Sistema devuelve productos al stock automáticamente

#### **4. Monitorear Entregas**

1. Ir a "Distribución"
2. Ver lista de rutas activas
3. Seleccionar distribuidor
4. Ver estado de cada entrega:
   - ⏳ Asignado
   - 🚗 En Camino
   - 📍 Llegado
   - 📦 Entregando
   - ✅ Completado

---

### **GUÍA PARA VENTAS**

#### **1. Registrar Cliente Nuevo**

1. Ir a "Clientes"
2. Clic en "Nuevo Cliente"
3. Llenar datos:
   - Nombre del negocio
   - Nombre del dueño
   - RIF o Cédula
   - Teléfono
   - Email (opcional)
   - Dirección completa
4. Capturar ubicación GPS:
   - Clic en "Capturar GPS"
   - Permitir permisos de ubicación
   - Esperar confirmación
5. Tomar foto del negocio (opcional)
6. Guardar

#### **2. Crear Preventa**

1. Ir a "Preventas" o "Nueva Preventa"
2. Seleccionar cliente
3. Seleccionar tipo de venta:
   - Horizontal
   - Mayorista
   - Supermercado/Moderno
4. Agregar productos:
   - Buscar producto
   - Ingresar cantidad
   - Ver precio según tipo de venta
   - Agregar a preventa
5. Repetir para todos los productos
6. Ver total calculado automáticamente
7. Guardar preventa
8. Opciones:
   - Generar PDF
   - Enviar por WhatsApp/Email

#### **3. Ver Mis Preventas**

1. Ir a "Mis Preventas"
2. Ver lista con estados:
   - 🟡 Pendiente (esperando asignación)
   - 🔵 Asignado (en ruta)
   - 🟢 Confirmado (entregado)
   - 🔴 Cancelado
3. Filtrar por:
   - Fecha
   - Cliente
   - Estado
4. Ver detalles de cada preventa

#### **4. Reprogramar Preventa**

1. Buscar preventa
2. Clic en "Reprogramar"
3. Seleccionar nueva fecha
4. Escribir motivo
5. Confirmar
6. Preventa vuelve a estado Pendiente

---

### **GUÍA PARA DISTRIBUCIÓN**

#### **1. Ver Ruta Asignada**

1. Iniciar sesión
2. Automáticamente verá su ruta del día
3. Ver información:
   - Nombre de la ruta
   - Número de entregas
   - Lista de clientes
   - Productos por cliente

#### **2. Activar GPS**

1. En la vista principal
2. Buscar botón "Activar GPS"
3. Permitir permisos de ubicación en el navegador
4. Ver confirmación "GPS Activo"
5. Mantener GPS activo durante toda la ruta

#### **3. Realizar Entrega**

**Paso 1: En Camino**
1. Ver lista de entregas
2. Seleccionar cliente
3. Ver productos a entregar
4. Clic en "🚗 En Camino"
5. Dirigirse al cliente

**Paso 2: Llegado**
1. Al llegar al local del cliente
2. Clic en "📍 Llegado"

**Paso 3: Entregando**
1. Comenzar a descargar productos
2. Clic en "📦 Entregando"
3. Ver lista de productos
4. Si hay devoluciones:
   - Escribir cantidad en campo "🔄 Devolver"
   - Ejemplo: Cliente rechaza 2 unidades de Aceite
   - Escribir "2" en el campo

**Paso 4: Confirmar Entrega**
1. Si NO hay devoluciones:
   - Clic en "✅ ENTREGADO"
2. Si HAY devoluciones:
   - Clic en "🔄 Entrega Parcial"
3. Sistema verifica GPS:
   - Si está cerca del cliente: ✅ Confirma
   - Si está lejos: ⚠️ Pide justificación
4. Entrega completada

#### **4. Ver Historial**

1. Scroll hacia abajo
2. Ver sección "📊 Historial de Entregas"
3. Ver rutas completadas:
   - Fecha y hora
   - Número de entregas
   - Estado

---

## ⭐ CARACTERÍSTICAS ESPECIALES

### **1. VERIFICACIÓN GPS DE ENTREGAS**

**¿Cómo funciona?**
- Cuando el distribuidor confirma una entrega, el sistema verifica su ubicación GPS
- Compara con la ubicación del cliente registrada
- Si está a más de 100 metros, solicita justificación

**Beneficio:**
Evita fraudes y asegura que las entregas sean reales.

---

### **2. GESTIÓN DE DEVOLUCIONES**

**Flujo:**
1. Distribuidor marca productos devueltos durante entrega
2. Sistema registra devolución
3. Almacén ve "Devoluciones Pendientes"
4. Almacén verifica físicamente los productos
5. Almacén confirma recepción
6. Sistema devuelve productos al stock automáticamente

**Beneficio:**
Control total de devoluciones. Nada se pierde.

---

### **3. OPTIMIZACIÓN DE RUTAS**

**¿Cómo funciona?**
- Al crear hoja de ruta, sistema puede optimizar orden de entregas
- Usa algoritmo de distancia más corta
- Considera ubicación GPS de cada cliente

**Beneficio:**
Ahorro de combustible y tiempo. Entregas más eficientes.

---

### **4. MULTI-MONEDA**

**Características:**
- Soporte para Bolivianos (Bs) y Dólares (USD)
- Tipo de cambio configurable por Gerencia
- Toggle en navbar para cambiar vista
- Conversión automática en reportes

**Beneficio:**
Flexibilidad para trabajar con ambas monedas.

---

### **5. REPORTES EN TIEMPO REAL**

**Tipos de Reportes:**
- Ventas por período
- Productos más vendidos
- Desempeño por vendedor
- Desempeño por distribuidor
- Devoluciones
- Inventario valorizado
- Cuentas por cobrar

**Beneficio:**
Toma de decisiones basada en datos reales.

---

## ❓ PREGUNTAS FRECUENTES

### **1. ¿Necesito internet para usar el sistema?**
Sí, el sistema requiere conexión a internet. Es una aplicación web que funciona desde el navegador.

### **2. ¿Funciona en celular?**
Sí, el sistema es responsive y funciona perfectamente en celulares, tablets y computadoras.

### **3. ¿Qué pasa si el distribuidor no tiene GPS?**
El sistema permite entregas sin GPS, pero solicitará justificación. Se recomienda usar dispositivos con GPS para mejor control.

### **4. ¿Puedo tener múltiples usuarios con el mismo rol?**
Sí, puede tener múltiples vendedores, distribuidores, etc.

### **5. ¿Cómo se actualizan los precios?**
Gerencia o Almacén pueden editar productos y actualizar precios en cualquier momento.

### **6. ¿Qué pasa si cancelo una preventa?**
Si la preventa ya fue asignada a ruta, los productos reservados se liberan automáticamente.

### **7. ¿Puedo exportar reportes?**
Sí, los reportes se pueden exportar a PDF y Excel.

### **8. ¿El sistema hace respaldo automático?**
Sí, la base de datos PostgreSQL hace respaldos automáticos. Se recomienda respaldo manual semanal.

### **9. ¿Cuántos productos puedo registrar?**
No hay límite. El sistema escala según sus necesidades.

### **10. ¿Puedo personalizar el logo?**
Sí, el logo se puede cambiar en la configuración del sistema.

---

## 🔧 SOPORTE TÉCNICO

### **Problemas Comunes y Soluciones**

**Problema: No puedo iniciar sesión**
- Verificar usuario y contraseña
- Verificar conexión a internet
- Limpiar caché del navegador
- Contactar a Gerencia para resetear contraseña

**Problema: GPS no funciona**
- Permitir permisos de ubicación en el navegador
- Verificar que el dispositivo tenga GPS activo
- Recargar la página

**Problema: No veo mi ruta asignada**
- Verificar que Almacén haya creado la ruta
- Recargar la página
- Verificar que esté logueado con usuario correcto

**Problema: No puedo confirmar entrega**
- Verificar que esté en estado "Entregando"
- Verificar conexión a internet
- Si está lejos del cliente, proporcionar justificación

---

## 📞 CONTACTO

Para soporte técnico o consultas:
- **Email:** soporte@sistemaestar.com
- **Teléfono:** +591 XXX XXXXX
- **Horario:** Lunes a Viernes, 8:00 AM - 6:00 PM

---

## 📝 NOTAS FINALES

Este sistema fue diseñado específicamente para optimizar las operaciones de su empresa. Cada módulo trabaja en conjunto para proporcionar una solución integral.

**Recomendaciones:**
1. Capacitar a todos los usuarios en su rol específico
2. Mantener datos actualizados (clientes, productos, precios)
3. Revisar reportes semanalmente
4. Hacer respaldos manuales mensualmente
5. Actualizar tipo de cambio regularmente

**El éxito del sistema depende de:**
- Uso constante por todos los usuarios
- Datos precisos y actualizados
- Seguimiento de los procesos establecidos

---

**Versión del Sistema:** 1.0
**Última Actualización:** Enero 2026
**Desarrollado para:** STAR - Santa Cruz, Bolivia

---

© 2026 Sistema STAR. Todos los derechos reservados.
