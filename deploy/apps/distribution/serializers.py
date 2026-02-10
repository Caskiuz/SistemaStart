from rest_framework import serializers
from .models import Route, DeliveryBatch, DeliveryAssignment
from apps.sales.serializers import PreSaleSerializer

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class DeliveryAssignmentSerializer(serializers.ModelSerializer):
    presale_details = PreSaleSerializer(source='presale', read_only=True)
    
    class Meta:
        model = DeliveryAssignment
        fields = ['id', 'presale', 'presale_details', 'order_in_route', 'delivery_status', 'started_at', 'arrived_at', 'completed_at']

class DeliveryBatchSerializer(serializers.ModelSerializer):
    route_name = serializers.ReadOnlyField(source='route.name')
    distributor_name = serializers.ReadOnlyField(source='distributor.username')
    
    deliveries = DeliveryAssignmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = DeliveryBatch
        fields = [
            'id', 'route', 'route_name', 'distributor', 
            'distributor_name', 'status', 'created_at', 'deliveries',
            'current_latitude', 'current_longitude', 'last_gps_update', 'gps_enabled'
        ]