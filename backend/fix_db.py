import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("ALTER TABLE inventory_product ADD COLUMN IF NOT EXISTS code VARCHAR(50);")
    cursor.execute("ALTER TABLE inventory_product ADD COLUMN IF NOT EXISTS warehouse_location VARCHAR(200);")
    cursor.execute("ALTER TABLE inventory_product ADD COLUMN IF NOT EXISTS units_per_box INTEGER;")
    print('Columnas agregadas exitosamente')
