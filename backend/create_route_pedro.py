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

# Buscar distribuidor_pedro
distribuidor = User.objects.filter(username='distribuidor_pedro').first()
if not distribuidor:
    print("ERROR: No existe el usuario 'distribuidor_pedro'")
    exit()

# Buscar vendedor
vendedor = User.objects.filter(role='VENTAS').first()
if not vendedor:
    print("ERROR: No hay usuarios con rol VENTAS")
    exit()

# Buscar cliente
cliente = Client.objects.first()
if not cliente:
    print("ERROR: No hay clientes")
    exit()

# Buscar productos
productos = Product.objects.filter(stock__gt=0, is_active=True)[:2]
if len(productos) < 2:
    print("ERROR: No hay suficientes productos con stock")
    exit()

# Crear preventa
preventa = PreSale.objects.create(
    client=cliente,
    seller=vendedor,
    status='ASIGNADO',
    sale_type='HORIZONTAL',
    total_amount=Decimal('500.00')
)

# Agregar items
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

# Crear ruta
ruta, _ = Route.objects.get_or_create(
    name="Ruta Test Pedro",
    defaults={'description': 'Ruta de prueba para distribuidor_pedro'}
)

# Crear batch
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

print("[OK] Ruta creada para distribuidor_pedro")
print(f"Batch ID: {batch.id}")
print(f"Distribuidor: {distribuidor.username}")
print(f"Ruta: {ruta.name}")
print(f"Cliente: {cliente.business_name}")
print(f"Preventa ID: {preventa.id}")
print("\nRecarga la pagina para ver la ruta")
