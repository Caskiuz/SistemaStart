from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    GERENCIA = 'GERENCIA'
    CONTABILIDAD = 'CONTABILIDAD'
    VENTAS = 'VENTAS'
    ALMACEN = 'ALMACEN'
    DISTRIBUCION = 'DISTRIBUCION'

    ROLE_CHOICES = [
        (GERENCIA, 'Gerencia'),
        (CONTABILIDAD, 'Contabilidad'),
        (VENTAS, 'Ventas (Preventista)'),
        (ALMACEN, 'Almacén'),
        (DISTRIBUCION, 'Distribución'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default=VENTAS)
    phone = models.CharField(max_length=15, blank=True, null=True)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class SalesGPSLocation(models.Model):
    """Ubicación GPS en tiempo real de vendedores"""
    seller = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='gps_location',
        limit_choices_to={'role': 'VENTAS'},
        verbose_name="Vendedor"
    )
    latitude = models.DecimalField(max_digits=11, decimal_places=8, verbose_name="Latitud")
    longitude = models.DecimalField(max_digits=11, decimal_places=8, verbose_name="Longitud")
    timestamp = models.DateTimeField(auto_now=True, verbose_name="Fecha y Hora")
    is_active = models.BooleanField(default=True, verbose_name="GPS Activo")
    
    class Meta:
        verbose_name = "Ubicación GPS Vendedor"
        verbose_name_plural = "Ubicaciones GPS Vendedores"
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"GPS {self.seller.username} - {self.timestamp.strftime('%H:%M:%S')}"