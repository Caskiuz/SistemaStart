import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User

print("\n" + "="*70)
print("CAMBIANDO TODAS LAS CONTRASEÑAS A: password")
print("="*70 + "\n")

usuarios = User.objects.all()

if usuarios.count() == 0:
    print("❌ No hay usuarios en la base de datos\n")
else:
    for user in usuarios:
        user.set_password('password')
        user.save()
        print(f"✅ {user.email or user.username} → contraseña cambiada a 'password'")

print("\n" + "="*70)
print("CREDENCIALES ACTUALIZADAS")
print("="*70 + "\n")

for user in usuarios:
    print(f"Email: {user.email or 'Sin email'}")
    print(f"Username: {user.username}")
    print(f"Contraseña: password")
    print(f"Rol: {user.role}")
    print("-"*70)

print("\n✅ Todas las contraseñas cambiadas exitosamente!\n")
