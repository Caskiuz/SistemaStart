import { useState, useEffect } from "react";
import { distributionService } from "../../distribution/services/distributionService";

export function ReturnsManager() {
    const [pendingReturns, setPendingReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const loadReturns = async () => {
        setLoading(true);
        const res = await distributionService.getPendingReturns();
        if (res.success) setPendingReturns(res.data);
        setLoading(false);
    };

    useEffect(() => { loadReturns(); }, []);

    const handleConfirm = async (id) => {
        setProcessingId(id);
        const res = await distributionService.confirmReturn(id);
        if (res.success) {
            setPendingReturns(prev => prev.filter(item => item.id !== id));
        }
        setProcessingId(null);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-3">
            <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-600 animate-spin rounded-full" />
            <p className="text-xs font-medium text-gray-500">Cargando devoluciones...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 font-sans antialiased text-gray-800">
            <header className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Gestión de Retornos</h2>
                    <p className="text-xs font-medium text-gray-500 mt-1">Control de reingreso de mercancía al inventario central</p>
                </div>
                <button 
                    onClick={loadReturns} 
                    className="p-2.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-all shadow-sm active:scale-95"
                    title="Actualizar lista"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
            </header>

            <div className="space-y-4">
                {pendingReturns.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
                        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="flex items-center gap-3 mb-5">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase ${
                                    item.status === 'CANCELADO' 
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                                }`}>
                                    {item.status === 'CANCELADO' ? 'Rechazo Total' : 'Rechazo Parcial'}
                                </span>
                                <span className="text-[10px] font-semibold font-mono text-gray-400">REF: #P{item.id}</span>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-base font-bold text-gray-900">{item.client}</h4>
                                <p className="text-[11px] text-gray-500 mt-1">
                                    Agente de entrega: <span className="font-semibold text-gray-700">{item.distributor}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Artículos para reingreso</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {item.items.map((prod, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                                            <span className="text-[11px] font-medium text-gray-600">{prod.product_name}</span>
                                            <span className="text-[11px] font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                                                Cant: {prod.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:w-64 bg-gray-50/50 p-6 flex flex-col justify-center items-center">
                            <button
                                disabled={processingId === item.id}
                                onClick={() => handleConfirm(item.id)}
                                className={`w-full py-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all border ${
                                    processingId === item.id 
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                    : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800 shadow-sm active:scale-95'
                                }`}
                            >
                                {processingId === item.id ? "Procesando..." : "Confirmar Ingreso"}
                            </button>
                            <p className="mt-4 text-[9px] text-gray-400 font-medium text-center uppercase tracking-tight">
                                El stock se actualizará automáticamente
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}