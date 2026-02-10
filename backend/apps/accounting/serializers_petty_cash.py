from rest_framework import serializers
from .models import PettyCash, PettyCashTransaction

class PettyCashSerializer(serializers.ModelSerializer):
    class Meta:
        model = PettyCash
        fields = ['id', 'name', 'initial_amount', 'current_balance', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['current_balance', 'created_at', 'updated_at']

class PettyCashTransactionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = PettyCashTransaction
        fields = ['id', 'petty_cash', 'transaction_type', 'category', 'amount', 'description', 
                  'receipt_number', 'user', 'user_name', 'created_at']
        read_only_fields = ['user', 'created_at']
