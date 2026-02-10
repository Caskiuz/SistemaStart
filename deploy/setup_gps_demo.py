import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.distribution.models import Route, DeliveryBatch, DeliveryAssignment
from apps.sales.models import PreSale, PreSaleItem, Client
from apps.inventory.models import Product
from apps.users.models import User

# 1. Obtener datos necesarios
seller = User.objects.filter(role='VENTAS').first() or User.objects.filter(role='GERENCIA').first()
client = Client.objects.first()
products = Product.objects.all()[:3]

if not client or products.count() == 0:
    print('ERROR: Necesitas al menos 1 cliente y 3 productos en el sistema')
    exit()

# 2. Crear 3 preventas
print('Creando preventas...')
presales = []
for i in range(3):
    presale = PreSale.objects.create(
        client=client,
        seller=seller,
        status='PENDIENTE',
        total_amount=Decimal('0.00')
    )
    
    total = Decimal('0.00')
    for product in products:
        item = PreSaleItem.objects.create(
            pre_sale=presale,
            product=product,
            quantity=5,
            price_at_sale=product.price_horizontal,
            subtotal=product.price_horizontal * 5
        )
        total += item.subtotal
    
    presale.total_amount = total
    presale.save()
    presales.append(presale)
    print(f'  Preventa #{presale.id} creada - Total: ${total}')

# 3. Crear ruta
route = Route.objects.first()
if not route:
    route = Route.objects.create(name='Ruta Centro Maracay', description='Zona centro')
    print(f'Ruta creada: {route.name}')

# 4. Obtener distribuidor
agent = User.objects.filter(role='DISTRIBUCION').first()
if not agent:
    agent = User.objects.filter(role='GERENCIA').first()

# 5. Crear despacho
batch = DeliveryBatch.objects.create(
    route=route,
    distributor=agent,
    status='EN_RUTA'
)
print(f'\nDespacho #{batch.id} creado en ruta')

# 6. Asignar preventas al despacho
for idx, presale in enumerate(presales, 1):
    DeliveryAssignment.objects.create(
        batch=batch,
        presale=presale,
        order_in_route=idx
    )
    presale.status = 'ASIGNADO'
    presale.save()
    print(f'  Preventa #{presale.id} asignada (parada #{idx})')

print(f'\n✓ COMPLETADO')
print(f'Distribuidor: {agent.username}')
print(f'Ruta: {route.name}')
print(f'Preventas asignadas: {len(presales)}')
print(f'\nAhora ve a: Distribución → Mapa GPS')
