import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User

print("\n" + "="*70)
print("USUARIOS EN LA BASE DE DATOS")
print("="*70 + "\n")

usuarios = User.objects.all()

if usuarios.count() == 0:
    print("❌ No hay usuarios en la base de datos\n")
else:
    print(f"Total de usuarios: {usuarios.count()}\n")
    print("-"*70)
    
    for user in usuarios:
        print(f"\n👤 ID: {user.id}")
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Rol: {user.role}")
        print(f"   Activo: {'✅' if user.is_active else '❌'}")
        print(f"   Staff: {'✅' if user.is_staff else '❌'}")
        print(f"   Superuser: {'✅' if user.is_superuser else '❌'}")
        print("-"*70)

print("\n" + "="*70)
print("CREDENCIALES PARA LOGIN (usa el EMAIL)")
print("="*70 + "\n")

for user in usuarios:
    if user.email:
        print(f"Email: {user.email}")
        print(f"Rol: {user.role}")
        print(f"(Contraseña: la que configuraste para este usuario)")
        print("-"*70)
