import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User
from apps.sales.models import PreSale, PreSaleItem, Client
from apps.inventory.models import Product
from apps.distribution.models import DeliveryBatch, DeliveryAssignment, Route
from decimal import Decimal
from datetime import date

# Buscar usuarios
distribuidor = User.objects.filter(role='DISTRIBUCION').first()
vendedor = User.objects.filter(role='VENTAS').first()

if not distribuidor:
    print("❌ No hay usuarios con rol DISTRIBUCION")
    exit()

if not vendedor:
    print("❌ No hay usuarios con rol VENTAS")
    exit()

# Buscar cliente
cliente = Client.objects.first()
if not cliente:
    print("❌ No hay clientes en la base de datos")
    exit()

# Buscar productos
productos = Product.objects.filter(stock__gt=0, is_active=True)[:2]
if len(productos) < 2:
    print("❌ No hay suficientes productos con stock")
    exit()

# Crear preventa
preventa = PreSale.objects.create(
    client=cliente,
    seller=vendedor,
    status='ASIGNADO',
    sale_type='HORIZONTAL',
    total_amount=Decimal('500.00')
)

# Agregar items a la preventa
PreSaleItem.objects.create(
    pre_sale=preventa,
    product=productos[0],
    quantity=5,
    price_at_sale=productos[0].price_horizontal,
    subtotal=productos[0].price_horizontal * 5
)

PreSaleItem.objects.create(
    pre_sale=preventa,
    product=productos[1],
    quantity=3,
    price_at_sale=productos[1].price_horizontal,
    subtotal=productos[1].price_horizontal * 3
)

# Buscar o crear ruta
ruta, _ = Route.objects.get_or_create(
    name="Ruta Centro",
    defaults={'description': 'Ruta de prueba para el centro de la ciudad'}
)

# Crear batch de distribución
batch = DeliveryBatch.objects.create(
    route=ruta,
    distributor=distribuidor,
    status='EN_RUTA'
)

# Crear delivery
delivery = DeliveryAssignment.objects.create(
    batch=batch,
    presale=preventa,
    delivery_status='ASIGNADO',
    order_in_route=1
)

print("[OK] Ruta de prueba creada exitosamente")
print(f"Batch ID: {batch.id}")
print(f"Distribuidor: {distribuidor.username}")
print(f"Ruta: {ruta.name}")
print(f"Cliente: {cliente.business_name}")
print(f"Preventa ID: {preventa.id}")
print(f"Productos: {len(productos)}")
print("\nRecarga la pagina del distribuidor para ver la ruta")
