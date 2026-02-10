import { useState, useEffect } from "react";
import { accountingService } from "../services/accountingService";
import { useCurrency } from "../../../context/CurrencyContext";

export function CashSettlementForm({ batchId, onComplete }) {
    const { formatAmount } = useCurrency();
    const [summary, setSummary] = useState(null);
    const [receivedAmount, setReceivedAmount] = useState("");
    const [debts, setDebts] = useState({});
    const [distributorPayment, setDistributorPayment] = useState(""); 
    const [observations, setObservations] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" }); 

    useEffect(() => {
        loadBatchSummary();
    }, [batchId]);

    const loadBatchSummary = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getBatchSummary(batchId);
            setSummary(data);
        } catch (error) {
            console.error(error);
            setStatus({ 
                type: "error", 
                message: "Error de conexión: No se pudo recuperar el resumen de la ruta." 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDebtChange = (presaleId, value) => {
        setDebts(prev => ({ ...prev, [presaleId]: value }));
    };

    const expected = Number(summary?.expected_amount || 0);
    const received = parseFloat(receivedAmount || 0);
    const totalInDebts = Object.values(debts).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const difference = (received + totalInDebts) - expected;

    const handleSettlement = async (e) => {
        e.preventDefault();
        
        if (receivedAmount === "" || received < 0) {
            setStatus({ type: "error", message: "Debe ingresar un monto recibido válido para procesar el arqueo." });
            return;
        }

        try {
            setIsSubmitting(true);
            setStatus({ type: "loading", message: "Sincronizando registros contables..." });
            
            // 1. Preparar lista de Cuentas por Cobrar (Clientes)
            const debtsList = Object.entries(debts)
                .filter(([_, amount]) => parseFloat(amount) > 0)
                .map(([id, amount]) => ({
                    presale_id: parseInt(id),
                    debt_amount: parseFloat(amount)
                }));

            const payload = {
                received_amount: received,
                observations: observations,
                debts: debtsList
            };

            // 2. Finalizar Liquidación de Caja
            await accountingService.finalizeSettlement(batchId, payload);

            // 3. Generar Cuenta por Pagar al Distribuidor (Campos corregidos para el Backend)
            if (parseFloat(distributorPayment) > 0) {
                const today = new Date();
                const dueDate = new Date();
                dueDate.setDate(today.getDate() + 7); // Vencimiento por defecto: 7 días

                await accountingService.createPayable({
                    provider_name: summary?.distributor || "Distribuidor Desconocido",
                    description: `Liquidación de Flete - Ruta #${batchId}`,
                    total_amount: parseFloat(distributorPayment),
                    remaining_balance: parseFloat(distributorPayment),
                    due_date: dueDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
                });
            }

            setStatus({ type: "success", message: "Operación exitosa: Caja cerrada y cuentas procesadas." });
            
            setTimeout(() => {
                onComplete();
            }, 1500);

        } catch (error) {
            console.error(error);
            setStatus({ 
                type: "error", 
                message: "Error técnico: Verifique los datos o contacte a soporte." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Calculando totales reales...</p>
        </div>
    );

    return (
        <div className="bg-white p-2">
            <header className="mb-8">
                <button 
                    onClick={onComplete}
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-tight hover:text-slate-900 transition-colors mb-4 flex items-center gap-2"
                >
                    ← Volver a pendientes
                </button>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Procesar Liquidación</h3>
                <p className="text-sm text-slate-500">Repartidor: <span className="font-semibold text-slate-700">{summary?.distributor}</span></p>
            </header>

            {/* Mensajes de Feedback Profesional */}
            {status.type && (
                <div className={`mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                    status.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                    status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    'bg-blue-50 border-blue-100 text-blue-600 animate-pulse'
                }`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSettlement} className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Desglose de Ventas y Créditos</p>
                    
                    <div className="space-y-4">
                        <div className="overflow-hidden border-b border-slate-200">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                                        <th className="text-left pb-2">Cliente</th>
                                        <th className="text-right pb-2">Venta</th>
                                        <th className="text-right pb-2 px-2">¿Quedó debiendo?</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {summary?.details?.map((detail, index) => (
                                        <tr key={index} className="text-xs">
                                            <td className="py-3 text-slate-600">{detail.client}</td>
                                            <td className="py-3 text-right font-mono font-bold text-slate-700">{formatAmount(detail.amount)}</td>
                                            <td className="py-3 text-right pl-4">
                                                <input 
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="w-20 bg-white border border-slate-200 rounded p-1 text-right text-[11px] focus:border-blue-500 outline-none"
                                                    onChange={(e) => handleDebtChange(detail.presale_id, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="pt-4 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-900 uppercase">EFECTIVO ESPERADO EN RUTA</span>
                            <span className="text-lg font-black text-blue-600">{formatAmount(expected)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Monto Recibido en Físico</label>
                        <input 
                            required
                            type="number" 
                            step="0.01"
                            value={receivedAmount}
                            onChange={(e) => setReceivedAmount(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-2xl font-black text-slate-800 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-blue-500 uppercase tracking-tight ml-1 font-black">Pago Acordado al Chofer (CXP)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={distributorPayment}
                            onChange={(e) => setDistributorPayment(e.target.value)}
                            className="w-full bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl text-2xl font-black text-blue-700 focus:border-blue-400 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Observaciones Finales</label>
                    <textarea 
                        rows="2"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm outline-none focus:border-slate-300 transition-all"
                        placeholder="Ej: El cliente Burger Shop pagará el resto el lunes..."
                    />
                </div>

                <div className={`p-4 rounded-2xl border-2 flex justify-between items-center transition-colors ${difference >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Cuadre de Caja (Incl. Deudas)</span>
                        <span className={`text-[11px] font-bold ${difference >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {difference >= 0 ? '✓ CUADRE CORRECTO' : '⚠ FALTANTE NO JUSTIFICADO'}
                        </span>
                    </div>
                    <span className={`text-xl font-black ${difference >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {formatAmount(difference)}
                    </span>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
                >
                    {isSubmitting ? "Sincronizando..." : "Finalizar y Generar Cuentas"}
                </button>
            </form>
        </div>
    );
}