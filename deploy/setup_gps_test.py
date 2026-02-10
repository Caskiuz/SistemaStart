import os
import django
from decimal import Decimal
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User
from apps.sales.models import Client, PreSale, PreSaleItem
from apps.inventory.models import Product
from apps.distribution.models import Route, DeliveryBatch, DeliveryAssignment

print("=" * 60)
print("  🚀 CONFIGURACIÓN COMPLETA DE PRUEBA GPS")
print("=" * 60)
print()

# ============================================
# 1. CREAR USUARIO DISTRIBUIDOR
# ============================================
print("📱 [1/5] Creando usuario distribuidor...")

distribuidor, created = User.objects.get_or_create(
    email='distribuidor@star.com',
    defaults={
        'username': 'distribuidor_gps',
        'first_name': 'Juan',
        'last_name': 'Pérez',
        'role': 'DISTRIBUCION',
        'is_active': True
    }
)

if created:
    distribuidor.set_password('distribuidor123')
    distribuidor.save()
    print(f"   ✅ Distribuidor creado: {distribuidor.email}")
    print(f"   🔑 Password: distribuidor123")
else:
    print(f"   ℹ️  Distribuidor ya existe: {distribuidor.email}")

print()

# ============================================
# 2. VERIFICAR PRODUCTOS
# ============================================
print("📦 [2/5] Verificando productos...")

products = Product.objects.all()[:5]
if products.count() == 0:
    print("   ⚠️  No hay productos. Creando productos de ejemplo...")
    products = []
    for i in range(1, 6):
        product = Product.objects.create(
            name=f'Producto GPS Test {i}',
            description=f'Producto de prueba para GPS {i}',
            price_horizontal=Decimal('50.00'),
            price_vertical=Decimal('45.00'),
            stock=100
        )
        products.append(product)
    print(f"   ✅ {len(products)} productos creados")
else:
    print(f"   ✅ {products.count()} productos disponibles")

print()

# ============================================
# 3. CREAR CLIENTES EN SANTA CRUZ
# ============================================
print("👥 [3/5] Creando clientes en Santa Cruz...")

clientes_data = [
    {
        'business_name': 'Farmacia San José',
        'contact_name': 'María González',
        'phone': '3-3456789',
        'address': 'Av. Cristo Redentor #123, Santa Cruz',
        'rif_cedula': '1234567890'
    },
    {
        'business_name': 'Supermercado El Triunfo',
        'contact_name': 'Carlos Méndez',
        'phone': '3-3567890',
        'address': 'Calle Libertad #456, Santa Cruz',
        'rif_cedula': '2345678901'
    },
    {
        'business_name': 'Panadería La Estrella',
        'contact_name': 'Ana Rodríguez',
        'phone': '3-3678901',
        'address': 'Av. Banzer #789, Santa Cruz',
        'rif_cedula': '3456789012'
    },
    {
        'business_name': 'Bodega Don Pedro',
        'contact_name': 'Pedro Sánchez',
        'phone': '3-3789012',
        'address': 'Calle Sucre #321, Santa Cruz',
        'rif_cedula': '4567890123'
    },
    {
        'business_name': 'Restaurante El Sabor',
        'contact_name': 'Luis Fernández',
        'phone': '3-3890123',
        'address': 'Av. Monseñor Rivero #654, Santa Cruz',
        'rif_cedula': '5678901234'
    }
]

gerencia = User.objects.filter(role='GERENCIA').first()
if not gerencia:
    gerencia = User.objects.filter(role='VENTAS').first()

clientes = []
for data in clientes_data:
    cliente, created = Client.objects.get_or_create(
        rif_cedula=data['rif_cedula'],
        defaults={
            'business_name': data['business_name'],
            'owner_name': data['contact_name'],
            'phone': data['phone'],
            'address': data['address'],
            'seller': gerencia
        }
    )
    clientes.append(cliente)
    if created:
        print(f"   ✅ Cliente creado: {cliente.business_name}")
    else:
        print(f"   ℹ️  Cliente ya existe: {cliente.business_name}")

print()

# ============================================
# 4. CREAR PREVENTAS
# ============================================
print("📋 [4/5] Creando preventas...")

preventas = []
for i, cliente in enumerate(clientes, 1):
    # Verificar si ya existe una preventa pendiente para este cliente
    existing = PreSale.objects.filter(
        client=cliente,
        status='PENDIENTE'
    ).first()
    
    if existing:
        preventas.append(existing)
        print(f"   ℹ️  Preventa ya existe para {cliente.business_name}")
        continue
    
    preventa = PreSale.objects.create(
        client=cliente,
        seller=gerencia,
        status='PENDIENTE',
        total_amount=Decimal('0.00'),
        scheduled_date=datetime.now().date()
    )
    
    # Agregar items
    total = Decimal('0.00')
    for product in products[:3]:
        quantity = 5 + i
        subtotal = product.price_horizontal * quantity
        
        PreSaleItem.objects.create(
            pre_sale=preventa,
            product=product,
            quantity=quantity,
            price_at_sale=product.price_horizontal,
            subtotal=subtotal
        )
        total += subtotal
    
    preventa.total_amount = total
    preventa.save()
    preventas.append(preventa)
    print(f"   ✅ Preventa #{preventa.id} creada para {cliente.business_name} - Total: Bs {total}")

print()

# ============================================
# 5. CREAR RUTA Y ASIGNAR
# ============================================
print("🗺️  [5/5] Creando ruta GPS y asignando entregas...")

# Crear ruta
ruta, created = Route.objects.get_or_create(
    name='Ruta GPS Santa Cruz Centro',
    defaults={
        'description': 'Ruta de prueba para sistema GPS - Zona Centro de Santa Cruz'
    }
)

if created:
    print(f"   ✅ Ruta creada: {ruta.name}")
else:
    print(f"   ℹ️  Ruta ya existe: {ruta.name}")

# Verificar si ya existe un batch activo para este distribuidor
existing_batch = DeliveryBatch.objects.filter(
    distributor=distribuidor,
    status__in=['PREPARACION', 'EN_RUTA']
).first()

if existing_batch:
    batch = existing_batch
    print(f"   ℹ️  Batch activo ya existe: #{batch.id}")
else:
    # Crear batch (despacho)
    batch = DeliveryBatch.objects.create(
        route=ruta,
        distributor=distribuidor,
        status='EN_RUTA',
        gps_enabled=False  # Se activará cuando el distribuidor active el GPS
    )
    print(f"   ✅ Batch creado: #{batch.id}")

# Asignar preventas al batch
assignments_created = 0
for i, preventa in enumerate(preventas, 1):
    # Verificar si ya está asignada
    existing_assignment = DeliveryAssignment.objects.filter(
        presale=preventa
    ).first()
    
    if existing_assignment:
        print(f"   ℹ️  Preventa #{preventa.id} ya está asignada")
        continue
    
    DeliveryAssignment.objects.create(
        batch=batch,
        presale=preventa,
        order_in_route=i
    )
    
    # Actualizar estado de preventa
    preventa.status = 'ASIGNADO'
    preventa.distributor = distribuidor
    preventa.save()
    
    assignments_created += 1
    print(f"   ✅ Preventa #{preventa.id} asignada (Parada #{i})")

print()
print("=" * 60)
print("  ✅ CONFIGURACIÓN COMPLETADA")
print("=" * 60)
print()
print("📱 CREDENCIALES DE ACCESO:")
print("-" * 60)
print("  👤 GERENCIA:")
print("     Email: dev@admin.com")
print("     Password: password")
print()
print("  🚚 DISTRIBUIDOR:")
print(f"     Email: {distribuidor.email}")
print("     Password: distribuidor123")
print()
print("=" * 60)
print("🗺️  INFORMACIÓN DE LA RUTA:")
print("-" * 60)
print(f"  Ruta: {ruta.name}")
print(f"  Batch ID: {batch.id}")
print(f"  Distribuidor: {distribuidor.get_full_name()}")
print(f"  Estado: {batch.status}")
print(f"  Entregas asignadas: {batch.deliveries.count()}")
print()
print("=" * 60)
print("🧪 PASOS PARA PROBAR:")
print("-" * 60)
print("  1. Iniciar sesión como DISTRIBUIDOR")
print("     → Activar GPS Tracker (widget flotante)")
print("     → Aceptar permisos de ubicación")
print()
print("  2. Iniciar sesión como GERENCIA (otra pestaña)")
print("     → Ir a 📍 GPS en navbar")
print("     → Toggle '🛰️ GPS Real'")
print("     → Ver ubicación del distribuidor en tiempo real")
print()
print("  3. Probar en móvil:")
print("     → Abrir app en móvil con distribuidor")
print("     → Activar GPS y caminar")
print("     → Ver actualización en mapa de gerencia")
print()
print("=" * 60)
print()
