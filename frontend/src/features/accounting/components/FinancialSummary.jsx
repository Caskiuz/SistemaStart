import { useEffect, useState } from 'react';
import { accountingService } from '../services/accountingService';
import { useCurrency } from '../../../context/CurrencyContext';

export function FinancialSummary() {
    const { formatAmount } = useCurrency();
    const [report, setReport] = useState(null);

    useEffect(() => {
        accountingService.getFinancialStatement().then(setReport);
    }, []);

    if (!report) return null;

    const cards = [
        { label: "Efectivo en Caja", value: report.income_cash, color: "text-emerald-600" },
        { label: "Cuentas por Cobrar", value: report.receivables, color: "text-blue-600" },
        { label: "Gastos Totales", value: report.expenses, color: "text-rose-600" },
        { label: "Cuentas por Pagar", value: report.payables, color: "text-amber-600" },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map((c, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            {c.label}
                        </p>
                        <p className={`text-xl font-semibold ${c.color}`}>
                            {formatAmount(c.value)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Utilidad Neta
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Balance calculado del periodo actual
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${report.net_utility >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                        {formatAmount(report.net_utility)}
                    </p>
                </div>
            </div>
        </div>
    );
}