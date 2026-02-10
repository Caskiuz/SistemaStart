# 📦 Nuevas Funcionalidades - Sistema STAR

## 1. 🎯 Venta por Cajas

### Descripción
El sistema ahora permite vender productos tanto por unidad como por caja completa, calculando automáticamente precios y rentabilidad.

### Características
- **Doble botón de venta**: Agregar por unidad o por caja
- **Cálculo automático**: El precio por caja se calcula multiplicando precio unitario × unidades por caja
- **Visualización clara**: Muestra stock en unidades y cajas disponibles
- **Control de inventario**: Valida stock disponible antes de agregar cajas completas

### Cómo usar
1. En **Crear Preventa**, busca el producto deseado
2. Verás dos botones:
   - **+ Unidad**: Agrega 1 unidad del producto
   - **+ Caja**: Agrega una caja completa (ej: si la caja tiene 12 unidades, agrega 12)
3. El precio se calcula automáticamente según el tipo de venta
4. El stock se descuenta correctamente al confirmar la preventa

### Ejemplo
```
Producto: Coca Cola 2L
- Precio unitario: Bs. 12.00
- Unidades por caja: 12
- Precio por caja: Bs. 144.00 (12 × 12)
- Stock: 240 unidades (20 cajas)

Al hacer clic en "+ Caja":
- Se agregan 12 unidades al carrito
- Total: Bs. 144.00
```

---

## 2. 📊 Importación de Productos por Excel

### Descripción
Permite cargar múltiples productos al sistema desde un archivo Excel, ideal para la carga inicial de inventario.

### Características
- **Importación masiva**: Carga cientos de productos en segundos
- **Actualización automática**: Si el código ya existe, actualiza el producto
- **Validación de datos**: Verifica formato y datos antes de importar
- **Reporte detallado**: Muestra productos creados, actualizados y errores
- **Plantilla descargable**: Genera archivo Excel con formato correcto

### Formato del Excel

El archivo debe contener las siguientes columnas (en este orden):

| CÓDIGO | NOMBRE | CATEGORÍA | UBICACIÓN | UNIDADES/CAJA | STOCK | STOCK MÍN | PRECIO COMPRA | P. HORIZONTAL | P. MAYORISTA | P. MODERNO |
|--------|--------|-----------|-----------|---------------|-------|-----------|---------------|---------------|--------------|------------|
| PROD001 | Coca Cola 2L | Bebidas | A1-01 | 12 | 240 | 50 | 8.50 | 12.00 | 11.50 | 11.00 |
| PROD002 | Arroz 1kg | Abarrotes | B2-15 | 20 | 400 | 100 | 5.00 | 7.50 | 7.00 | 6.80 |

### Cómo usar

#### Paso 1: Generar plantilla de ejemplo
```bash
cd backend
python generate_excel_template.py
```
Esto creará el archivo `Plantilla_Importacion_Productos.xlsx` con 5 productos de ejemplo.

#### Paso 2: Editar la plantilla
1. Abre el archivo Excel generado
2. Edita los productos de ejemplo o agrega nuevos
3. Mantén el formato de las columnas
4. Asegúrate de que cada CÓDIGO sea único

#### Paso 3: Importar desde el sistema
1. Inicia sesión como **ALMACEN** o **GERENCIA**
2. Ve a **Control de Inventario**
3. Haz clic en **📊 Importar Excel**
4. Selecciona tu archivo Excel
5. Haz clic en **📥 Importar Productos**
6. Revisa el reporte de importación

### Validaciones
- ✅ **CÓDIGO**: Debe ser único (si existe, actualiza el producto)
- ✅ **CATEGORÍA**: Se crea automáticamente si no existe
- ✅ **UNIDADES/CAJA**: Mínimo 1 (por defecto 1 si está vacío)
- ✅ **PRECIOS**: Deben ser números positivos
- ✅ **STOCK**: Debe ser número entero positivo

### Ejemplo de resultado
```
✅ Importación exitosa:
• 45 productos creados
• 12 productos actualizados
• 2 errores (filas con datos incompletos)
```

---

## 3. 🔧 Configuración Técnica

### Backend (Django)
- **Endpoint de importación**: `/api/inventory/products/import_excel/`
- **Endpoint de exportación**: `/api/inventory/products/export_excel/`
- **Librería**: `openpyxl` para manejo de Excel
- **Validación**: Manejo de errores por fila

### Frontend (React)
- **Componente**: `ProductsList.jsx` (modal de importación)
- **Componente**: `CreatePreSale.jsx` (venta por cajas)
- **Validación**: Verificación de stock antes de agregar cajas

### Base de Datos
- **Campo nuevo**: `units_per_box` (PositiveIntegerField, default=1)
- **Propiedades calculadas**:
  - `total_boxes`: Stock total en cajas
  - `price_per_box`: Precio por caja completa

---

## 4. 📝 Notas Importantes

### Venta por Cajas
- El botón de caja solo aparece si `units_per_box > 1`
- El stock se descuenta en unidades, no en cajas
- La rentabilidad se calcula automáticamente por unidad

### Importación Excel
- Solo usuarios con rol **ALMACEN** o **GERENCIA** pueden importar
- Los productos importados se marcan como activos por defecto
- Si hay errores, se muestran las primeras 5 filas con problemas
- La importación no elimina productos existentes

### Recomendaciones
1. **Backup**: Haz respaldo de la base de datos antes de importaciones masivas
2. **Prueba**: Importa primero un archivo pequeño para verificar formato
3. **Códigos únicos**: Usa códigos descriptivos y únicos (ej: BEB001, ABR002)
4. **Ubicaciones**: Define un sistema de ubicación en almacén (ej: A1-01, B2-15)

---

## 5. 🚀 Próximos Pasos

### Para el Cliente
1. Ejecutar migración: `python manage.py migrate`
2. Generar plantilla Excel: `python generate_excel_template.py`
3. Cargar productos iniciales usando importación
4. Configurar `units_per_box` para productos que se venden por caja
5. Capacitar al equipo en uso de venta por cajas

### Mejoras Futuras (Opcional)
- [ ] Importación de imágenes de productos
- [ ] Exportación de preventas a Excel
- [ ] Historial de importaciones
- [ ] Validación avanzada de códigos de barras
- [ ] Importación desde CSV

---

## 6. 📞 Soporte

Si tienes dudas o encuentras algún problema:
1. Revisa los logs del backend: `backend/logs/`
2. Verifica la consola del navegador (F12)
3. Contacta al equipo de desarrollo

---

**Versión**: 2.0  
**Fecha**: Enero 2025  
**Sistema**: STAR - Santa Cruz, Bolivia
