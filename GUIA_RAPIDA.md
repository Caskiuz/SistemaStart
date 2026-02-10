# 🚀 GUÍA RÁPIDA - Nuevas Funcionalidades

## ⚡ INSTALACIÓN EN 3 PASOS

### 1️⃣ Ejecutar Instalador
```bash
# Doble clic en:
install_features.bat
```
Esto instalará automáticamente todo lo necesario.

### 2️⃣ Iniciar Sistema
```bash
cd backend
python manage.py runserver
```

### 3️⃣ Abrir Frontend
```bash
cd frontend
npm start
```

✅ **¡Listo!** El sistema ya tiene las nuevas funcionalidades.

---

## 📦 USAR VENTA POR CAJAS

### Configurar Producto (1 vez)
1. Ir a **Almacén → Control de Inventario**
2. Clic en ✏️ (editar) en el producto
3. Llenar campo **"Unidades por Caja"** (ej: 12)
4. Guardar

### Vender por Cajas
1. Ir a **Ventas → Crear Preventa**
2. Buscar producto
3. Clic en **+ Caja** (agrega caja completa)
4. O clic en **+ Unidad** (agrega 1 unidad)
5. Confirmar orden

**Ejemplo**:
- Coca Cola 2L: 12 unidades/caja
- Precio: Bs. 12.00/unidad
- **+ Caja** = 12 unidades = Bs. 144.00

---

## 📊 IMPORTAR PRODUCTOS DESDE EXCEL

### Primera Vez (Generar Plantilla)
1. Abrir terminal en carpeta `backend`
2. Ejecutar:
   ```bash
   python generate_excel_template.py
   ```
3. Se crea: `Plantilla_Importacion_Productos.xlsx`

### Llenar Plantilla
1. Abrir archivo Excel
2. Llenar datos de productos:
   - **CÓDIGO**: Único para cada producto (ej: BEB001)
   - **NOMBRE**: Nombre del producto
   - **CATEGORÍA**: Bebidas, Abarrotes, etc.
   - **UBICACIÓN**: Ubicación en almacén (ej: A1-01)
   - **UNIDADES/CAJA**: Cantidad por caja (mínimo 1)
   - **STOCK**: Cantidad en inventario
   - **PRECIOS**: Compra, Horizontal, Mayorista, Moderno
3. Guardar archivo

### Importar al Sistema
1. Iniciar sesión como **ALMACEN** o **GERENCIA**
2. Ir a **Almacén → Control de Inventario**
3. Clic en **📊 Importar Excel**
4. Seleccionar archivo Excel
5. Clic en **📥 Importar Productos**
6. Revisar resultado:
   - ✅ X productos creados
   - ✅ Y productos actualizados
   - ⚠️ Z errores (si hay)

---

## 📋 FORMATO DEL EXCEL

```
┌─────────┬──────────────┬───────────┬───────────┬──────────────┬───────┬──────────┬──────────────┬─────────────┬─────────────┬────────────┐
│ CÓDIGO  │ NOMBRE       │ CATEGORÍA │ UBICACIÓN │ UNIDADES/CAJA│ STOCK │ STOCK MÍN│ PRECIO COMPRA│ P.HORIZONTAL│ P.MAYORISTA │ P. MODERNO │
├─────────┼──────────────┼───────────┼───────────┼──────────────┼───────┼──────────┼──────────────┼─────────────┼─────────────┼────────────┤
│ BEB001  │ Coca Cola 2L │ Bebidas   │ A1-01     │ 12           │ 240   │ 50       │ 8.50         │ 12.00       │ 11.50       │ 11.00      │
│ ABR001  │ Arroz 1kg    │ Abarrotes │ B2-15     │ 20           │ 400   │ 100      │ 5.00         │ 7.50        │ 7.00        │ 6.80       │
└─────────┴──────────────┴───────────┴───────────┴──────────────┴───────┴──────────┴──────────────┴─────────────┴─────────────┴────────────┘
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Qué pasa si importo un producto que ya existe?
✅ Se actualiza automáticamente (usa el CÓDIGO como identificador único)

### ¿Puedo importar productos sin imagen?
✅ Sí, las imágenes se agregan después desde el sistema

### ¿Qué pasa si dejo "UNIDADES/CAJA" vacío?
✅ Se asigna 1 por defecto (venta solo por unidad)

### ¿Puedo vender medio caja?
❌ No, el botón "+ Caja" agrega la caja completa. Para cantidades personalizadas, usar "+ Unidad" varias veces.

### ¿Quién puede importar productos?
👤 Solo usuarios con rol **ALMACEN** o **GERENCIA**

### ¿Cuántos productos puedo importar a la vez?
📊 Sin límite, pero se recomienda máximo 500 por archivo para mejor rendimiento

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "No se proporcionó archivo"
➡️ Asegúrate de seleccionar un archivo antes de hacer clic en "Importar"

### Error: "Fila X: error de formato"
➡️ Verifica que todos los precios sean números positivos y el stock sea entero

### No aparece botón "+ Caja"
➡️ Verifica que el producto tenga `UNIDADES/CAJA > 1`

### Importación muy lenta
➡️ Divide el archivo en varios más pequeños (máx 200 productos por archivo)

---

## 📞 CONTACTO

Si tienes dudas o problemas:
1. Revisa este documento
2. Revisa `NUEVAS_FUNCIONALIDADES.md` (documentación completa)
3. Contacta al equipo de desarrollo

---

## ✅ CHECKLIST ANTES DE USAR

- [ ] Ejecuté `install_features.bat`
- [ ] Servidor Django corriendo
- [ ] Frontend corriendo
- [ ] Generé plantilla Excel
- [ ] Probé importar 2-3 productos
- [ ] Configuré al menos 1 producto con cajas
- [ ] Probé venta por unidad
- [ ] Probé venta por caja

---

**¡Todo listo para usar! 🎉**

Sistema STAR v2.0 - Santa Cruz, Bolivia
