# 🏢 Sistema STAR - ERP para Distribuidora

Sistema ERP integral para gestión de distribuidora de productos en Santa Cruz, Bolivia. Desarrollado con Django REST Framework + React + PostgreSQL.

## 🚀 Características Principales

### 📦 Gestión de Inventario
- CRUD completo de productos con categorías
- Control de stock en tiempo real (unidades y cajas)
- Venta por unidad o por caja
- Importación masiva desde Excel
- Movimientos de kárdex
- Alertas de stock mínimo
- Ubicación en almacén

### 💰 Ventas y Clientes
- Registro de clientes con geolocalización GPS
- Creación de preventas
- Múltiples canales de venta (Horizontal, Mayorista, Supermercado)
- Historial de ventas por cliente
- Tracking GPS de vendedores en tiempo real

### 🚚 Distribución y Logística
- Creación de rutas de entrega
- Asignación de preventas a repartidores
- Tracking GPS en tiempo real
- Estados de entrega (En camino, Llegado, Completado)
- Gestión de devoluciones

### 📊 Contabilidad
- Liquidación de ventas
- Cuentas por cobrar y por pagar
- Caja chica con categorías de gastos
- Planilla de sueldos
- Resumen financiero
- Tasa de cambio (Bs/USD)
- Reportes de gastos e ingresos

### 👥 Roles de Usuario
- **GERENCIA**: Acceso total al sistema
- **CONTABILIDAD**: Finanzas y liquidaciones
- **VENTAS**: Clientes y preventas
- **ALMACÉN**: Inventario y logística
- **DISTRIBUCIÓN**: Rutas y entregas

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Django 5.2 + Django REST Framework
- **Base de Datos**: PostgreSQL 15
- **Autenticación**: JWT (Simple JWT)
- **Archivos**: Pillow para imágenes
- **Excel**: OpenPyXL para importación/exportación

### Frontend
- **Framework**: React 18 + Vite
- **Estilos**: TailwindCSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Estado**: Context API

## 📋 Requisitos Previos

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- npm o pnpm

## ⚙️ Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/Caskiuz/SistemaStart.git
cd SistemaStart
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env con:
SECRET_KEY=tu-secret-key-aqui
DEBUG=True
DB_NAME=sistema_star_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432

# Crear base de datos PostgreSQL
createdb sistema_star_db

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install
# o
pnpm install

# Iniciar servidor de desarrollo
npm run dev
# o
pnpm dev
```

### 4. Acceder al Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin

## 🔐 Usuarios de Prueba

Después de ejecutar las migraciones, puedes crear usuarios con estos roles:

```python
python manage.py shell

from apps.users.models import User

# Gerencia
User.objects.create_user(
    username='gerente',
    email='gerente@star.com',
    password='password',
    role='GERENCIA'
)

# Ventas
User.objects.create_user(
    username='vendedor',
    email='vendedor@star.com',
    password='password',
    role='VENTAS'
)

# Almacén
User.objects.create_user(
    username='almacenero',
    email='almacenero@star.com',
    password='password',
    role='ALMACEN'
)
```

## 📦 Deployment

### Opción 1: cPanel (Hosting Compartido)

Ver guía completa en el repositorio: `docs/DEPLOYMENT_CPANEL.md`

### Opción 2: Render.com (Recomendado)

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Deploy automático

### Opción 3: Railway.app

1. Conecta desde GitHub
2. Agrega PostgreSQL
3. Configura variables de entorno
4. Deploy automático

## 📁 Estructura del Proyecto

```
SistemaStart/
├── backend/
│   ├── apps/
│   │   ├── accounting/      # Contabilidad
│   │   ├── distribution/    # Distribución
│   │   ├── inventory/       # Inventario
│   │   ├── sales/          # Ventas
│   │   └── users/          # Usuarios
│   ├── core/               # Configuración Django
│   ├── manage.py
│   ├── requirements.txt
│   └── passenger_wsgi.py   # Para cPanel
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Configuración Axios
│   │   ├── components/    # Componentes globales
│   │   ├── features/      # Módulos por funcionalidad
│   │   ├── pages/         # Páginas principales
│   │   └── routes/        # Rutas y protección
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔧 Scripts Útiles

### Backend
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic

# Crear superusuario
python manage.py createsuperuser
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📊 Funcionalidades Destacadas

### Venta por Cajas
- Productos configurables con unidades por caja
- Botones duales: [+ Unidad] [+ Caja]
- Cálculo automático de precio por caja
- Stock mostrado en unidades y cajas

### Importación Excel
- Plantilla descargable
- Validación de datos
- Creación automática de categorías
- Actualización de productos existentes
- Reporte detallado de importación

### GPS Tracking
- Ubicación en tiempo real de vendedores
- Registro de visitas a clientes
- Tracking de repartidores en rutas
- Historial de ubicaciones

### Caja Chica
- Registro de ingresos y gastos
- Categorías: Refrigerio, Transporte, Combustible, etc.
- Integración automática con gastos generales
- Saldo en tiempo real

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso exclusivo para STAR - Santa Cruz, Bolivia.

## 👨‍💻 Autor

Desarrollado por [Caskiuz](https://github.com/Caskiuz)

## 📧 Soporte

Para soporte o consultas, contactar a través de GitHub Issues.

---

⭐ Si este proyecto te fue útil, dale una estrella en GitHub!
