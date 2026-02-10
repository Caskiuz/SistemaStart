# Generated migration for delivery tracking system

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('distribution', '0004_add_gps_tracking'),
    ]

    operations = [
        # Add delivery_status field to DeliveryAssignment
        migrations.AddField(
            model_name='deliveryassignment',
            name='delivery_status',
            field=models.CharField(
                max_length=20,
                choices=[
                    ('ASIGNADO', 'Asignado'),
                    ('EN_CAMINO', 'En Camino'),
                    ('LLEGADO', 'Llegado'),
                    ('ENTREGANDO', 'Entregando'),
                    ('COMPLETADO', 'Completado'),
                    ('REPROGRAMADO', 'Reprogramado'),
                    ('CANCELADO', 'Cancelado'),
                ],
                default='ASIGNADO'
            ),
        ),
        migrations.AddField(
            model_name='deliveryassignment',
            name='started_at',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='deliveryassignment',
            name='arrived_at',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='deliveryassignment',
            name='completed_at',
            field=models.DateTimeField(null=True, blank=True),
        ),
        
        # Create DeliveryEvent model for timeline
        migrations.CreateModel(
            name='DeliveryEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_type', models.CharField(
                    max_length=20,
                    choices=[
                        ('ASIGNADO', 'Asignado'),
                        ('EN_CAMINO', 'En Camino'),
                        ('LLEGADO', 'Llegado'),
                        ('ENTREGANDO', 'Entregando'),
                        ('COMPLETADO', 'Completado'),
                        ('REPROGRAMADO', 'Reprogramado'),
                        ('CANCELADO', 'Cancelado'),
                    ]
                )),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('latitude', models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)),
                ('longitude', models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)),
                ('notes', models.TextField(blank=True)),
                ('delivery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='distribution.deliveryassignment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
    ]
