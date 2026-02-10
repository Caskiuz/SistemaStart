from rest_framework import serializers
from .models import Client, PreSale, PreSaleItem
from apps.accounting.models import PriceRule
from apps.inventory.models import InventoryMovement

class ClientSerializer(serializers.ModelSerializer):
    gps_captured_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = "__all__"
        read_only_fields = ('seller', 'created_at', 'gps_captured_by', 'gps_captured_at')
    
    def get_gps_captured_by_name(self, obj):
        return obj.gps_captured_by.get_full_name() if obj.gps_captured_by else None

class PreSaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    
    class Meta:
        model = PreSaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'returned_quantity', 'price_at_sale', 'subtotal']
        read_only_fields = ['subtotal', 'price_at_sale']

class PreSaleSerializer(serializers.ModelSerializer):
    
    items = PreSaleItemSerializer(many=True) 
    
    client_business_name = serializers.ReadOnlyField(source='client.business_name')
    client_address = serializers.ReadOnlyField(source='client.address')
    client_phone = serializers.ReadOnlyField(source='client.phone')
    client_latitude = serializers.ReadOnlyField(source='client.latitude')
    client_longitude = serializers.ReadOnlyField(source='client.longitude')
    
    class Meta:
        model = PreSale
        fields = [
            'id', 'seller', 'client', 'client_business_name', 
            'client_address', 'client_phone', 'client_latitude', 'client_longitude',
            'status', 'total_amount', 'sale_type', 'items', 'created_at',
            'has_pending_returns', 'scheduled_date', 'reprogram_reason'
        ]
        read_only_fields = ('seller', 'total_amount', 'created_at')
        
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale_type = validated_data.get('sale_type')
        pre_sale = PreSale.objects.create(**validated_data)
        
        total = 0
        
        # 3. Usa items_data que ya viene validado
        for item in items_data:
            product = item['product']
            quantity = item['quantity']
            
            try:
                rule = PriceRule.objects.get(
                    category=product.category, 
                    sale_type__iexact=sale_type 
                )
                unit_price = rule.calculate_price(product.purchase_price)
            except PriceRule.DoesNotExist:
                unit_price = product.purchase_price
            
            # 4. Asegúrate de usar el related_name correcto 'pre_sale' o 'presale'
            # Según tu error previo es 'pre_sale'
            line_item = PreSaleItem.objects.create(
                pre_sale=pre_sale,
                product=product,
                quantity=quantity,
                price_at_sale=unit_price
            )
            
            InventoryMovement.objects.create(
                product=product,
                type='EGRESO',  # Tal cual lo espera tu ViewSet
                quantity=quantity,
                reason=f"Preventa #{pre_sale.id} - Cliente: {pre_sale.client.business_name}",
                user=self.context['request'].user # El vendedor/usuario actual
            )
            
            product.stock -= quantity
            product.save()

            total += line_item.subtotal

        pre_sale.total_amount = total
        pre_sale.save()
        return pre_sale
    