from rest_framework import serializers
from .models import Product, Category, InventoryMovement
from apps.accounting.models import PriceRule

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    stock_available = serializers.ReadOnlyField()
    total_boxes = serializers.ReadOnlyField()
    price_per_box = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'code', 'name', 'description', 'category', 'warehouse_location',
            'units_per_box', 'purchase_price', 'price_horizontal', 'price_mayorista', 
            'price_moderno', 'stock', 'stock_reserved', 'stock_available', 'stock_min',
            'total_boxes', 'price_per_box', 'product_image', 'is_active', 'created_at'
        ]
        
class InventoryMovementSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = InventoryMovement
        fields = [
            'id', 'product', 'product_name', 'type', 
            'quantity', 'reason', 'user', 'user_username', 'created_at'
        ]
        read_only_fields = ['user']