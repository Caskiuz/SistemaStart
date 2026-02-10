import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounting.models import PettyCash, PettyCashTransaction

# Obtener todas las cajas chicas
all_cash = PettyCash.objects.all().order_by('id')

print(f"📊 Total de cajas chicas: {all_cash.count()}")

if all_cash.count() > 1:
    # Encontrar la caja con más transacciones
    cash_with_transactions = []
    for cash in all_cash:
        trans_count = cash.transactions.count()
        cash_with_transactions.append((cash, trans_count))
        print(f"  - ID {cash.id}: {cash.name} - {trans_count} transacciones - Saldo: {cash.current_balance}")
    
    # Ordenar por cantidad de transacciones (descendente)
    cash_with_transactions.sort(key=lambda x: x[1], reverse=True)
    
    # Mantener la que tiene más transacciones
    keep_cash = cash_with_transactions[0][0]
    print(f"\n✅ Manteniendo caja chica ID {keep_cash.id}: {keep_cash.name}")
    
    # Mover todas las transacciones a la caja principal
    for cash, trans_count in cash_with_transactions[1:]:
        if trans_count > 0:
            print(f"📦 Moviendo {trans_count} transacciones de ID {cash.id} a ID {keep_cash.id}")
            PettyCashTransaction.objects.filter(petty_cash=cash).update(petty_cash=keep_cash)
        
        print(f"🗑️  Eliminando caja chica ID {cash.id}")
        cash.delete()
    
    # Recalcular saldo de la caja principal
    transactions = keep_cash.transactions.all()
    total_income = sum(t.amount for t in transactions if t.transaction_type == 'INGRESO')
    total_expenses = sum(t.amount for t in transactions if t.transaction_type == 'GASTO')
    keep_cash.current_balance = keep_cash.initial_amount + total_income - total_expenses
    keep_cash.save()
    
    print(f"\n✅ Limpieza completada!")
    print(f"   Caja única ID {keep_cash.id}")
    print(f"   Total transacciones: {keep_cash.transactions.count()}")
    print(f"   Saldo actual: {keep_cash.current_balance} Bs")
else:
    print("✅ Solo hay una caja chica, no se requiere limpieza")
