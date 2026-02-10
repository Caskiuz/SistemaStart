from django.contrib import admin
from .models import PriceRule, CashSettlement, Expense, PayrollPayment, AccountReceivable

@admin.register(PriceRule)
class PriceRuleAdmin(admin.ModelAdmin):
    list_display = ('category', 'sale_type', 'margin_percentage')
    list_filter = ('sale_type', 'category')
    search_fields = ('category__name',)

@admin.register(CashSettlement)
class CashSettlementAdmin(admin.ModelAdmin):
    list_display = ('id', 'batch', 'expected_amount', 'received_amount', 'difference', 'created_at')
    list_filter = ('created_at', 'processed_by')
    readonly_fields = ('difference', 'created_at')
    
    def save_model(self, request, obj, form, change):
        if not obj.processed_by:
            obj.processed_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'category', 'amount', 'date', 'registered_by')
    list_filter = ('category', 'date')
    search_fields = ('description',)
    list_per_page = 20

@admin.register(PayrollPayment)
class PayrollPaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'month_period', 'amount_paid', 'total_net', 'payment_date')
    list_filter = ('month_period', 'payment_date')
    search_fields = ('user__username', 'month_period')
    readonly_fields = ('total_net', 'payment_date')

    fieldsets = (
        ('Información del Empleado', {
            'fields': ('user', 'month_period')
        }),
        ('Detalle de Pago', {
            'fields': ('amount_paid', 'bonus', 'deductions', 'total_net')
        }),
    )
    
@admin.register(AccountReceivable)
class AccountReceivableAdmin(admin.ModelAdmin):
    list_display = ('client', 'total_amount', 'remaining_balance', 'due_date', 'status')
    list_filter = ('status', 'due_date')
    search_fields = ('client__name', 'pre_sale__id')
    readonly_fields = ('total_amount',)
    
    # Colores para identificar deudas vencidas rápidamente
    def get_queryset(self, request):
        from django.utils import timezone
        qs = super().get_queryset(request)
        # Lógica para marcar como vencido automáticamente si pasó la fecha
        qs.filter(due_date__lt=timezone.now(), status__in=['PENDIENTE', 'PARCIAL']).update(status='VENCIDO')
        return qs