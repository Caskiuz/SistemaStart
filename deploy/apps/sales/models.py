from django.db import models
from django.conf import settings
from apps.inventory.models import Product

# Create your models here.
class Client(models.Model):
    seller=models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        related_name='clients', 
        limit_choices_to={'role': 'VENTAS'}
    )
    business_name = models.CharField(max_length=200, verbose_name="Nombre del Negocio")
    owner_name = models.CharField(max_length=200, verbose_name="Nombre del Dueño")
    rif_cedula = models.CharField(max_length=20, unique=True, verbose_name="RIF o Cédula")
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    business_image = models.ImageField(upload_to='clients/business_pics/', null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    gps_captured_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='gps_captures'
    )
    gps_captured_at = models.DateTimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.business_name} ({self.owner_name})"
    
class PreSale(models.Model):
    STATUS_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('ASIGNADO', 'Asignado a repartidor'),
        ('CONFIRMADO', 'Confirmado/Vendido'),
        ('REPROGRAMADO', 'Reprogramado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    SALE_TYPE_CHOICES = [
        ('MAYORISTA', 'Mayorista'),
        ('SUPERMERCADO', 'Supermercado'),
        ('HORIZONTAL', 'Horizontal'),
    ]

    seller = models.ForeignKey('users.User', on_delete=models.CASCADE)
    client = models.ForeignKey('sales.Client', on_delete=models.CASCADE)
    has_pending_returns = models.BooleanField(default=False)
    sale_type = models.CharField(max_length=50, choices=SALE_TYPE_CHOICES, default='HORIZONTAL')
    distributor = models.ForeignKey(
        'users.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='deliveries',
        limit_choices_to={'role': 'DISTRIBUIDOR'} 
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDIENTE')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    scheduled_date = models.DateField(null=True, blank=True, verbose_name="Fecha Programada")
    reprogram_reason = models.CharField(max_length=255, null=True, blank=True, verbose_name="Motivo de Reprogramación")

    def __str__(self):
        return f"Preventa #{self.id} - {self.client.business_name}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
class PreSaleItem(models.Model):
    pre_sale = models.ForeignKey(PreSale, related_name='items', on_delete=models.CASCADE)
    returned_quantity = models.PositiveIntegerField(default=0)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2) 
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.price_at_sale
        super().save(*args, **kwargs)

class SellerLocation(models.Model):
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='locations',
        limit_choices_to={'role': 'VENTAS'}
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField(auto_now_add=True)
    client_visited = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.seller.username} - {self.timestamp}"