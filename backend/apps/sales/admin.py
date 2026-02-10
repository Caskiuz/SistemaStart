from django.contrib import admin
from .models import Client, PreSale, PreSaleItem

class PreSaleItemInline(admin.TabularInline):
    model = PreSaleItem
    extra = 0 
    readonly_fields = ('subtotal',) 
    raw_id_fields = ('product',)

@admin.register(PreSale)
class PreSaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'seller', 'sale_type', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'sale_type', 'created_at', 'seller')
    
    search_fields = ('client__business_name', 'id')
    readonly_fields = ('total_amount', 'created_at')
    raw_id_fields = ('client', 'seller')

    inlines = [PreSaleItemInline]

    ordering = ('-created_at',)

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'owner_name', 'rif_cedula', 'seller', 'is_active', 'created_at')

    list_filter = ('is_active', 'seller', 'created_at')
    search_fields = ('business_name', 'owner_name', 'rif_cedula')
    
    raw_id_fields = ('seller',)
    
    ordering = ('-created_at',)
    def save_model(self, request, obj, form, change):
        if not obj.seller:
            obj.seller = request.user
        super().save_model(request, obj, form, change)