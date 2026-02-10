from django.db import models
from django.conf import settings
from decimal import Decimal

class PettyCash(models.Model):
    """Caja Chica - Fondo para gastos menores diarios"""
    name = models.CharField(max_length=100, default="Caja Chica Principal")
    initial_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - Saldo: {self.current_balance}"
    
    class Meta:
        verbose_name = "Caja Chica"
        verbose_name_plural = "Cajas Chicas"


class PettyCashTransaction(models.Model):
    """Movimientos de Caja Chica"""
    TRANSACTION_TYPES = (
        ('INGRESO', 'Ingreso/Reposición'),
        ('GASTO', 'Gasto'),
    )
    
    EXPENSE_CATEGORIES = (
        ('REFRIGERIO', 'Refrigerio'),
        ('TRANSPORTE', 'Transporte'),
        ('COMBUSTIBLE', 'Combustible'),
        ('PAPELERIA', 'Papelería'),
        ('LIMPIEZA', 'Limpieza'),
        ('MANTENIMIENTO', 'Mantenimiento'),
        ('OTROS', 'Otros'),
    )
    
    petty_cash = models.ForeignKey(PettyCash, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    receipt_number = models.CharField(max_length=50, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.amount} - {self.description}"
    
    def save(self, *args, **kwargs):
        # Actualizar saldo de caja chica
        if not self.pk:  # Solo en creación
            if self.transaction_type == 'INGRESO':
                self.petty_cash.current_balance += self.amount
            else:  # GASTO
                self.petty_cash.current_balance -= self.amount
            self.petty_cash.save()
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Movimiento de Caja Chica"
        verbose_name_plural = "Movimientos de Caja Chica"
        ordering = ['-created_at']
