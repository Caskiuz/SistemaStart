import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User

print("=" * 70)
print("  🎯 CREACIÓN DE USUARIOS DE PRUEBA PARA TODOS LOS ROLES")
print("=" * 70)
print()

# Datos de usuarios para cada rol
usuarios = [
    {
        'email': 'gerencia@star.com',
        'username': 'gerencia_star',
        'password': 'star2024',
        'first_name': 'Luis',
        'last_name': 'Alejandro',
        'role': 'GERENCIA'
    },
    {
        'email': 'ventas1@star.com',
        'username': 'vendedor_juan',
        'password': 'star2024',
        'first_name': 'Juan',
        'last_name': 'Pérez',
        'role': 'VENTAS'
    },
    {
        'email': 'ventas2@star.com',
        'username': 'vendedor_maria',
        'password': 'star2024',
        'first_name': 'María',
        'last_name': 'González',
        'role': 'VENTAS'
    },
    {
        'email': 'almacen@star.com',
        'username': 'almacen_carlos',
        'password': 'star2024',
        'first_name': 'Carlos',
        'last_name': 'Rodríguez',
        'role': 'ALMACEN'
    },
    {
        'email': 'distribucion@star.com',
        'username': 'distribuidor_pedro',
        'password': 'star2024',
        'first_name': 'Pedro',
        'last_name': 'Sánchez',
        'role': 'DISTRIBUCION'
    },
    {
        'email': 'contabilidad@star.com',
        'username': 'contador_ana',
        'password': 'star2024',
        'first_name': 'Ana',
        'last_name': 'Martínez',
        'role': 'CONTABILIDAD'
    }
]

print("📝 Creando usuarios...")
print()

usuarios_creados = []

for data in usuarios:
    user, created = User.objects.get_or_create(
        email=data['email'],
        defaults={
            'username': data['username'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'role': data['role'],
            'is_active': True
        }
    )
    
    if created:
        user.set_password(data['password'])
        user.save()
        print(f"✅ {data['role']:15} | {data['email']:25} | {data['first_name']} {data['last_name']}")
        usuarios_creados.append(data)
    else:
        # Actualizar contraseña si ya existe
        user.set_password(data['password'])
        user.save()
        print(f"ℹ️  {data['role']:15} | {data['email']:25} | Ya existía (contraseña actualizada)")

print()
print("=" * 70)
print("  ✅ USUARIOS CREADOS EXITOSAMENTE")
print("=" * 70)
print()
print("📋 CREDENCIALES DE ACCESO:")
print("-" * 70)
print()

for data in usuarios:
    print(f"👤 {data['role']} - {data['first_name']} {data['last_name']}")
    print(f"   Email:    {data['email']}")
    print(f"   Password: {data['password']}")
    print()

print("=" * 70)
print("  🧪 GUÍA RÁPIDA DE PRUEBAS")
print("=" * 70)
print()
print("1️⃣  GERENCIA (gerencia@star.com)")
print("   → Ver mapa GPS con todos los vendedores y distribuidores")
print("   → Crear usuarios, productos, rutas")
print("   → Acceso completo al sistema")
print()
print("2️⃣  VENTAS (ventas1@star.com, ventas2@star.com)")
print("   → Activar GPS Tracker (widget flotante)")
print("   → Crear preventas")
print("   → Gestionar clientes")
print()
print("3️⃣  ALMACEN (almacen@star.com)")
print("   → Gestionar inventario")
print("   → Procesar devoluciones")
print("   → Ver movimientos de stock")
print()
print("4️⃣  DISTRIBUCION (distribucion@star.com)")
print("   → Ver rutas asignadas")
print("   → Activar GPS Tracker")
print("   → Confirmar entregas")
print()
print("5️⃣  CONTABILIDAD (contabilidad@star.com)")
print("   → Liquidar ventas")
print("   → Gestionar cuentas por cobrar/pagar")
print("   → Ver resumen financiero")
print()
print("=" * 70)
print()
