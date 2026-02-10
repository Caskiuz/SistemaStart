import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.products.models import Product

print(f"Total productos en BD: {Product.objects.count()}")
print("\nProductos:")
for p in Product.objects.all()[:10]:
    print(f"  ID: {p.id} | {p.name} | Stock: {p.stock} | Precio H: {p.price_horizontal}")
