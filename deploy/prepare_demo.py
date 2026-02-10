import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User
from apps.sales.models import PreSale, PreSaleItem, Client
from apps.inventory.models import Product
from apps.distribution.models import DeliveryBatch, DeliveryAssignment, Route
from decimal import Decimal

print("\n" + "="*50)
print("PREPARANDO DATOS DE PRUEBA PARA PRESENTACION")
print("="*50 + "\n")

# 1. Verificar usuarios
print("1. Verificando usuarios...")
ventas = User.objects.filter(role='VENTAS').first()
almacen = User.objects.filter(role='ALMACEN').first()
gerencia = User.objects.filter(role='GERENCIA').first()
distribuidor = User.objects.filter(username='distribuidor_pedro').first()

if not all([ventas, almacen, distribuidor]):
    print("   ERROR: Faltan usuarios necesarios")
    exit()

print(f"   - VENTAS: {ventas.username}")
print(f"   - ALMACEN: {almacen.username if almacen else 'N/A'}")
print(f"   - GERENCIA: {gerencia.username if gerencia else 'N/A'}")
print(f"   - DISTRIBUIDOR: {distribuidor.username}")

# 2. Verificar clientes
print("\n2. Verificando clientes...")
clientes = Client.objects.all()[:3]
print(f"   - Clientes disponibles: {clientes.count()}")
for c in clientes:
    print(f"     * {c.business_name}")

# 3. Verificar productos
print("\n3. Verificando productos con stock...")
productos = Product.objects.filter(stock__gt=5, is_active=True)[:5]
print(f"   - Productos disponibles: {productos.count()}")
for p in productos:
    print(f"     * {p.name} (Stock: {p.stock})")

# 4. Verificar rutas
print("\n4. Verificando rutas...")
rutas = Route.objects.all()
print(f"   - Rutas disponibles: {rutas.count()}")
for r in rutas:
    print(f"     * {r.name}")

# 5. Limpiar rutas antiguas del distribuidor
print("\n5. Limpiando rutas antiguas...")
old_batches = DeliveryBatch.objects.filter(
    distributor=distribuidor,
    status='EN_RUTA'
).count()
if old_batches > 0:
    DeliveryBatch.objects.filter(
        distributor=distribuidor,
        status='EN_RUTA'
    ).delete()
    print(f"   - {old_batches} rutas antiguas eliminadas")
else:
    print("   - No hay rutas antiguas")

# 6. Crear preventa de prueba
print("\n6. Creando preventa de prueba...")
if clientes.exists() and productos.count() >= 2:
    preventa = PreSale.objects.create(
        client=clientes[0],
        seller=ventas,
        status='PENDIENTE',
        sale_type='HORIZONTAL',
        total_amount=Decimal('0.00')
    )
    
    total = Decimal('0.00')
    for i, producto in enumerate(productos[:2]):
        qty = 5 if i == 0 else 3
        subtotal = producto.price_horizontal * qty
        total += subtotal
        
        PreSaleItem.objects.create(
            pre_sale=preventa,
            product=producto,
            quantity=qty,
            price_at_sale=producto.price_horizontal,
            subtotal=subtotal
        )
    
    preventa.total_amount = total
    preventa.save()
    
    print(f"   - Preventa #{preventa.id} creada")
    print(f"   - Cliente: {preventa.client.business_name}")
    print(f"   - Total: ${total}")
    print(f"   - Items: {preventa.items.count()}")
else:
    print("   - ERROR: No hay suficientes clientes o productos")

# 7. Resumen final
print("\n" + "="*50)
print("RESUMEN DE PREPARACION")
print("="*50)
print(f"\nUsuarios listos: {4 if all([ventas, almacen, distribuidor]) else 'INCOMPLETO'}")
print(f"Clientes: {clientes.count()}")
print(f"Productos: {productos.count()}")
print(f"Rutas: {rutas.count()}")
print(f"Preventa de prueba: #{preventa.id if 'preventa' in locals() else 'NO CREADA'}")

print("\n" + "="*50)
print("SIGUIENTE PASO:")
print("="*50)
print("\n1. Abre 3 ventanas del navegador")
print("2. Login en cada una:")
print(f"   - Ventana 1: {ventas.username} (VENTAS)")
print(f"   - Ventana 2: {almacen.username if almacen else gerencia.username} (ALMACEN/GERENCIA)")
print(f"   - Ventana 3: {distribuidor.username} (DISTRIBUCION)")
print("\n3. Sigue la guia en GUIA_PRUEBA_COMPLETA.md")
print("\n" + "="*50 + "\n")
