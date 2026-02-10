import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from apps.products.models import Product
from decimal import Decimal

# Productos de ejemplo para STAR (distribuidora de bebidas/alimentos)
productos = [
    {
        "name": "Coca Cola 2L",
        "description": "Gaseosa Coca Cola 2 litros",
        "stock": 100,
        "price_horizontal": Decimal("12.50"),
        "price_mayorista": Decimal("11.00"),
        "price_moderno": Decimal("13.50")
    },
    {
        "name": "Sprite 2L",
        "description": "Gaseosa Sprite 2 litros",
        "stock": 80,
        "price_horizontal": Decimal("12.00"),
        "price_mayorista": Decimal("10.50"),
        "price_moderno": Decimal("13.00")
    },
    {
        "name": "Fanta 2L",
        "description": "Gaseosa Fanta 2 litros",
        "stock": 75,
        "price_horizontal": Decimal("12.00"),
        "price_mayorista": Decimal("10.50"),
        "price_moderno": Decimal("13.00")
    },
    {
        "name": "Agua Vital 2L",
        "description": "Agua mineral Vital 2 litros",
        "stock": 150,
        "price_horizontal": Decimal("5.00"),
        "price_mayorista": Decimal("4.50"),
        "price_moderno": Decimal("5.50")
    },
    {
        "name": "Cerveza Paceña 355ml",
        "description": "Cerveza Paceña lata 355ml",
        "stock": 200,
        "price_horizontal": Decimal("8.00"),
        "price_mayorista": Decimal("7.00"),
        "price_moderno": Decimal("9.00")
    },
    {
        "name": "Cerveza Huari 355ml",
        "description": "Cerveza Huari lata 355ml",
        "stock": 180,
        "price_horizontal": Decimal("7.50"),
        "price_mayorista": Decimal("6.50"),
        "price_moderno": Decimal("8.50")
    },
    {
        "name": "Jugo Del Valle 1L",
        "description": "Jugo Del Valle sabores varios 1 litro",
        "stock": 90,
        "price_horizontal": Decimal("10.00"),
        "price_mayorista": Decimal("9.00"),
        "price_moderno": Decimal("11.00")
    },
    {
        "name": "Galletas Oreo",
        "description": "Galletas Oreo paquete familiar",
        "stock": 120,
        "price_horizontal": Decimal("15.00"),
        "price_mayorista": Decimal("13.50"),
        "price_moderno": Decimal("16.50")
    },
    {
        "name": "Papas Lays 150g",
        "description": "Papas fritas Lays 150 gramos",
        "stock": 100,
        "price_horizontal": Decimal("8.50"),
        "price_mayorista": Decimal("7.50"),
        "price_moderno": Decimal("9.50")
    },
    {
        "name": "Chocolate Sublime",
        "description": "Chocolate Sublime clásico",
        "stock": 150,
        "price_horizontal": Decimal("4.50"),
        "price_mayorista": Decimal("4.00"),
        "price_moderno": Decimal("5.00")
    }
]

print("Creando productos de ejemplo...")
created = 0
for prod_data in productos:
    product, created_flag = Product.objects.get_or_create(
        name=prod_data["name"],
        defaults=prod_data
    )
    if created_flag:
        created += 1
        print(f"✓ Creado: {product.name}")
    else:
        print(f"- Ya existe: {product.name}")

print(f"\n✅ Proceso completado. {created} productos nuevos creados.")
print(f"Total productos en BD: {Product.objects.count()}")
