from apps.users.models import User

# Verificar si el usuario existe
email = 'dev@admin.com'
user = User.objects.filter(email=email).first()

if user:
    print(f"✅ Usuario encontrado: {user.email}")
    print(f"   Username: {user.username}")
    print(f"   Role: {user.role}")
    print(f"   Is Active: {user.is_active}")
    
    # Verificar contraseña
    if user.check_password('password'):
        print("✅ Contraseña 'password' es correcta")
    else:
        print("❌ Contraseña 'password' es incorrecta")
        print("🔧 Actualizando contraseña...")
        user.set_password('password')
        user.save()
        print("✅ Contraseña actualizada a 'password'")
else:
    print(f"❌ Usuario {email} no existe")
    print("🔧 Creando usuario...")
    user = User.objects.create_user(
        email='dev@admin.com',
        username='dev',
        password='password',
        role='GERENCIA',
        first_name='Dev',
        last_name='Admin'
    )
    print(f"✅ Usuario creado: {user.email}")
    print(f"   Username: {user.username}")
    print(f"   Role: {user.role}")
    print(f"   Password: password")
