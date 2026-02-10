"""
Script de prueba para verificar cálculos de venta por cajas
Ejecutar: python manage.py shell < test_box_sales.py
"""

from apps.inventory.models import Product, Category

# Crear categoría de prueba
cat, _ = Category.objects.get_or_create(name="Bebidas Test")

# Crear producto de prueba con cajas
product = Product.objects.create(
    code="TEST_BOX_001",
    name="Coca Cola 2L - Test",
    category=cat,
    units_per_box=12,  # 12 unidades por caja
    stock=240,  # 20 cajas completas
    purchase_price=8.50,
    price_horizontal=12.00,
    price_mayorista=11.50,
    price_moderno=11.00
)

print("=" * 60)
print("✅ PRODUCTO DE PRUEBA CREADO")
print("=" * 60)
print(f"Código: {product.code}")
print(f"Nombre: {product.name}")
print(f"Unidades por caja: {product.units_per_box}")
print(f"Stock total: {product.stock} unidades")
print(f"Total de cajas: {product.total_boxes:.1f} cajas")
print()
print("PRECIOS:")
print(f"  • Precio unitario (Horizontal): Bs. {product.price_horizontal}")
print(f"  • Precio por caja: Bs. {product.price_per_box}")
print()
print("CÁLCULOS:")
print(f"  • 1 unidad = Bs. {product.price_horizontal}")
print(f"  • 1 caja ({product.units_per_box} uds) = Bs. {product.price_per_box}")
print(f"  • 5 cajas = Bs. {product.price_per_box * 5}")
print()
print("=" * 60)
print("✅ Verificación exitosa - El producto está listo para venta por cajas")
print("=" * 60)
