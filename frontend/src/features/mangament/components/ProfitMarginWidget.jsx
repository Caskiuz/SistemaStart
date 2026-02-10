import { useCurrency } from '../../../context/CurrencyContext';

export function ProfitMarginWidget({ sales = 0, expenses = 0, debt = 0 }) {
    const { formatAmount } = useCurrency();
    const profit = sales - expenses;
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Balance Contable</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>Ingresos Confirmados</span>
                    <span>{formatAmount(sales)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-rose-500">
                    <span>Egresos Totales</span>
                    <span>- {formatAmount(expenses)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-amber-600 pb-2 border-b border-slate-50">
                    <span>Cuentas por Cobrar</span>
                    <span>+ {formatAmount(debt)}</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Utilidad Operativa</span>
                    <span className={`text-lg font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatAmount(profit)}
                    </span>
                </div>
            </div>
        </div>
    );
}