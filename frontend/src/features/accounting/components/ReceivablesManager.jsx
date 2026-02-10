import { useState, useEffect } from 'react';
import { accountingService } from '../services/accountingService';
import { useCurrency } from '../../../context/CurrencyContext';

export function ReceivablesManager() {
    const { formatAmount } = useCurrency();
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [confirmingId, setConfirmingId] = useState(null);

    useEffect(() => {
        accountingService.getDebts().then(data => {
            const debtsData = Array.isArray(data) ? data : data.results || [];
            setDebts(debtsData);
            setLoading(false);
        });
    }, []);

    const showNotification = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handlePayment = async (debtId, amount) => {
        setConfirmingId(null); 
        setLoading(true);
        try {
            await accountingService.payDebt(debtId, amount);
            showNotification("Pago registrado con éxito", "success");
            const updated = await accountingService.getDebts();
            const debtsData = Array.isArray(updated) ? updated : updated.results || [];
            setDebts(debtsData);
        } catch (err) {
            showNotification("Error al procesar el cobro", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading && debts.length === 0) return (
        <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Cargando Cartera...</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <header className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Cuentas por Cobrar</h3>
                    {message.text && (
                        <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border animate-in fade-in zoom-in ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                            {message.text}
                        </span>
                    )}
                </div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">
                    Pendientes: {debts.filter(d => d.status !== 'PAGADO').length}
                </span>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Saldo Pendiente</th>
                            <th className="px-6 py-3 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {debts.map(debt => (
                            <tr key={debt.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-slate-700">{debt.client_name || "Sin Nombre"}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Nota #{debt.pre_sale}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                        debt.status === 'VENCIDO' ? 'bg-rose-100 text-rose-600' : 
                                        debt.status === 'PENDIENTE' ? 'bg-amber-100 text-amber-600' : 
                                        'bg-emerald-100 text-emerald-600'
                                    }`}>
                                        {debt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-900">{formatAmount(debt.remaining_balance)}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {debt.status !== 'PAGADO' && (
                                        <div className="flex justify-end items-center gap-2">
                                            {confirmingId === debt.id ? (
                                                <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">¿Confirmar?</span>
                                                    <button 
                                                        onClick={() => handlePayment(debt.id, debt.remaining_balance)}
                                                        className="bg-emerald-500 text-white text-[9px] px-2 py-1 rounded font-bold hover:bg-emerald-600"
                                                    >
                                                        SÍ
                                                    </button>
                                                    <button 
                                                        onClick={() => setConfirmingId(null)}
                                                        className="bg-slate-200 text-slate-600 text-[9px] px-2 py-1 rounded font-bold hover:bg-slate-300"
                                                    >
                                                        NO
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setConfirmingId(debt.id)}
                                                    className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md uppercase tracking-tighter transition-all"
                                                >
                                                    Liquidar
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}