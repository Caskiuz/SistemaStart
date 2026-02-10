import { useState, useEffect } from "react";
import { distributionService } from "../services/distributionService";
import { preSaleService } from "../../presale/services/preSaleServices";
import { useAuth } from "../../auth/context/AuthContext";

export function RoutesList() {
    const { user } = useAuth();
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isGenerating, setIsGenerating] = useState(false);
    const [allBatches, setAllBatches] = useState([]);
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [completedBatches, setCompletedBatches] = useState([]);

    const [returns, setReturns] = useState({});
    const [reprogramTarget, setReprogramTarget] = useState(null);
    const [reprogramData, setReprogramData] = useState({ date: "", reason: "" });
    const [proximityWarning, setProximityWarning] = useState(null);
    const [justification, setJustification] = useState("");

    // 1. CAMBIO: Función unificada para cargar datos según el ROL
    const loadData = async () => {
        setLoading(true);
        if (user.role === 'GERENCIA') {
            const res = await distributionService.getAllRoutes();
            if (res.success) {
                const data = res.data?.data || res.data;
                const activeBatches = data.filter(b => b.status !== 'FINALIZADO');
                setAllBatches(activeBatches);
                if (activeBatches.length > 0) {
                    setBatch(activeBatches[0]);
                } else {
                    setBatch(null);
                }
            }
        } else {
            const res = await distributionService.getMyRoute();
            const data = res.data?.data || res.data || res;
            if (data && (res.success || res.data?.success)) {
                setBatch(data);
            } else {
                setBatch(null);
            }
            
            // Load completed batches for history
            const historyRes = await distributionService.getAllRoutes();
            if (historyRes.success) {
                const allData = historyRes.data?.data || historyRes.data;
                const completed = allData.filter(b => 
                    b.status === 'FINALIZADO' && 
                    b.distributor === user.id
                );
                setCompletedBatches(completed);
            }
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [user.role]);

    const handleUpdateStatus = async (presaleId, status) => {
        const returned_items = status === 'CONFIRMADO' ?
            Object.keys(returns).map(id => ({
                item_id: parseInt(id),
                quantity: returns[id]
            })).filter(item => item.quantity > 0) : [];

        const payload = {
            presale_id: presaleId,
            status,
            returned_items
        };

        if (status === 'CONFIRMADO' && proximityWarning && justification) {
            payload.justification = justification;
        }

        const res = await distributionService.updateStatus(
            batch.id,
            presaleId,
            status,
            returned_items,
            null,
            null,
            justification
        );

        if (res.success || res.data?.success) {
            setReturns({});
            setProximityWarning(null);
            setJustification("");
            loadData();
        } else if (res.data?.requires_justification) {
            setProximityWarning({
                presaleId,
                distance: res.data.distance_km,
                message: res.data.message
            });
        }
    };

    const handleUpdateState = async (deliveryId, newState) => {
        const res = await distributionService.updateDeliveryState(batch.id, deliveryId, newState);
        if (res.success) {
            loadData();
        }
    };

    const handleConfirmReprogram = async () => {
        if (!reprogramData.date || !reprogramData.reason) return;

        const res = await distributionService.updateStatus(
            batch.id,
            reprogramTarget.presale,
            'REPROGRAMADO',
            [],
            reprogramData.date,
            reprogramData.reason
        );

        if (res.success || res.data?.success) {
            setReprogramTarget(null);
            setReprogramData({ date: "", reason: "" });
            loadData(); // 3. CAMBIO: Usar loadData en lugar de loadMyRoute
        }
    };

    const handleViewPDF = async (saleId) => {
        setIsGenerating(true);
        setMessage({ type: "info", text: "Generando vista previa del documento..." });
        const res = await preSaleService.getPDFBlob(saleId);

        if (res.success) {
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setMessage({ type: "success", text: "Nota de venta generada correctamente" });
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                setMessage({ type: "", text: "" });
            }, 3000);
        } else {
            setMessage({ type: "error", text: "Error: No se pudo recuperar el documento" });
        }
        setIsGenerating(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-3" />
                <p className="text-xs text-slate-500 font-medium">Verificando despacho...</p>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 text-center border border-dashed border-slate-200 rounded-3xl">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </div>
                <h3 className="text-slate-800 font-semibold text-sm">Sin rutas asignadas</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">No hay despachos disponibles para mostrar.</p>
            </div>
        );
    }

    const pendingDeliveries = batch.deliveries?.filter(d => d.delivery_status !== 'COMPLETADO') || [];

    if (pendingDeliveries.length === 0 && user.role !== 'GERENCIA') {
        return (
            <div className="max-w-md mx-auto mt-20 p-10 text-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-slate-900 font-semibold text-base">Ruta completada</h3>
                <p className="text-slate-500 text-xs mt-1">Has finalizado todas las entregas.</p>
                <button onClick={loadData} className="mt-6 text-blue-600 text-xs font-semibold hover:underline">Actualizar lista</button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-5 pb-20 font-sans text-slate-900 antialiased">

            {/* 4. CAMBIO: Selector visual para el Admin */}
            {user.role === 'GERENCIA' && allBatches.length > 0 && (
                <div className="mb-6 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <label className="block text-[10px] font-bold text-indigo-400 uppercase mb-2 ml-1">
                        Panel Admin: Seleccionar Distribuidor
                    </label>
                    <select
                        className="w-full bg-white border-none rounded-xl p-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer"
                        onChange={(e) => setBatch(allBatches.find(b => b.id === parseInt(e.target.value)))}
                        value={batch?.id || ""}
                    >
                        {allBatches.map(b => (
                            <option key={b.id} value={b.id}>
                                🚚 {b.distributor_name || b.distributor || 'Sin nombre'} - {b.route_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {proximityWarning && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-amber-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">⚠️</span>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-800">Validación de Proximidad</h3>
                        </div>
                        <p className="text-xs text-slate-600 mb-4">{proximityWarning.message}</p>
                        <div className="mb-4">
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5 ml-1">Justificación requerida</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                                rows="3"
                                placeholder="Explica por qué estás lejos del cliente..."
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => { setProximityWarning(null); setJustification(""); }} className="py-3 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">Cancelar</button>
                            <button 
                                onClick={() => handleUpdateStatus(proximityWarning.presaleId, 'CONFIRMADO')} 
                                disabled={!justification.trim()}
                                className="py-3 bg-amber-600 text-white rounded-xl text-xs font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reprogramTarget && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-800 mb-4">Reprogramar entrega</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5 ml-1">Nueva Fecha</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-slate-300 transition-colors"
                                    value={reprogramData.date}
                                    onChange={(e) => setReprogramData({ ...reprogramData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5 ml-1">Motivo del cambio</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-slate-300 transition-colors appearance-none"
                                    value={reprogramData.reason}
                                    onChange={(e) => setReprogramData({ ...reprogramData, reason: e.target.value })}
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="CLIENTE_AUSENTE">Cliente no se encuentra</option>
                                    <option value="LOCAL_CERRADO">Establecimiento cerrado</option>
                                    <option value="SIN_DINERO">Falta de presupuesto</option>
                                    <option value="ERROR_PEDIDO">Discrepancia en pedido</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button onClick={() => setReprogramTarget(null)} className="py-3 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">Cancelar</button>
                            <button onClick={handleConfirmReprogram} className="py-3 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition-colors">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            <header className="mb-8 border-b border-slate-100 pb-5">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    {user.role === 'GERENCIA' ? `Monitoreo: ${batch.distributor_name}` : 'Despacho en curso'}
                </span>
                <h2 className="text-xl font-semibold text-slate-900 mt-1">{batch.route_name}</h2>
            </header>

            {message.text && (
                <div className={`mb-4 p-3 rounded-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                    message.type === "info" ? "bg-blue-50 border-blue-100 text-blue-700" :
                        "bg-rose-50 border-rose-100 text-rose-700"
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${message.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                        }`} />
                    <p className="text-[10px] font-bold uppercase tracking-wider">{message.text}</p>
                </div>
            )}

            <div className="space-y-4">
                {(user.role === 'GERENCIA' ? batch.deliveries : pendingDeliveries).map(assign => (
                    <div key={assign.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{assign.presale_details.client_business_name}</h3>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Referencia: #{assign.presale}</p>
                                </div>
                                <button
                                    onClick={() => handleViewPDF(assign.presale)}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-[9px] font-bold uppercase">PDF</span>
                                </button>
                                <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${assign.presale_details.status === 'ASIGNADO' ? 'bg-slate-100 text-slate-500' :
                                    assign.presale_details.status === 'CONFIRMADO' ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-rose-100 text-rose-600'
                                    }`}>
                                    {assign.presale_details.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-50/30">
                            <div className="space-y-3 mb-6">
                                {assign.presale_details.items.map(item => (
                                    <div key={item.id} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600">{item.product_name}</span>
                                            <span className="text-xs font-semibold text-slate-900">Cant: {item.quantity}</span>
                                        </div>
                                        {assign.presale_details.status === 'ASIGNADO' && (
                                            <div className="flex items-center justify-end gap-3">
                                                <label className="text-[10px] text-slate-400 font-medium italic">Retorno:</label>
                                                <input
                                                    type="number" min="0" max={item.quantity}
                                                    value={returns[item.id] || 0}
                                                    className="w-12 h-7 bg-white border border-slate-200 rounded-md text-center text-xs font-medium focus:border-blue-400 outline-none transition-colors"
                                                    onChange={(e) => setReturns({ ...returns, [item.id]: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {assign.presale_details.status === 'ASIGNADO' && (
                                <div className="flex flex-col gap-2.5">
                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                        <button
                                            onClick={() => handleUpdateState(assign.id, 'EN_CAMINO')}
                                            disabled={assign.delivery_status !== 'ASIGNADO'}
                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
                                                assign.delivery_status === 'EN_CAMINO' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30'
                                            }`}
                                        >
                                            🚗 En Camino
                                        </button>
                                        <button
                                            onClick={() => handleUpdateState(assign.id, 'LLEGADO')}
                                            disabled={assign.delivery_status !== 'EN_CAMINO'}
                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
                                                assign.delivery_status === 'LLEGADO'
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-30'
                                            }`}
                                        >
                                            📍 Llegado
                                        </button>
                                        <button
                                            onClick={() => handleUpdateState(assign.id, 'ENTREGANDO')}
                                            disabled={assign.delivery_status !== 'LLEGADO'}
                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
                                                assign.delivery_status === 'ENTREGANDO'
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 disabled:opacity-30'
                                            }`}
                                        >
                                            📦 Entregando
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateStatus(assign.presale, 'CONFIRMADO')}
                                        disabled={assign.delivery_status !== 'ENTREGANDO'}
                                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium text-xs hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ✅ Confirmar Entrega
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setReprogramTarget(assign)} className="py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-medium hover:bg-slate-50 transition-colors">Reprogramar</button>
                                        <button onClick={() => handleUpdateStatus(assign.presale, 'CANCELADO')} className="py-2.5 bg-white border border-rose-100 text-rose-500 rounded-xl text-[11px] font-medium hover:bg-rose-50 transition-colors">Rechazar</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}