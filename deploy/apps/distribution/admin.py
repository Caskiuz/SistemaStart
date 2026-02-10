from django.contrib import admin
from .models import Route, DeliveryBatch, DeliveryAssignment

class DeliveryAssignmentInline(admin.TabularInline):
    model = DeliveryAssignment
    extra = 0

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(DeliveryBatch)
class DeliveryBatchAdmin(admin.ModelAdmin):
    list_display = ['id', 'route', 'distributor', 'status', 'created_at']
    list_filter = ['status', 'route']
    inlines = [DeliveryAssignmentInline]