import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User
from apps.distribution.models import DeliveryBatch, DeliveryAssignment

distribuidor = User.objects.filter(username='distribuidor_pedro').first()

if distribuidor:
    batches = DeliveryBatch.objects.filter(distributor=distribuidor).order_by('-id')[:3]
    
    print(f"\n=== Ultimas 3 rutas de {distribuidor.username} ===\n")
    
    for batch in batches:
        print(f"Batch ID: {batch.id}")
        print(f"Ruta: {batch.route.name}")
        print(f"Status Batch: {batch.status}")
        
        for delivery in batch.deliveries.all():
            print(f"  - Delivery ID: {delivery.id}")
            print(f"    Cliente: {delivery.presale.client.business_name}")
            print(f"    PreSale Status: {delivery.presale.status}")
            print(f"    Delivery Status: {delivery.delivery_status}")
        print()
