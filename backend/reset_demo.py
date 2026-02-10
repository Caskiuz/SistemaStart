import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User
from apps.sales.models import PreSale, PreSaleItem, Client
from apps.inventory.models import Product
from apps.distribution.models import DeliveryBatch, DeliveryAssignment, Route
from decimal import Decimal

# Buscar distribuidor_pedro
distribuidor = User.objects.filter(username='distribuidor_pedro').first()
if not distribuidor:
    print("ERROR: No existe distribuidor_pedro")
    exit()

# LIMPIAR rutas antiguas del distribuidor
DeliveryBatch.objects.filter(distributor=distribuidor, status='EN_RUTA').delete()
print("Rutas antiguas eliminadas")

# Buscar vendedor y cliente
vendedor = User.objects.filter(role='VENTAS').first()
cliente = Client.objects.first()
productos = Product.objects.filter(stock__gt=0, is_active=True)[:2]

if not vendedor or not cliente or len(productos) < 2:
    print("ERROR: Faltan datos")
    exit()

# Crear preventa NUEVA
preventa = PreSale.objects.create(
    client=cliente,
    seller=vendedor,
    status='ASIGNADO',
    sale_type='HORIZONTAL',
    total_amount=Decimal('500.00')
)

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

# Crear ruta NUEVA
ruta, _ = Route.objects.get_or_create(
    name="Demo Presentacion",
    defaults={'description': 'Ruta demo para presentacion'}
)

batch = DeliveryBatch.objects.create(
    route=ruta,
    distributor=distribuidor,
    status='EN_RUTA'
)

delivery = DeliveryAssignment.objects.create(
    batch=batch,
    presale=preventa,
    delivery_status='ASIGNADO',
    order_in_route=1
)

print("[OK] Ruta NUEVA creada")
print(f"Batch ID: {batch.id}")
print(f"Cliente: {cliente.business_name}")
print(f"Preventa ID: {preventa.id}")
print("\nRecarga la pagina - veras una ruta FRESCA lista para probar")
