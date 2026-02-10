import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.distribution.models import Route, DeliveryBatch, DeliveryAssignment
from apps.sales.models import PreSale
from apps.users.models import User

route = Route.objects.first()
if not route:
    route = Route.objects.create(name='Ruta Centro', description='Zona centro de la ciudad')

agent = User.objects.filter(role='DISTRIBUCION').first()
if not agent:
    agent = User.objects.filter(role='GERENCIA').first()

presales = PreSale.objects.filter(status='PENDIENTE')[:5]

if presales.count() == 0:
    print('No hay preventas pendientes. Crea algunas preventas primero.')
else:
    batch = DeliveryBatch.objects.create(
        route=route,
        distributor=agent,
        status='EN_RUTA'
    )

    for idx, presale in enumerate(presales, 1):
        DeliveryAssignment.objects.create(
            batch=batch,
            presale=presale,
            order_in_route=idx
        )
        presale.status = 'ASIGNADO'
        presale.save()

    print(f'Despacho creado: ID={batch.id}')
    print(f'Ruta: {route.name}')
    print(f'Distribuidor: {agent.username if agent else "Sin agente"}')
    print(f'Entregas: {presales.count()}')
