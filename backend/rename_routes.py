import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.distribution.models import Route

# Cambiar nombre de la ruta
route = Route.objects.filter(name="Demo Presentacion").first()
if route:
    route.name = "Ruta Centro Comercial"
    route.description = "Ruta de distribución zona centro"
    route.save()
    print(f"Ruta actualizada: {route.name}")
else:
    print("No se encontro la ruta Demo Presentacion")

# Cambiar Ruta Test Pedro si existe
route2 = Route.objects.filter(name="Ruta Test Pedro").first()
if route2:
    route2.name = "Ruta Norte Industrial"
    route2.description = "Ruta zona industrial norte"
    route2.save()
    print(f"Ruta actualizada: {route2.name}")
