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
            
            const historyRes = await distributionService.getMyHistory();
            console.log('📊 History Response:', historyRes);
            if (historyRes.success) {
                const historyData = historyRes.data?.data || historyRes.data || [];
                console.log('📦 History Data:', historyData);
                setCompletedBatches(Array.isArray(historyData) ? historyData : []);
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
            loadData();
        }
    };

    const handleViewPDF = async (saleId) => {
        setIsGenerating(true);
        const res = await preSaleService.getPDFBlob(saleId);

        if (res.success) {
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
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
            <div className="max-w-md mx-auto mt-10 px-4">
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-3xl mb-6 bg-white">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-slate-800 font-semibold text-sm">Sin rutas activas</h3>
                    <p className="text-slate-500 text-xs mt-1">Espera a que te asignen una ruta</p>
                    <button onClick={loadData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">🔄 Actualizar</button>
                </div>
                
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-xl">📊</span> Historial de Entregas
                    </h4>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : completedBatches.length > 0 ? (
                        <div className="space-y-3">
                            {completedBatches.map(b => (
                                <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{b.route_name}</p>
                                            <p className="text-xs text-slate-500">{new Date(b.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                            ✅ COMPLETADO
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">📦</span>
                                            <span className="text-xs font-semibold text-slate-700">{b.deliveries?.length || 0} entregas</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">⏱️</span>
                                            <span className="text-xs text-slate-600">{new Date(b.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📦</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">No hay entregas completadas</p>
                            <p className="text-xs text-slate-400">Completa tu primera ruta para ver el historial</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const pendingDeliveries = batch.deliveries?.filter(d => d.delivery_status !== 'COMPLETADO') || [];

    if (pendingDeliveries.length === 0 && user.role !== 'GERENCIA') {
        return (
            <div className="max-w-md mx-auto mt-10 px-4">
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-3xl mb-6 bg-white">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-slate-900 font-semibold text-base">Ruta completada</h3>
                    <p className="text-slate-500 text-xs mt-1">Has finalizado todas las entregas.</p>
                    <button onClick={loadData} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">🔄 Actualizar</button>
                </div>
                
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-xl">📊</span> Historial de Entregas
                    </h4>
                    {completedBatches.length > 0 ? (
                        <div className="space-y-3">
                            {completedBatches.map(b => (
                                <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{b.route_name}</p>
                                            <p className="text-xs text-slate-500">{new Date(b.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                            ✅ COMPLETADO
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">📦</span>
                                            <span className="text-xs font-semibold text-slate-700">{b.deliveries?.length || 0} entregas</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">⏱️</span>
                                            <span className="text-xs text-slate-600">{new Date(b.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📦</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">No hay entregas completadas</p>
                            <p className="text-xs text-slate-400">Completa tu primera ruta para ver el historial</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-5 pb-20">
            {user.role === 'GERENCIA' && allBatches.length > 0 && (
                <div className="mb-6 bg-indigo-50 p-4 rounded-2xl">
                    <select
                        className="w-full bg-white rounded-xl p-3 text-sm"
                        onChange={(e) => setBatch(allBatches.find(b => b.id === parseInt(e.target.value)))}
                        value={batch?.id || ""}
                    >
                        {allBatches.map(b => (
                            <option key={b.id} value={b.id}>
                                🚚 {b.distributor_name} - {b.route_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <header className="mb-8 border-b pb-5">
                <h2 className="text-xl font-semibold">{batch.route_name}</h2>
            </header>

            <div className="space-y-4">
                {(user.role === 'GERENCIA' ? batch.deliveries : pendingDeliveries).map(assign => (
                    <div key={assign.id} className="bg-white rounded-2xl border p-5">
                        <h3 className="font-semibold text-sm mb-2">{assign.presale_details.client_business_name}</h3>
                        <p className="text-xs text-slate-500 mb-4">Estado: {assign.presale_details.status} | Delivery: {assign.delivery_status}</p>
                        
                        {/* Lista de productos */}
                        <div className="mb-4 bg-slate-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-slate-700 mb-2">📦 Productos a entregar:</p>
                            {assign.presale_details.items?.map(item => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-slate-800">{item.product_name}</p>
                                        <p className="text-[10px] text-slate-500">Cantidad: {item.quantity} | Precio: ${item.price_at_sale}</p>
                                    </div>
                                    {assign.delivery_status === 'ENTREGANDO' && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-[10px] text-slate-600">🔄 Devolver:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={item.quantity}
                                                value={returns[item.id] || 0}
                                                onChange={(e) => setReturns({...returns, [item.id]: parseInt(e.target.value) || 0})}
                                                className="w-14 px-2 py-1 text-xs border rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => handleUpdateState(assign.id, 'EN_CAMINO')}
                                    disabled={assign.delivery_status !== 'ASIGNADO'}
                                    className={`py-2 rounded-lg text-[10px] font-bold ${
                                        assign.delivery_status === 'EN_CAMINO' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white border text-blue-600 disabled:opacity-30'
                                    }`}
                                >
                                    🚗 En Camino
                                </button>
                                <button
                                    onClick={() => handleUpdateState(assign.id, 'LLEGADO')}
                                    disabled={assign.delivery_status !== 'EN_CAMINO'}
                                    className={`py-2 rounded-lg text-[10px] font-bold ${
                                        assign.delivery_status === 'LLEGADO'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white border text-orange-600 disabled:opacity-30'
                                    }`}
                                >
                                    📍 Llegado
                                </button>
                                <button
                                    onClick={() => handleUpdateState(assign.id, 'ENTREGANDO')}
                                    disabled={assign.delivery_status !== 'LLEGADO'}
                                    className={`py-2 rounded-lg text-[10px] font-bold ${
                                        assign.delivery_status === 'ENTREGANDO'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white border text-purple-600 disabled:opacity-30'
                                    }`}
                                >
                                    📦 Entregando
                                </button>
                            </div>
                            
                            {assign.delivery_status === 'ENTREGANDO' && Object.values(returns).some(qty => qty > 0) ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(assign.presale, 'CONFIRMADO')}
                                        className="bg-yellow-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-yellow-700 transition-colors"
                                    >
                                        🔄 Entrega Parcial (con devoluciones)
                                    </button>
                                    <button
                                        onClick={() => { setReturns({}); handleUpdateStatus(assign.presale, 'CONFIRMADO'); }}
                                        className="bg-green-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors"
                                    >
                                        ✅ Entrega Completa
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUpdateStatus(assign.presale, 'CONFIRMADO')}
                                    disabled={assign.delivery_status !== 'ENTREGANDO'}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-green-700 transition-colors"
                                >
                                    ✅ ENTREGADO (Verificar GPS)
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {completedBatches.length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-xl">📊</span> Historial de Entregas
                    </h4>
                    <div className="space-y-3">
                        {completedBatches.map(b => (
                            <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{b.route_name}</p>
                                        <p className="text-xs text-slate-500">{new Date(b.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                        ✅ COMPLETADO
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg">📦</span>
                                        <span className="text-xs font-semibold text-slate-700">{b.deliveries?.length || 0} entregas</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg">⏱️</span>
                                        <span className="text-xs text-slate-600">{new Date(b.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
