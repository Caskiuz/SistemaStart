# ✅ CHECKLIST DE PRUEBAS - Nuevas Funcionalidades

**Sistema**: STAR v2.0  
**Fecha de Prueba**: _____________  
**Probado por**: _____________

---

## 📦 PRUEBAS: VENTA POR CAJAS

### Configuración Inicial
- [ ] **P1.1**: Producto con `units_per_box = 1` NO muestra botón de caja
- [ ] **P1.2**: Producto con `units_per_box = 12` SÍ muestra botón de caja
- [ ] **P1.3**: Precio por caja se calcula correctamente (precio_unitario × units_per_box)
- [ ] **P1.4**: Stock en cajas se muestra correctamente (stock / units_per_box)

### Agregar al Carrito
- [ ] **P2.1**: Botón "+ Unidad" agrega 1 unidad al carrito
- [ ] **P2.2**: Botón "+ Caja" agrega N unidades al carrito (N = units_per_box)
- [ ] **P2.3**: Precio total se calcula correctamente por unidades agregadas
- [ ] **P2.4**: No permite agregar más unidades que el stock disponible
- [ ] **P2.5**: Muestra mensaje de error si stock insuficiente

### Casos de Prueba Específicos

#### Caso 1: Producto con 12 unidades por caja
```
Producto: Coca Cola 2L
- Precio unitario: Bs. 12.00
- Units per box: 12
- Stock: 240 unidades

Acciones:
1. Clic en "+ Unidad" → Debe agregar 1 ud, total Bs. 12.00
2. Clic en "+ Caja" → Debe agregar 12 uds, total Bs. 156.00 (13 uds × 12)
3. Verificar carrito muestra: 13 unidades
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL

#### Caso 2: Stock limitado
```
Producto: Arroz 1kg
- Units per box: 20
- Stock: 15 unidades

Acciones:
1. Clic en "+ Caja" → Debe mostrar error "Stock insuficiente"
2. Botón "+ Caja" debe estar deshabilitado
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL

#### Caso 3: Confirmación de preventa
```
Carrito:
- 2 cajas de Coca Cola (24 uds) = Bs. 288.00
- 5 unidades de Arroz = Bs. 37.50

Acciones:
1. Confirmar preventa
2. Verificar stock descontado correctamente
3. Verificar preventa creada con cantidades correctas
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL

---

## 📊 PRUEBAS: IMPORTACIÓN EXCEL

### Descarga de Plantilla
- [ ] **E1.1**: Botón "Descargar plantilla" genera archivo Excel
- [ ] **E1.2**: Archivo contiene headers correctos (11 columnas)
- [ ] **E1.3**: Archivo contiene 5 productos de ejemplo
- [ ] **E1.4**: Formato de columnas es correcto

### Importación Exitosa
- [ ] **E2.1**: Modal de importación se abre correctamente
- [ ] **E2.2**: Permite seleccionar archivo .xlsx
- [ ] **E2.3**: Muestra nombre del archivo seleccionado
- [ ] **E2.4**: Botón "Importar" se habilita al seleccionar archivo
- [ ] **E2.5**: Muestra mensaje de progreso "⏳ Importando..."

### Validación de Datos
- [ ] **E3.1**: Importa productos nuevos correctamente
- [ ] **E3.2**: Actualiza productos existentes (mismo código)
- [ ] **E3.3**: Crea categorías automáticamente si no existen
- [ ] **E3.4**: Maneja valores vacíos con defaults (units_per_box = 1)
- [ ] **E3.5**: Muestra errores de filas con datos inválidos

### Casos de Prueba Específicos

#### Caso 1: Importación de 5 productos nuevos
```
Archivo: Plantilla_Importacion_Productos.xlsx (sin modificar)

Resultado esperado:
✅ Importación exitosa:
• 5 productos creados
• 0 productos actualizados
• 0 errores
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL
- [ ] **Productos visibles en inventario**: ✅ SÍ / ❌ NO

#### Caso 2: Actualización de productos existentes
```
Acciones:
1. Importar plantilla (5 productos)
2. Modificar precios en Excel
3. Importar nuevamente

Resultado esperado:
✅ Importación exitosa:
• 0 productos creados
• 5 productos actualizados
• 0 errores
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL
- [ ] **Precios actualizados**: ✅ SÍ / ❌ NO

#### Caso 3: Archivo con errores
```
Acciones:
1. Crear Excel con fila sin código
2. Crear fila con precio negativo
3. Importar archivo

Resultado esperado:
✅ Importación parcial:
• X productos creados
• Y productos actualizados
• 2 errores mostrados
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL
- [ ] **Errores mostrados**: ✅ SÍ / ❌ NO

#### Caso 4: Importación masiva (100+ productos)
```
Acciones:
1. Crear Excel con 100 productos
2. Importar archivo
3. Medir tiempo de importación

Resultado esperado:
- Tiempo < 30 segundos
- Todos los productos importados
- Sistema responde correctamente
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL
- [ ] **Tiempo**: _______ segundos

---

## 🔐 PRUEBAS: PERMISOS Y ROLES

### Rol ALMACEN
- [ ] **R1.1**: Puede ver botón "Importar Excel"
- [ ] **R1.2**: Puede importar productos
- [ ] **R1.3**: Puede editar productos
- [ ] **R1.4**: Puede configurar units_per_box

### Rol VENTAS
- [ ] **R2.1**: NO ve botón "Importar Excel"
- [ ] **R2.2**: Puede crear preventas
- [ ] **R2.3**: Puede usar botones "+ Unidad" y "+ Caja"
- [ ] **R2.4**: NO puede editar productos

### Rol GERENCIA
- [ ] **R3.1**: Puede ver botón "Importar Excel"
- [ ] **R3.2**: Puede importar productos
- [ ] **R3.3**: Puede editar productos
- [ ] **R3.4**: Puede cambiar tipo de venta (canal)

---

## 🎨 PRUEBAS: INTERFAZ DE USUARIO

### Responsive Design
- [ ] **UI1.1**: Modal de importación se ve bien en desktop
- [ ] **UI1.2**: Modal de importación se ve bien en tablet
- [ ] **UI1.3**: Modal de importación se ve bien en móvil
- [ ] **UI1.4**: Botones de caja se adaptan a pantalla pequeña

### Usabilidad
- [ ] **UI2.1**: Botones tienen labels claros ("+ Unidad", "+ Caja")
- [ ] **UI2.2**: Tooltips muestran información útil
- [ ] **UI2.3**: Mensajes de error son claros y descriptivos
- [ ] **UI2.4**: Feedback visual al importar (spinner, progreso)
- [ ] **UI2.5**: Colores distinguen unidad (azul) vs caja (verde)

### Accesibilidad
- [ ] **UI3.1**: Botones tienen tamaño mínimo de 44px (touch-friendly)
- [ ] **UI3.2**: Contraste de colores es adecuado
- [ ] **UI3.3**: Textos son legibles en móvil

---

## 🔄 PRUEBAS: INTEGRACIÓN

### Flujo Completo 1: Carga Inicial
```
1. Generar plantilla Excel
2. Llenar con 20 productos
3. Importar al sistema
4. Verificar productos en inventario
5. Configurar units_per_box en 5 productos
6. Crear preventa usando venta por cajas
7. Confirmar preventa
8. Verificar stock descontado
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL

### Flujo Completo 2: Actualización Masiva
```
1. Exportar productos actuales
2. Modificar precios en Excel
3. Importar archivo modificado
4. Verificar precios actualizados
5. Crear preventa con nuevos precios
6. Verificar cálculos correctos
```
- [ ] **Resultado**: ✅ PASS / ❌ FAIL

---

## 📊 RESUMEN DE PRUEBAS

### Estadísticas
- **Total de pruebas**: 50+
- **Pruebas pasadas**: _____ / _____
- **Pruebas fallidas**: _____ / _____
- **Tasa de éxito**: _____ %

### Problemas Encontrados
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Recomendaciones
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

---

## ✅ APROBACIÓN FINAL

- [ ] Todas las pruebas críticas pasaron
- [ ] No hay bugs bloqueantes
- [ ] Documentación completa
- [ ] Sistema listo para producción

**Aprobado por**: _____________  
**Fecha**: _____________  
**Firma**: _____________

---

**Notas adicionales**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
