# 🚀 Sistema STAR v2.0 - Sistema de Gestión Empresarial

**Cliente**: STAR - Santa Cruz, Bolivia  
**Versión**: 2.0  
**Última actualización**: Enero 2025

---

## 🆕 NOVEDADES VERSIÓN 2.0

### ✨ Nuevas Funcionalidades

#### 📦 Venta por Cajas
- Venta de productos por unidad o caja completa
- Cálculo automático de precios por caja
- Control de stock en unidades y cajas
- Botones duales en interfaz de preventas

#### 📊 Importación de Productos por Excel
- Carga masiva de productos desde Excel
- Actualización automática de productos existentes
- Validación de datos antes de importar
- Descarga de plantilla con formato correcto
- Reporte detallado de resultados

**📚 Ver documentación completa**: [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)

---

## 📋 DESCRIPCIÓN DEL SISTEMA

Sistema integral de gestión empresarial que incluye:

- 📦 **Gestión de Inventario**: Control de productos, stock, movimientos
- 💰 **Ventas y Preventas**: Creación de órdenes, gestión de clientes
- 🚚 **Distribución**: Rutas, entregas, GPS tracking
- 💵 **Contabilidad**: Cuentas por cobrar/pagar, gastos, nómina
- 👥 **Usuarios**: Control de acceso por roles (GERENCIA, ALMACEN, VENTAS, DISTRIBUCION)

---

## 🛠️ TECNOLOGÍAS

### Backend
- Python 3.11+
- Django 4.2+
- Django REST Framework
- PostgreSQL
- JWT Authentication
- openpyxl (para Excel)

### Frontend
- React 18+
- Vite
- TailwindCSS
- Axios
- React Router

---

## 🚀 INSTALACIÓN RÁPIDA

### Requisitos Previos
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clonar Repositorio
```bash
git clone [URL_DEL_REPO]
cd Sistema_client
```

### 2. Instalar Nuevas Funcionalidades
```bash
# Ejecutar instalador automático
install_features.bat
```

### 3. Configurar Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos en .env
# DATABASE_URL=postgresql://user:password@localhost:5432/star_db

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 4. Configurar Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Configurar API URL en src/api/axios.js
# baseURL: 'http://localhost:8000/api/'

# Iniciar desarrollo
npm run dev
```

---

## 📚 DOCUMENTACIÓN

### Guías de Usuario
- **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)** - Inicio rápido (5 min)
- **[NUEVAS_FUNCIONALIDADES.md](NUEVAS_FUNCIONALIDADES.md)** - Documentación técnica completa
- **[DOCUMENTACION_COMPLETA_SISTEMA.md](DOCUMENTACION_COMPLETA_SISTEMA.md)** - Manual completo del sistema

### Documentación Técnica
- **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)** - Para gerencia y stakeholders
- **[CHECKLIST_PRUEBAS.md](CHECKLIST_PRUEBAS.md)** - Lista de pruebas QA
- **[INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)** - Índice completo

### Presentaciones
- **[PRESENTACION_CLIENTE.md](PRESENTACION_CLIENTE.md)** - Presentación comercial con ROI

---

## 🎯 USO RÁPIDO

### Venta por Cajas
```bash
1. Configurar producto con unidades por caja
2. Ir a Crear Preventa
3. Clic en "+ Caja" para agregar caja completa
4. O clic en "+ Unidad" para agregar unidad individual
```

### Importación Excel
```bash
1. Generar plantilla: python generate_excel_template.py
2. Llenar datos en Excel
3. Importar desde Control de Inventario
4. Revisar resultados
```

---

## 🔐 ROLES Y PERMISOS

| Rol | Inventario | Ventas | Distribución | Contabilidad | Importar Excel |
|-----|-----------|--------|--------------|--------------|----------------|
| GERENCIA | ✅ | ✅ | ✅ | ✅ | ✅ |
| ALMACEN | ✅ | ❌ | ❌ | ❌ | ✅ |
| VENTAS | 👁️ | ✅ | ❌ | ❌ | ❌ |
| DISTRIBUCION | 👁️ | 👁️ | ✅ | ❌ | ❌ |

---

## 📊 ESTRUCTURA DEL PROYECTO

```
Sistema_client/
│
├── backend/                          # Django Backend
│   ├── apps/
│   │   ├── inventory/               # Gestión de inventario
│   │   ├── sales/                   # Ventas y clientes
│   │   ├── distribution/            # Rutas y entregas
│   │   ├── accounting/              # Contabilidad
│   │   └── users/                   # Autenticación
│   │
│   ├── core/                        # Configuración Django
│   ├── generate_excel_template.py   # 🆕 Generador plantilla
│   ├── test_box_sales.py           # 🆕 Script de prueba
│   └── manage.py
│
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── features/
│   │   │   ├── products/           # 🆕 Importación Excel
│   │   │   ├── presale/            # 🆕 Venta por cajas
│   │   │   ├── distribution/
│   │   │   └── accounting/
│   │   │
│   │   ├── api/                    # Axios config
│   │   └── context/                # React Context
│   │
│   └── package.json
│
├── 📄 Documentación/
│   ├── GUIA_RAPIDA.md
│   ├── RESUMEN_EJECUTIVO.md
│   ├── NUEVAS_FUNCIONALIDADES.md
│   ├── CHECKLIST_PRUEBAS.md
│   ├── PRESENTACION_CLIENTE.md
│   ├── INDICE_DOCUMENTACION.md
│   └── DOCUMENTACION_COMPLETA_SISTEMA.md
│
├── 🔧 Scripts/
│   ├── install_features.bat        # 🆕 Instalador automático
│   ├── deploy-auto.py              # Deployment automático
│   └── *.py                        # Scripts de demo
│
└── README.md                        # Este archivo
```

---

## 🧪 PRUEBAS

### Ejecutar Pruebas Backend
```bash
cd backend
python manage.py test
```

### Ejecutar Pruebas Frontend
```bash
cd frontend
npm test
```

### Verificar Nuevas Funcionalidades
```bash
# Ver CHECKLIST_PRUEBAS.md para lista completa
cd backend
python test_box_sales.py
```

---

## 🚀 DEPLOYMENT

### Desarrollo
```bash
# Backend
cd backend
python manage.py runserver

# Frontend
cd frontend
npm run dev
```

### Producción
```bash
# Usar script automático
python deploy-auto.py

# O manual:
# Backend
python manage.py collectstatic
gunicorn core.wsgi:application

# Frontend
npm run build
# Servir carpeta dist/
```

---

## 📈 ROADMAP

### Versión 2.0 (Actual) ✅
- [x] Venta por cajas
- [x] Importación Excel
- [x] Documentación completa

### Versión 2.1 (Planificada)
- [ ] Importación de imágenes
- [ ] Exportación de preventas a Excel
- [ ] Historial de importaciones
- [ ] Códigos de barras

### Versión 3.0 (Futuro)
- [ ] App móvil nativa
- [ ] Integración con facturación electrónica
- [ ] Dashboard analytics avanzado
- [ ] API pública

---

## 🐛 REPORTE DE BUGS

Para reportar bugs o solicitar funcionalidades:

1. Revisar documentación existente
2. Verificar en [CHECKLIST_PRUEBAS.md](CHECKLIST_PRUEBAS.md)
3. Contactar al equipo de desarrollo

---

## 📞 SOPORTE

- 📧 Email: [tu-email]
- 📱 WhatsApp: [tu-número]
- 🕐 Horario: Lunes a Viernes, 9:00 - 18:00
- 📍 Ubicación: Santa Cruz, Bolivia

---

## 📄 LICENCIA

Propietario: STAR - Santa Cruz, Bolivia  
Todos los derechos reservados © 2025

---

## 👥 EQUIPO DE DESARROLLO

- **Desarrollador Principal**: [Tu Nombre]
- **Cliente**: STAR - Santa Cruz, Bolivia
- **Versión**: 2.0
- **Fecha**: Enero 2025

---

## 🙏 AGRADECIMIENTOS

Gracias al equipo de STAR por su confianza y colaboración en el desarrollo de este sistema.

---

## 📝 CHANGELOG

### v2.0.0 (Enero 2025)
- ✨ Nueva funcionalidad: Venta por cajas
- ✨ Nueva funcionalidad: Importación Excel
- 📚 Documentación completa actualizada
- 🔧 Scripts de instalación y prueba
- 🐛 Correcciones de bugs menores

### v1.0.0 (Diciembre 2024)
- 🎉 Lanzamiento inicial
- ✅ Módulos: Inventario, Ventas, Distribución, Contabilidad
- ✅ Sistema de roles y permisos
- ✅ GPS tracking para distribución

---

**Sistema STAR v2.0** - Gestión Empresarial Integral  
🚀 Llevando tu negocio al siguiente nivel
