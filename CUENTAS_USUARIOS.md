# CUENTAS DE USUARIO - SISTEMA STAR

## 🔐 Credenciales por Rol

### 👔 GERENCIA (Acceso Total)
```
Usuario: gerente
Contraseña: gerente123
Rol: GERENCIA
```

**Permisos**:
- ✅ Acceso a todos los módulos
- ✅ Dashboard completo con reportes
- ✅ Ventas (crear preventas, clientes)
- ✅ Almacén (inventario, movimientos, devoluciones)
- ✅ Distribución (crear rutas, monitoreo GPS)
- ✅ Contabilidad (liquidaciones, cuentas, planilla, caja chica)
- ✅ Auditoría y seguridad

---

### 💰 CONTABILIDAD
```
Usuario: contador
Contraseña: contador123
Rol: CONTABILIDAD
```

**Permisos**:
- ✅ Liquidación de ventas
- ✅ Cuentas por cobrar
- ✅ Cuentas por pagar
- ✅ Pagos realizados (gastos)
- ✅ Planilla de sueldos
- ✅ Caja chica
- ✅ Tasa de cambio
- ✅ Resumen financiero
- ❌ NO puede crear preventas
- ❌ NO puede gestionar inventario
- ❌ NO puede crear rutas

---

### 🛒 VENTAS
```
Usuario: vendedor
Contraseña: vendedor123
Rol: VENTAS
```

**Permisos**:
- ✅ Ver lista de clientes
- ✅ Registrar nuevos clientes
- ✅ Crear preventas
- ✅ Ver historial de preventas
- ✅ GPS tracking (ubicación en tiempo real)
- ❌ NO puede ver contabilidad
- ❌ NO puede gestionar inventario
- ❌ NO puede crear rutas

---

### 📦 ALMACÉN
```
Usuario: almacenero
Contraseña: almacenero123
Rol: ALMACEN
```

**Permisos**:
- ✅ Gestión de inventario (productos)
- ✅ Movimientos de kárdex
- ✅ Ver preventas pendientes
- ✅ Crear hojas de ruta (logística)
- ✅ Gestionar devoluciones
- ✅ Importar/Exportar Excel
- ❌ NO puede crear preventas
- ❌ NO puede ver contabilidad
- ❌ NO puede ver reportes financieros

---

### 🚚 DISTRIBUCIÓN
```
Usuario: repartidor
Contraseña: repartidor123
Rol: DISTRIBUCION
```

**Permisos**:
- ✅ Ver rutas asignadas
- ✅ Iniciar entregas
- ✅ Marcar estados (En camino, Llegado, Completado)
- ✅ GPS tracking automático
- ✅ Registrar eventos de entrega
- ❌ NO puede crear preventas
- ❌ NO puede ver contabilidad
- ❌ NO puede gestionar inventario
- ❌ NO puede crear rutas

---

## 🌐 URLs de Acceso

### Producción (Cloudflare)
```
Frontend: https://easier-laundry-shape-website.trycloudflare.com
Backend:  https://mechanics-jungle-responded-sent.trycloudflare.com
```

### Local (Desarrollo)
```
Frontend: http://localhost:5173
Backend:  http://localhost:8000
Admin:    http://localhost:8000/admin
```

---

## 📋 Resumen de Roles

| Rol | Ventas | Inventario | Distribución | Contabilidad | Reportes |
|-----|--------|------------|--------------|--------------|----------|
| GERENCIA | ✅ | ✅ | ✅ | ✅ | ✅ |
| CONTABILIDAD | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| VENTAS | ✅ | ❌ | ❌ | ❌ | ❌ |
| ALMACEN | ⚠️ | ✅ | ⚠️ | ❌ | ❌ |
| DISTRIBUCION | ❌ | ❌ | ✅ | ❌ | ❌ |

**Leyenda**:
- ✅ Acceso completo
- ⚠️ Acceso limitado (solo lectura o funciones específicas)
- ❌ Sin acceso

---

## 🔧 Crear Nuevos Usuarios

### Opción 1: Django Admin
1. Accede a: http://localhost:8000/admin
2. Usuario: admin / Contraseña: (la que configuraste)
3. Ve a "Users" → "Add User"
4. Completa los datos y selecciona el rol

### Opción 2: Django Shell
```python
python manage.py shell

from apps.users.models import User

# Crear usuario
User.objects.create_user(
    username='nuevo_usuario',
    password='contraseña123',
    email='usuario@ejemplo.com',
    role='VENTAS'  # GERENCIA, CONTABILIDAD, VENTAS, ALMACEN, DISTRIBUCION
)
```

---

## 🔐 Cambiar Contraseñas

### Django Shell
```python
python manage.py shell

from apps.users.models import User

user = User.objects.get(username='vendedor')
user.set_password('nueva_contraseña')
user.save()
```

### Django Admin
1. Accede a http://localhost:8000/admin
2. Users → Selecciona usuario
3. Cambiar contraseña

---

## 📱 Funcionalidades por Rol

### GERENCIA
- Dashboard con widgets de resumen
- Reportes de ventas y productos
- Auditoría de seguridad
- Acceso a todos los módulos
- Gestión de caja chica
- Configuración de tasa de cambio

### CONTABILIDAD
- Procesar liquidaciones de rutas
- Gestionar cuentas por cobrar/pagar
- Registrar pagos de planilla
- Administrar caja chica
- Ver resumen financiero

### VENTAS
- Registrar clientes con GPS
- Crear preventas
- Ver historial de ventas
- GPS tracking en tiempo real

### ALMACÉN
- Gestionar productos (CRUD)
- Importar/Exportar Excel
- Registrar movimientos de kárdex
- Crear hojas de ruta
- Gestionar devoluciones

### DISTRIBUCIÓN
- Ver rutas asignadas
- Actualizar estados de entrega
- GPS tracking automático
- Registrar eventos de entrega

---

## ⚠️ IMPORTANTE

- **NO compartas estas credenciales públicamente**
- Cambia las contraseñas en producción
- Usa contraseñas seguras (mínimo 8 caracteres, mayúsculas, números, símbolos)
- Revisa los logs de auditoría regularmente
- Desactiva usuarios que ya no trabajan en la empresa

---

## 🆘 Soporte

Si olvidas una contraseña o necesitas crear un nuevo usuario, contacta al administrador del sistema o usa Django Admin con credenciales de superusuario.
