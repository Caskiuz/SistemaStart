import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User

# Crear usuarios con emails
usuarios = [
    {
        'username': 'gerente',
        'email': 'gerente@star.com',
        'password': 'gerente123',
        'role': 'GERENCIA'
    },
    {
        'username': 'contador',
        'email': 'contador@star.com',
        'password': 'contador123',
        'role': 'CONTABILIDAD'
    },
    {
        'username': 'vendedor',
        'email': 'vendedor@star.com',
        'password': 'vendedor123',
        'role': 'VENTAS'
    },
    {
        'username': 'almacenero',
        'email': 'almacenero@star.com',
        'password': 'almacenero123',
        'role': 'ALMACEN'
    },
    {
        'username': 'repartidor',
        'email': 'repartidor@star.com',
        'password': 'repartidor123',
        'role': 'DISTRIBUCION'
    }
]

print("Creando usuarios con emails...")
print("=" * 50)

for user_data in usuarios:
    # Verificar si ya existe
    if User.objects.filter(email=user_data['email']).exists():
        print(f"⚠️  {user_data['email']} ya existe, actualizando...")
        user = User.objects.get(email=user_data['email'])
        user.set_password(user_data['password'])
        user.role = user_data['role']
        user.save()
    else:
        print(f"✅ Creando {user_data['email']}...")
        User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            role=user_data['role']
        )

print("=" * 50)
print("\n✅ Usuarios creados/actualizados exitosamente!\n")
print("CREDENCIALES PARA LOGIN:")
print("-" * 50)
for user_data in usuarios:
    print(f"Email: {user_data['email']}")
    print(f"Contraseña: {user_data['password']}")
    print(f"Rol: {user_data['role']}")
    print("-" * 50)
