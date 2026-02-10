from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    def __clstr__(self): return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    code = models.CharField(max_length=50, unique=True, verbose_name="Código de Producto")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    warehouse_location = models.CharField(max_length=100, blank=True, verbose_name="Ubicación en Almacén")
    units_per_box = models.PositiveIntegerField(default=1, verbose_name="Unidades por Caja")
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio de Compra", default=0.00)
    
    price_horizontal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_mayorista = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_moderno = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_reserved = models.PositiveIntegerField(default=0)
    stock = models.PositiveIntegerField(default=0)
    stock_min = models.PositiveIntegerField(default=5)
    product_image = models.ImageField(upload_to='products/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def stock_available(self):
        return self.stock - self.stock_reserved
    
    @property
    def total_boxes(self):
        """Calcula el número total de cajas basado en stock y unidades por caja"""
        if self.units_per_box and self.units_per_box > 0:
            return self.stock / self.units_per_box
        return 0
    
    @property
    def price_per_box(self):
        """Calcula el precio por caja"""
        return self.price_horizontal * self.units_per_box

    def __str__(self):
        return f"{self.name} - Stock: {self.stock}"
    
class InventoryMovement(models.Model):
    TYPES = (
        ('INGRESO', 'Ingreso (Compra/Devolución)'),
        ('EGRESO', 'Egreso (Venta/Baja)'),
    )
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='movements')
    type = models.CharField(max_length=10, choices=TYPES)
    quantity = models.PositiveIntegerField()
    reason = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.product.name} ({self.quantity})"