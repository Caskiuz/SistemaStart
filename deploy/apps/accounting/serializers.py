from rest_framework import serializers
from .models import CashSettlement, Expense, Employee, AccountReceivable, PriceRule, AccountPayable, ExchangeRate

class ExchangeRateSerializer(serializers.ModelSerializer):
    set_by_name = serializers.ReadOnlyField(source='set_by.username')
    
    class Meta:
        model = ExchangeRate
        fields = ['id', 'rate', 'date', 'set_by', 'set_by_name', 'is_active']
        read_only_fields = ['set_by', 'date']

class CashSettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashSettlement
        fields = '__all__'
        read_only_fields = ['processed_by', 'difference', 'created_at']
        
class ExpenseSerializer(serializers.ModelSerializer):
    registered_by_name = serializers.ReadOnlyField(source='registered_by.username')
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'description', 'amount', 'category', 
            'category_display', 'date', 'registered_by', 'registered_by_name'
        ]
        read_only_fields = ['registered_by']
        
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        
class AccountReceivableSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.business_name')
    client_rif = serializers.ReadOnlyField(source='client.rif_cedula')
    
    class Meta:
        model = AccountReceivable
        fields = [
            'id', 'client', 'client_name', 
            'client_rif', 'pre_sale', 'total_amount', 
            'remaining_balance', 'due_date', 'status', 
            'notes'
        ]
        
class AccountPayableSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountPayable
        fields = '__all__'
        
class PriceRuleSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    sale_type_display = serializers.CharField(source='get_sale_type_display', read_only=True)

    class Meta:
        model = PriceRule
        fields = ['id', 'category', 'category_name', 'sale_type', 'sale_type_display', 'margin_percentage']