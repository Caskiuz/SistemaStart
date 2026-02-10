from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PettyCash, PettyCashTransaction
from .serializers_petty_cash import PettyCashSerializer, PettyCashTransactionSerializer
from django.db.models import Sum

class PettyCashViewSet(viewsets.ModelViewSet):
    queryset = PettyCash.objects.all()
    serializer_class = PettyCashSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        petty_cash = self.get_object()
        
        # Calcular totales
        transactions = petty_cash.transactions.all()
        total_income = transactions.filter(transaction_type='INGRESO').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expenses = transactions.filter(transaction_type='GASTO').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Gastos por categoría
        expenses_by_category = transactions.filter(transaction_type='GASTO').values('category').annotate(total=Sum('amount'))
        
        return Response({
            'current_balance': petty_cash.current_balance,
            'total_income': total_income,
            'total_expenses': total_expenses,
            'expenses_by_category': list(expenses_by_category),
            'recent_transactions': PettyCashTransactionSerializer(transactions[:10], many=True).data
        })

class PettyCashTransactionViewSet(viewsets.ModelViewSet):
    queryset = PettyCashTransaction.objects.select_related('petty_cash', 'user').all()
    serializer_class = PettyCashTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        petty_cash_id = self.request.query_params.get('petty_cash')
        if petty_cash_id:
            queryset = queryset.filter(petty_cash_id=petty_cash_id)
        return queryset
