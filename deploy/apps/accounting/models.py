from django.db import models
from apps.sales.models import PreSale
from apps.inventory.models import Category
from django.conf import settings
from apps.distribution.models import DeliveryBatch
from decimal import Decimal

# ============ CAJA CHICA ============
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
                
                # ✅ CONEXIÓN FINANCIERA: Registrar gasto en Expense
                Expense.objects.create(
                    description=f"Caja Chica - {self.get_category_display()}: {self.description}",
                    amount=self.amount,
                    category='OTROS',
                    registered_by=self.user
                )
            
            self.petty_cash.save()
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Movimiento de Caja Chica"
        verbose_name_plural = "Movimientos de Caja Chica"
        ordering = ['-created_at']

# ============ OTROS MODELOS ============

class ExchangeRate(models.Model):
    rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Tasa Bs por 1 USD")
    date = models.DateField(auto_now_add=True)
    set_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"{self.rate} Bs/USD - {self.date}"
    
    @classmethod
    def get_current_rate(cls):
        active = cls.objects.filter(is_active=True).first()
        return active.rate if active else 6.96

# Create your models here.
class PriceRule(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    sale_type = models.CharField(max_length=50, choices=PreSale.SALE_TYPE_CHOICES)
    margin_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        unique_together = ('category', 'sale_type')
        
    def __str__(self):
        return f"{self.category.name} - {self.sale_type} ({self.margin_percentage}%)"

    def calculate_price(self, cost):
        margin_decimal = self.margin_percentage / 100
        return cost * (1 + margin_decimal)
    
class CashSettlement(models.Model):
    batch = models.OneToOneField(
        DeliveryBatch, 
        on_delete=models.CASCADE, 
        related_name='settlement'
    )
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        limit_choices_to={'role': 'CONTABILIDAD'}
    )
    
    expected_amount = models.DecimalField(max_digits=12, decimal_places=2)
    received_amount = models.DecimalField(max_digits=12, decimal_places=2)
    difference = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    observations = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.difference = self.received_amount - self.expected_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Settlement #{self.id} - Batch {self.batch_id}"
    
class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('PERSONAL', 'Planilla de Sueldos'),
        ('LOGISTICA', 'Mantenimiento/Gasolina'),
        ('SERVICIOS', 'Servicios Básicos'),
        ('OTROS', 'Otros Gastos'),
    ]

    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateField(auto_now_add=True)
    registered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.description} - {self.amount}"
    
class Employee(models.Model):
    full_name = models.CharField(max_length=255)
    id_number = models.CharField(max_length=20, unique=True) 
    position = models.CharField(max_length=100)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name

class PayrollPayment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    payment_date = models.DateField(auto_now_add=True)
    month_period = models.CharField(max_length=20) # Ej: "Enero 2026"
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total_net = Decimal(str(self.amount_paid)) + Decimal(str(self.bonus)) - Decimal(str(self.deductions))
        super().save(*args, **kwargs)

        from .models import Expense
        Expense.objects.create(
            description=f"Nómina: {self.user.username} - {self.month_period}", 
            amount=self.total_net,
            category='PERSONAL'
        )
        

class AccountReceivable(models.Model):
    STATUS_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('PARCIAL', 'Abono Parcial'),
        ('PAGADO', 'Pagado'),
        ('VENCIDO', 'Vencido'),
    ]

    client = models.ForeignKey('sales.Client', on_delete=models.CASCADE, related_name='debts')
    pre_sale = models.OneToOneField('sales.PreSale', on_delete=models.CASCADE, related_name='accounts_receivable')
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)
    
    due_date = models.DateField() 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDIENTE')
    
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Deuda: {self.client.business_name} - {self.remaining_balance} Bs."

    def register_payment(self, amount):
        """Método para abonar a la deuda"""
        self.remaining_balance -= Decimal(str(amount))
        if self.remaining_balance <= 0:
            self.remaining_balance = 0
            self.status = 'PAGADO'
        else:
            self.status = 'PARCIAL'
        self.save()
        
class AccountPayable(models.Model):
    STATUS_CHOICES = [('PENDIENTE', 'Pendiente'), ('PAGADO', 'Pagado')]
    
    provider_name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDIENTE')
    created_at = models.DateTimeField(auto_now_add=True)

    def register_payment(self, amount):
        self.remaining_balance -= Decimal(str(amount))
        if self.remaining_balance <= 0:
            self.remaining_balance = 0
            self.status = 'PAGADO'
        self.save()
        
        # Al pagar una deuda a proveedor, se genera un Egreso automáticamente
        Expense.objects.create(
            description=f"Pago a Proveedor: {self.provider_name} - {self.description}",
            amount=amount,
            category='OTROS'
        )