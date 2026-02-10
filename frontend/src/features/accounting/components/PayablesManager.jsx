import { useState, useEffect } from 'react';
import { accountingService } from '../services/accountingService';
import { useCurrency } from '../../../context/CurrencyContext';

export function PayablesManager() {
    const { formatAmount } = useCurrency();
    const [payables, setPayables] = useState([]);
    const [isProcessing, setIsProcessing] = useState(null);
    const [status, setStatus] = useState({ type: null, message: "" });

    useEffect(() => { 
        loadPayables(); 
    }, []);

    const loadPayables = async () => {
        try {
            const data = await accountingService.getPayables();
            // Filtrar para mostrar solo los que tienen saldo pendiente
            const pending = data.filter(p => Number(p.remaining_balance) > 0);
            setPayables(pending);
        } catch (error) {
            setStatus({ type: "error", message: "Error al sincronizar las obligaciones pendientes." });
        }
    };

    const handlePayment = async (payable) => {
        try {
            setIsProcessing(payable.id);
            setStatus({ type: "loading", message: "Registrando liquidación en contabilidad..." });

            // 1. Llamada al servicio con el método correcto y monto
            await accountingService.payProvider(payable.id, payable.remaining_balance);

            // 2. Éxito: Filtrar localmente para remover de la vista inmediatamente
            setPayables(prev => prev.filter(item => item.id !== payable.id));

            setStatus({ type: "success", message: "Pago liquidado y removido de pendientes." });
            
            // 3. Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => setStatus({ type: null, message: "" }), 3000);
        } catch (error) {
            console.error(error);
            setStatus({ 
                type: "error", 
                message: "No se pudo procesar el pago. Verifique los fondos en caja o la conexión." 
            });
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex flex-col">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Cuentas por Pagar</h3>
                    <p className="text-[10px] text-slate-400">Gestión de obligaciones y fletes de distribución</p>
                </div>
                
                {status.message && (
                    <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300 border ${
                        status.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                        status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                        'bg-blue-50 border-blue-100 text-blue-600 animate-pulse'
                    }`}>
                        {status.message}
                    </div>
                )}
            </header>

            <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/30">
                        <th className="px-6 py-3">Proveedor / Concepto</th>
                        <th className="px-6 py-3">Vencimiento</th>
                        <th className="px-6 py-3">Saldo Pendiente</th>
                        <th className="px-6 py-3 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {payables.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-xs italic">
                                No existen obligaciones pendientes de pago.
                            </td>
                        </tr>
                    ) : (
                        payables.map(p => (
                            <tr key={p.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700">{p.provider_name}</span>
                                        <span className="text-[10px] text-slate-400 leading-tight">{p.description}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                                    {p.due_date}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-black text-rose-600 bg-rose-50 px-2 py-1 rounded">
                                        {formatAmount(p.remaining_balance)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        disabled={isProcessing === p.id}
                                        onClick={() => handlePayment(p)}
                                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isProcessing === p.id 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200'
                                        }`}
                                    >
                                        {isProcessing === p.id ? "Procesando..." : "Liquidar Pago"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}