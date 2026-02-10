# Generated manually for GPS tracking

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('distribution', '0003_deliveryassignment_actual_arrival_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='deliverybatch',
            name='current_latitude',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=11, null=True, verbose_name='Latitud Actual'),
        ),
        migrations.AddField(
            model_name='deliverybatch',
            name='current_longitude',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=11, null=True, verbose_name='Longitud Actual'),
        ),
        migrations.AddField(
            model_name='deliverybatch',
            name='last_gps_update',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Última Actualización GPS'),
        ),
        migrations.AddField(
            model_name='deliverybatch',
            name='gps_enabled',
            field=models.BooleanField(default=False, verbose_name='GPS Activo'),
        ),
    ]
