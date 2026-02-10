# Generated migration for units_per_box field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0006_product_code_location_units'),
    ]

    operations = [
        # Ensure units_per_box exists with default value
        migrations.AlterField(
            model_name='product',
            name='units_per_box',
            field=models.PositiveIntegerField(default=1, verbose_name='Unidades por Caja'),
        ),
    ]
