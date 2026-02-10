# Generated migration for PettyCash models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounting', '0001_initial'),  # Ajustar según tu última migración
    ]

    operations = [
        migrations.CreateModel(
            name='PettyCash',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Caja Chica Principal', max_length=100)),
                ('initial_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('current_balance', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Caja Chica',
                'verbose_name_plural': 'Cajas Chicas',
            },
        ),
        migrations.CreateModel(
            name='PettyCashTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_type', models.CharField(choices=[('INGRESO', 'Ingreso/Reposición'), ('GASTO', 'Gasto')], max_length=10)),
                ('category', models.CharField(blank=True, choices=[('REFRIGERIO', 'Refrigerio'), ('TRANSPORTE', 'Transporte'), ('COMBUSTIBLE', 'Combustible'), ('PAPELERIA', 'Papelería'), ('LIMPIEZA', 'Limpieza'), ('MANTENIMIENTO', 'Mantenimiento'), ('OTROS', 'Otros')], max_length=20, null=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('description', models.CharField(max_length=255)),
                ('receipt_number', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('petty_cash', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='accounting.pettycash')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Movimiento de Caja Chica',
                'verbose_name_plural': 'Movimientos de Caja Chica',
                'ordering': ['-created_at'],
            },
        ),
    ]
