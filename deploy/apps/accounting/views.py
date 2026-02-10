from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal
from django.db.models.functions import Coalesce
from django.db.models import Sum
from datetime import date, timedelta, datetime

from apps.distribution.models import DeliveryBatch, DeliveryAssignment
from apps.users.models import User
from apps.sales.models import PreSale
from .models import (
    CashSettlement, Expense, Employee, PayrollPayment, 
    AccountReceivable, AccountPayable, PriceRule, ExchangeRate
)
from .serializers import (
    ExpenseSerializer, EmployeeSerializer, AccountReceivableSerializer, 
    PriceRuleSerializer, AccountPayableSerializer, ExchangeRateSerializer
)

class AccountReceivableViewSet(viewsets.ModelViewSet):
    queryset = AccountReceivable.objects.all().order_by('-due_date')
    serializer_class = AccountReceivableSerializer

    @action(detail=True, methods=['post'])
    def register_payment(self, request, pk=None):
        debt = self.get_object()
        amount_raw = request.data.get('amount', 0)
        
        try:
            amount = Decimal(str(amount_raw)) 
            if amount <= 0:
                return Response({'error': 'Monto debe ser mayor a cero'}, status=status.HTTP_400_BAD_REQUEST)
                
            debt.register_payment(amount)
            return Response({
                'status': 'Abono registrado', 
                'balance': float(debt.remaining_balance)
            })
        except (ValueError, TypeError):
            return Response({'error': 'Formato de monto inválido'}, status=status.HTTP_400_BAD_REQUEST)


class AccountingViewSet(viewsets.ViewSet):

    # --- LIQUIDACIONES DE RUTA ---
    @action(detail=False, methods=['get'], url_path='pending_settlements')
    def pending_settlements(self, request):
        pending = DeliveryBatch.objects.filter(
            status='FINALIZADO',
            settlement__isnull=True 
        ).select_related('route', 'distributor')
        
        data = [{
            "id": b.id,
            "route_name": b.route.name,
            "distributor_name": b.distributor.username,
            "created_at": b.created_at,
        } for b in pending]
        
        return Response(data)

    @action(detail=True, methods=['get'], url_path='batch_summary')
    def batch_summary(self, request, pk=None):
        batch = get_object_or_404(DeliveryBatch, id=pk)
        assignments = batch.deliveries.all().select_related('presale', 'presale__client')
        
        total_expected = Decimal('0.00')
        details = []

        for asn in assignments:
            ps = asn.presale
            if ps.status == 'CONFIRMADO':
                ps_total = Decimal('0.00')
                for item in ps.items.all():
                    effective_qty = item.quantity - item.returned_quantity
                    line_amount = Decimal(str(effective_qty)) * item.price_at_sale
                    ps_total += line_amount

                total_expected += ps_total
                details.append({
                    "presale_id": ps.id,
                    "client": ps.client.business_name,
                    "amount": float(ps_total)
                })

        return Response({
            "batch_id": batch.id,
            "distributor": batch.distributor.username if batch.distributor else "Sin asignar",
            "expected_amount": float(total_expected),
            "details": details
        })

    @action(detail=True, methods=['post'], url_path='finalize_settlement')
    def finalize_settlement(self, request, pk=None):
        batch = get_object_or_404(DeliveryBatch, id=pk)
        received_amount = Decimal(str(request.data.get('received_amount', 0)))
        observations = request.data.get('observations', '')
        debts_data = request.data.get('debts', [])

        summary = self.batch_summary(request, pk=pk).data
        expected_total = Decimal(str(summary['expected_amount']))

        settlement = CashSettlement.objects.create(
            batch=batch,
            processed_by=request.user,
            expected_amount=expected_total,
            received_amount=received_amount,
            observations=observations
        )

        for debt_item in debts_data:
            presale_obj = get_object_or_404(PreSale, id=debt_item['presale_id'])
            amount = Decimal(str(debt_item['debt_amount']))

            if amount > 0:
                AccountReceivable.objects.create(
                    client=presale_obj.client,
                    pre_sale=presale_obj,
                    total_amount=presale_obj.total_amount,
                    remaining_balance=amount,
                    due_date=date.today() + timedelta(days=7),
                    status='PENDIENTE'
                )

        return Response({"success": True, "message": "Liquidación y deudas registradas con éxito"})

    # --- REPORTES FINANCIEROS ---
    @action(detail=False, methods=['get'], url_path='cash_report')
    def cash_report(self, request):
        total_income = CashSettlement.objects.aggregate(Sum('received_amount'))['received_amount__sum'] or 0
        total_expenses = Expense.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            "total_income": float(total_income),
            "total_expenses": float(total_expenses),
            "net_balance": float(total_income - total_expenses)
        })

    @action(detail=False, methods=['get'], url_path='financial_statement')
    def financial_statement(self, request):
        cash_income = CashSettlement.objects.aggregate(
            res=Coalesce(Sum('received_amount'), Decimal('0.00'))
        )['res']

        pending_receivables = AccountReceivable.objects.filter(status__in=['PENDIENTE', 'PARCIAL']).aggregate(
            res=Coalesce(Sum('remaining_balance'), Decimal('0.00'))
        )['res']

        total_expenses = Expense.objects.aggregate(
            res=Coalesce(Sum('amount'), Decimal('0.00'))
        )['res']

        pending_payables = AccountPayable.objects.filter(status='PENDIENTE').aggregate(
            res=Coalesce(Sum('remaining_balance'), Decimal('0.00'))
        )['res']

        return Response({
            "income_cash": float(cash_income),
            "receivables": float(pending_receivables),
            "total_revenue": float(cash_income + pending_receivables),
            "expenses": float(total_expenses),
            "payables": float(pending_payables),
            "net_utility": float((cash_income + pending_receivables) - total_expenses - pending_payables)
        })

    @action(detail=False, methods=['get'], url_path='balance_report')
    def balance_report(self, request):
        total_income = CashSettlement.objects.aggregate(
            total=Coalesce(Sum('received_amount'), Decimal('0.00'))
        )['total']

        total_expenses = Expense.objects.aggregate(
            total=Coalesce(Sum('amount'), Decimal('0.00'))
        )['total']

        return Response({
            "income": float(total_income),
            "expenses": float(total_expenses),
            "balance": float(total_income - total_expenses)
        })

    # --- EGRESOS Y CUENTAS POR PAGAR ---
    @action(detail=False, methods=['get', 'post'], url_path='expenses')
    def expenses(self, request):
        if request.method == 'GET':
            expenses = Expense.objects.all().order_by('-date')
            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            serializer = ExpenseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(registered_by=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'post'], url_path='accounts-payable')
    def accounts_payable(self, request):
        if request.method == 'GET':
            payables = AccountPayable.objects.all().order_by('due_date')
            serializer = AccountPayableSerializer(payables, many=True)
            return Response(serializer.data)
        
        if request.method == 'POST':
            serializer = AccountPayableSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'], url_path='pay-provider')
    def pay_provider(self, request, pk=None):
        payable = get_object_or_404(AccountPayable, id=pk)
        amount_raw = request.data.get('amount', 0)
        
        try:
            amount = Decimal(str(amount_raw))
            if amount <= 0:
                return Response({'error': 'Monto inválido'}, status=400)
                
            payable.register_payment(amount)
            return Response({'success': True, 'remaining': float(payable.remaining_balance)})
        except (ValueError, TypeError):
            return Response({'error': 'Formato de monto inválido'}, status=400)

    # --- GESTIÓN DE PERSONAL Y NÓMINA ---
    @action(detail=False, methods=['get', 'post'], url_path='employees')
    def employees(self, request):
        if request.method == 'GET':
            qs = Employee.objects.filter(is_active=True)
            return Response(EmployeeSerializer(qs, many=True).data)
        
        if request.method == 'POST':
            serializer = EmployeeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='system_users')
    def system_users(self, request):
        current_period = datetime.now().strftime('%B de %Y').lower() 
        paid_user_ids = PayrollPayment.objects.filter(
            month_period__iexact=current_period
        ).values_list('user_id', flat=True)
        
        users = User.objects.filter(is_active=True).exclude(id__in=paid_user_ids).values(
            'id', 'username', 'email', 'role', 'base_salary'
        )
        return Response(list(users))

    @action(detail=True, methods=['patch'], url_path='update_salary')
    def update_salary(self, request, pk=None):
        user = get_object_or_404(User, id=pk)
        new_salary = request.data.get('base_salary')
        
        if new_salary is not None:
            try:
                user.base_salary = float(new_salary)
                user.save()
                return Response({"success": True, "new_salary": float(user.base_salary)})
            except ValueError:
                return Response({"error": "Formato de monto inválido"}, status=400)
        return Response({"error": "Monto no proporcionado"}, status=400)

    @action(detail=False, methods=['post'], url_path='process_payroll')
    def process_payroll(self, request):
        data = request.data
        try:
            user_obj = User.objects.get(id=data['employee_id'])
            payment = PayrollPayment.objects.create(
                user=user_obj, 
                month_period=data['month_period'],
                amount_paid=data['amount_paid'],
                bonus=data.get('bonus', 0),
                deductions=data.get('deductions', 0)
            )
            return Response({"success": True, "total_paid": float(payment.total_net)})
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    # --- REGLAS DE PRECIOS ---
    # @action(detail=False, methods=['get', 'post'], url_path='price-rules')
    # def price_rules(self, request):
    #     if request.method == 'GET':
    #         rules = PriceRule.objects.all().select_related('category')
    #         serializer = PriceRuleSerializer(rules, many=True)
    #         return Response(serializer.data)
        
    #     if request.method == 'POST':
    #         serializer = PriceRuleSerializer(data=request.data)
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data, status=201)
    #         return Response(serializer.errors, status=400)

    # @action(detail=True, methods=['patch'], url_path='update-price-rule')
    # def update_price_rule(self, request, pk=None):
    #     rule = get_object_or_404(PriceRule, id=pk)
    #     serializer = PriceRuleSerializer(rule, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=400)

    # --- TASA DE CAMBIO ---
    @action(detail=False, methods=['get'], url_path='exchange-rate')
    def get_exchange_rate(self, request):
        rate = ExchangeRate.get_current_rate()
        return Response({"rate": float(rate)})
    
    @action(detail=False, methods=['post'], url_path='set-exchange-rate')
    def set_exchange_rate(self, request):
        if request.user.role != 'GERENCIA':
            return Response({"error": "Solo gerencia puede modificar la tasa"}, status=403)
        
        rate_value = request.data.get('rate')
        if not rate_value:
            return Response({"error": "Tasa requerida"}, status=400)
        
        # Desactivar tasas anteriores
        ExchangeRate.objects.filter(is_active=True).update(is_active=False)
        
        # Crear nueva tasa
        new_rate = ExchangeRate.objects.create(
            rate=rate_value,
            set_by=request.user,
            is_active=True
        )
        
        serializer = ExchangeRateSerializer(new_rate)
        return Response(serializer.data, status=201)