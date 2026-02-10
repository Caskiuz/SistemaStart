# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0005_product_price_horizontal_product_price_mayorista_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='code',
            field=models.CharField(default='PROD-000', max_length=50, unique=True, verbose_name='Código de Producto'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='warehouse_location',
            field=models.CharField(blank=True, max_length=100, verbose_name='Ubicación en Almacén'),
        ),
        migrations.AddField(
            model_name='product',
            name='units_per_box',
            field=models.PositiveIntegerField(default=1, verbose_name='Unidades por Caja'),
        ),
    ]
