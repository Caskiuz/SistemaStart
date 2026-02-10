import { useState, useEffect } from "react";
import { distributionService } from "../services/distributionService";
import { preSaleService } from "../../presale/services/preSaleServices";
import { useCurrency } from "../../../context/CurrencyContext";

export function LogisticsPanel() {
    const { formatAmount } = useCurrency();
    const [pendingSales, setPendingSales] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [occupiedDistributors, setOccupiedDistributors] = useState([]);
    const [selectedSales, setSelectedSales] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState("");
    const [selectedDistributor, setSelectedDistributor] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const loadData = async () => {
            const [resSales, resMeta] = await Promise.all([
                distributionService.getPendingPreSales(),
                distributionService.getMetadata()
            ]);
            if (resSales.success) {
                const salesData = Array.isArray(resSales.data) ? resSales.data : resSales.data.results || [];
                setPendingSales(salesData);
            }
            if (resMeta.success) {
                setRoutes(resMeta.data.routes);
                setDistributors(resMeta.data.distributors);
                setOccupiedDistributors(resMeta.data.occupied_distributors || []);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const toggleSelection = (id) => {
        if (isSubmitting) return;
        setSelectedSales(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const isDistributorOccupied = occupiedDistributors.includes(Number(selectedDistributor));

    const handleAssign = async () => {
        if (!selectedRoute || !selectedDistributor || selectedSales.length === 0 || isDistributorOccupied) return;

        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        const data = {
            route_id: selectedRoute,
            distributor_id: selectedDistributor,
            presale_ids: selectedSales
        };

        const res = await distributionService.createRouteSheet(data);
        if (res.success) {
            setMessage({ type: "success", text: "HOJA DE RUTA GENERADA CON ÉXITO" });
            setSelectedSales([]);
            setSelectedRoute("");
            setSelectedDistributor("");

            const [refreshSales, refreshMeta] = await Promise.all([
                distributionService.getPendingPreSales(),
                distributionService.getMetadata()
            ]);
            if (refreshSales.success) {
                const salesData = Array.isArray(refreshSales.data) ? refreshSales.data : refreshSales.data.results || [];
                setPendingSales(salesData);
            }
            if (refreshMeta.success) setOccupiedDistributors(refreshMeta.data.occupied_distributors || []);
        } else {
            setMessage({ type: "error", text: res.error?.message || "ERROR EN LA GENERACIÓN" });
        }
        setIsSubmitting(false);
    };

    const handleViewPDF = async (saleId) => {
        const res = await preSaleService.getPDFBlob(saleId);

        if (res.success) {
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } else {
            setMessage({ type: "error", text: "No se pudo visualizar la nota" });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-3">
            <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-600 animate-spin rounded-full" />
            <p className="text-xs font-medium text-gray-500 tracking-wide">Cargando datos...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 font-sans antialiased text-gray-800">
            <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Panel Logístico</h2>
                    <p className="text-xs font-medium text-gray-500 mt-1">Configuración y asignación de hojas de ruta</p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        Sistema en línea
                    </span>
                </div>
            </header>

            {message.text && (
                <div className={`mb-8 p-4 rounded-lg border flex items-center gap-3 animate-in fade-in zoom-in duration-200 ${message.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}>
                    <span className="text-sm">{message.type === "success" ? "✓" : "!"}</span>
                    <p className="text-xs font-bold uppercase tracking-wide">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zona / Ruta</label>
                    <select
                        disabled={isSubmitting}
                        className="w-full border border-gray-200 rounded-lg p-3.5 bg-white text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer shadow-sm"
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                    >
                        <option value="">-- Seleccionar Zona --</option>
                        {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Agente de Distribución</label>
                    <select
                        disabled={isSubmitting}
                        className={`w-full border rounded-lg p-3.5 text-xs font-bold outline-none transition-all cursor-pointer shadow-sm ${isDistributorOccupied ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700'
                            }`}
                        value={selectedDistributor}
                        onChange={(e) => setSelectedDistributor(e.target.value)}
                    >
                        <option value="">-- Seleccionar Agente --</option>
                        {distributors.map(d => {
                            const occupied = occupiedDistributors.includes(d.id);
                            return (
                                <option key={d.id} value={d.id} disabled={occupied}>
                                    {d.username} {occupied ? "(Ocupado)" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-3 px-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preventas en espera</p>
                    <span className="text-[10px] font-bold text-gray-500">
                        {selectedSales.length} de {pendingSales.length} seleccionadas
                    </span>
                </div>

                <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border border-gray-100 p-3 bg-gray-50/30 rounded-lg">
                    {pendingSales.map(sale => {
                        const isReprogrammed = sale.scheduled_date || sale.reprogram_reason;

                        return (
                            <label
                                key={sale.id}
                                className={`group flex flex-col p-4 rounded-lg border transition-all cursor-pointer ${selectedSales.includes(sale.id)
                                    ? 'border-blue-500 bg-blue-50/40 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                disabled={isSubmitting}
                                                checked={selectedSales.includes(sale.id)}
                                                onChange={() => toggleSelection(sale.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-[11px] uppercase tracking-tight">
                                                REF-{sale.id} <span className="mx-2 text-gray-300">|</span> <span className="text-gray-600">{sale.client_business_name || sale.client_name}</span>
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                {sale.client_address || 'Sin dirección'}
                                            </p>
                                            {sale.client_latitude && sale.client_longitude ? (
                                                <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                                                    📍 GPS: {parseFloat(sale.client_latitude).toFixed(6)}, {parseFloat(sale.client_longitude).toFixed(6)}
                                                </p>
                                            ) : (
                                                <p className="text-[9px] text-amber-600 font-semibold mt-0.5">
                                                    ⚠️ Sin coordenadas GPS
                                                </p>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleViewPDF(sale.id);
                                                }}
                                                className="mt-1 p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors border border-transparent hover:border-blue-200"
                                                title="Ver Nota de Venta"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                                Monto: <span className="text-gray-700">{formatAmount(sale.total_amount)}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {isReprogrammed ? (
                                            <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-tight border border-amber-200">
                                                Reprogramado
                                            </span>
                                        ) : (
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                                                Pendiente
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isReprogrammed && (
                                    <div className="mt-3 ml-8 p-2.5 bg-amber-50/50 border border-amber-100 rounded-md">
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 text-amber-600">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-amber-800 font-bold">
                                                    Fecha entrega: {sale.scheduled_date || 'No especificada'}
                                                </p>
                                                <p className="text-[10px] text-amber-700 mt-0.5 italic">
                                                    "{sale.reprogram_reason || 'Sin motivo registrado'}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </label>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handleAssign}
                disabled={selectedSales.length === 0 || !selectedRoute || !selectedDistributor || isSubmitting || isDistributorOccupied}
                className={`w-full py-4 rounded-lg text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-sm ${isSubmitting || selectedSales.length === 0 || !selectedRoute || !selectedDistributor || isDistributorOccupied
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-[0.99] border border-blue-700'
                    }`}
            >
                {isSubmitting ? 'Procesando despacho...' : `Generar Hoja de Ruta (${selectedSales.length})`}
            </button>
        </div>
    );
}