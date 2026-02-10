import { useState, useEffect } from "react";
import { accountingService } from "../services/accountingService";

export function SettlementList({ onSelectBatch }) {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getPendingSettlements();
            setPending(data);
        } catch (error) {
            console.error("Error cargando pendientes:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400 animate-pulse">Buscando rutas por liquidar...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Rutas Pendientes de Cobro</h2>
                    <p className="text-xs text-slate-500 mt-1">Seleccione un despacho para recibir el efectivo del distribuidor.</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {pending.length} Pendientes
                </div>
            </div>

            {pending.length === 0 ? (
                <div className="border-2 border-dashed border-slate-100 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-slate-300">✓</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">No hay rutas pendientes de liquidación en este momento.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pending.map((batch) => (
                        <div
                            key={batch.id}
                            className="group bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => onSelectBatch(batch.id)}
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-slate-200">
                                    #{batch.id}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                                        {batch.route_name}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                            {batch.distributor_name}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                            {new Date(batch.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                                Liquidar Caja
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}