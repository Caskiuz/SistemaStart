from django.contrib import admin
from .models import Product, Category, InventoryMovement

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'purchase_price', 'stock', 'stock_min', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name']

@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):
    list_display = ['product', 'type', 'quantity', 'user', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['product__name', 'reason']
    readonly_fields = ['created_at']