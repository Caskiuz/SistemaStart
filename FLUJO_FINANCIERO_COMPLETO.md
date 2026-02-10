# 💰 FLUJO FINANCIERO COMPLETO - SISTEMA STAR

## 📊 DIAGRAMA DE FLUJO ECONÓMICO

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO FINANCIERO STAR                        │
└─────────────────────────────────────────────────────────────────┘

1. VENTAS (Ingresos)
   ├─ Preventa creada → AccountReceivable (Cuenta por Cobrar)
   ├─ Ruta asignada → DeliveryBatch
   ├─ Entrega confirmada → Stock descontado
   └─ Liquidación → CashSettlement → Ingreso registrado

2. GASTOS (Egresos)
   ├─ Caja Chica → PettyCashTransaction (Gastos diarios)
   ├─ Nómina → PayrollPayment → Expense (PERSONAL)
   ├─ Proveedores → AccountPayable → Expense (OTROS)
   └─ Otros → Expense (SERVICIOS, LOGISTICA)

3. INVENTARIO (Activos)
   ├─ Compra → InventoryMovement (INGRESO) → Stock aumenta
   ├─ Venta → InventoryMovement (EGRESO) → Stock disminuye
   └─ Devolución → Return → Stock restaurado

4. REPORTES (Consolidado)
   └─ FinancialSummary → Ingresos - Gastos = Utilidad
```

---

## ✅ CONEXIONES VERIFICADAS

### 1. VENTAS → CUENTAS POR COBRAR ✅

**Flujo**:
```python
PreSale (creada) 
  → AccountReceivable (automático)
  → DeliveryBatch (asignada a ruta)
  → CashSettlement (liquidación)
  → Ingreso registrado
```

**Código actual**:
- ✅ `AccountReceivable` se crea con `pre_sale` (OneToOne)
- ✅ `total_amount` y `remaining_balance` se calculan
- ✅ `register_payment()` actualiza saldo

**Estado**: CONECTADO ✅

---

### 2. LIQUIDACIÓN → INGRESOS ✅

**Flujo**:
```python
DeliveryBatch (completado)
  → CashSettlement (contabilidad procesa)
  → expected_amount vs received_amount
  → difference calculada
```

**Código actual**:
```python
class CashSettlement(models.Model):
    batch = models.OneToOneField(DeliveryBatch)
    expected_amount = models.DecimalField(...)
    received_amount = models.DecimalField(...)
    difference = models.DecimalField(...)  # Auto-calculado
    
    def save(self):
        self.difference = self.received_amount - self.expected_amount
```

**Estado**: CONECTADO ✅

---

### 3. NÓMINA → GASTOS ✅

**Flujo**:
```python
PayrollPayment (pago de sueldo)
  → Expense (PERSONAL) creado automáticamente
```

**Código actual**:
```python
class PayrollPayment(models.Model):
    def save(self):
        self.total_net = amount_paid + bonus - deductions
        super().save()
        
        # ✅ CONEXIÓN: Crea gasto automáticamente
        Expense.objects.create(
            description=f"Nómina: {self.user.username}",
            amount=self.total_net,
            category='PERSONAL'
        )
```

**Estado**: CONECTADO ✅

---

### 4. PROVEEDORES → GASTOS ✅

**Flujo**:
```python
AccountPayable (deuda a proveedor)
  → register_payment() llamado
  → Expense (OTROS) creado automáticamente
```

**Código actual**:
```python
class AccountPayable(models.Model):
    def register_payment(self, amount):
        self.remaining_balance -= amount
        if self.remaining_balance <= 0:
            self.status = 'PAGADO'
        self.save()
        
        # ✅ CONEXIÓN: Crea gasto automáticamente
        Expense.objects.create(
            description=f"Pago a Proveedor: {self.provider_name}",
            amount=amount,
            category='OTROS'
        )
```

**Estado**: CONECTADO ✅

---

### 5. CAJA CHICA → GASTOS 🆕

**Flujo**:
```python
PettyCashTransaction (gasto diario)
  → current_balance actualizado automáticamente
```

**Código actual**:
```python
class PettyCashTransaction(models.Model):
    def save(self):
        if not self.pk:  # Solo en creación
            if self.transaction_type == 'INGRESO':
                self.petty_cash.current_balance += self.amount
            else:  # GASTO
                self.petty_cash.current_balance -= self.amount
            self.petty_cash.save()
        super().save()
```

**Estado**: CONECTADO ✅

**⚠️ MEJORA NECESARIA**: Caja Chica NO crea Expense automáticamente

---

### 6. INVENTARIO → VENTAS ✅

**Flujo**:
```python
PreSale (confirmada)
  → Stock reservado (stock_reserved)
  → DeliveryBatch (asignada)
  → Entrega confirmada
  → Stock descontado (stock - quantity)
```

**Código actual**:
- ✅ `Product.stock_reserved` se actualiza al crear preventa
- ✅ `Product.stock` se descuenta al confirmar entrega
- ✅ `InventoryMovement` registra movimientos

**Estado**: CONECTADO ✅

---

## 🔧 MEJORAS NECESARIAS

### 1. Conectar Caja Chica con Expense

**Problema**: Los gastos de Caja Chica no se reflejan en Expense

**Solución**:
```python
class PettyCashTransaction(models.Model):
    def save(self):
        if not self.pk and self.transaction_type == 'GASTO':
            # Actualizar saldo
            self.petty_cash.current_balance -= self.amount
            self.petty_cash.save()
            
            # ✅ NUEVO: Crear gasto automáticamente
            from .models import Expense
            Expense.objects.create(
                description=f"Caja Chica: {self.description}",
                amount=self.amount,
                category='OTROS'
            )
        super().save()
```

---

### 2. Dashboard Financiero Consolidado

**Crear vista que muestre**:
```python
INGRESOS:
  + Liquidaciones (CashSettlement.received_amount)
  + Pagos de clientes (AccountReceivable.register_payment)

GASTOS:
  - Nómina (Expense.PERSONAL)
  - Proveedores (Expense.OTROS)
  - Caja Chica (PettyCashTransaction.GASTO)
  - Servicios (Expense.SERVICIOS)
  - Logística (Expense.LOGISTICA)

UTILIDAD = INGRESOS - GASTOS
```

---

## 📋 CHECKLIST DE CONEXIONES

### Ingresos
- [x] Preventa → Cuenta por Cobrar
- [x] Liquidación → Ingreso registrado
- [x] Pago de cliente → Saldo actualizado

### Gastos
- [x] Nómina → Expense automático
- [x] Proveedor → Expense automático
- [ ] Caja Chica → Expense automático (FALTA)

### Inventario
- [x] Preventa → Stock reservado
- [x] Entrega → Stock descontado
- [x] Devolución → Stock restaurado

### Reportes
- [x] FinancialSummary existe
- [ ] Incluye Caja Chica (FALTA)

---

## 🎯 IMPLEMENTACIÓN INMEDIATA

Voy a agregar la conexión faltante de Caja Chica → Expense:

```python
# En models.py, actualizar PettyCashTransaction.save()
def save(self, *args, **kwargs):
    if not self.pk:  # Solo en creación
        if self.transaction_type == 'INGRESO':
            self.petty_cash.current_balance += self.amount
        else:  # GASTO
            self.petty_cash.current_balance -= self.amount
            
            # ✅ NUEVO: Registrar en Expense
            Expense.objects.create(
                description=f"Caja Chica - {self.category}: {self.description}",
                amount=self.amount,
                category='OTROS',
                registered_by=self.user
            )
        
        self.petty_cash.save()
    super().save(*args, **kwargs)
```

---

## ✅ RESUMEN FINAL

**Conexiones Actuales**: 5/6 ✅  
**Conexión Faltante**: Caja Chica → Expense  
**Tiempo de implementación**: 5 minutos  

**¿Implemento la conexión faltante ahora?** 🚀
