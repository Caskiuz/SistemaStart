import { useState, useEffect, useMemo } from "react";
import { productService } from "../services/productService";

export function MovementHistory() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDates, setExpandedDates] = useState({});

    useEffect(() => {
        const fetchMovements = async () => {
            const res = await productService.getMovements();
            if (res.success) {
                const data = Array.isArray(res.data) ? res.data : res.data.results || [];
                setMovements(data);
                const today = new Date().toLocaleDateString();
                setExpandedDates({ [today]: true });
            }
            setLoading(false);
        };
        fetchMovements();
    }, []);

    const groupedMovements = useMemo(() => {
        return movements.reduce((acc, mov) => {
            const date = new Date(mov.created_at).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(mov);
            return acc;
        }, {});
    }, [movements]);

    const toggleDate = (date) => {
        setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-3">
            <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-600 animate-spin rounded-full" />
            <p className="text-xs font-medium text-gray-500 tracking-wide">Cargando historial...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <header className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Registro de Movimientos</h2>
                <p className="text-sm text-gray-500 mt-0.5">Control de entradas y salidas de inventario por fecha</p>
            </header>

            <div className="space-y-3">
                {Object.keys(groupedMovements).length === 0 ? (
                    <div className="p-16 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Sin actividad registrada</p>
                    </div>
                ) : (
                    Object.keys(groupedMovements).sort((a, b) => new Date(b) - new Date(a)).map((date) => {
                        const isToday = date === new Date().toLocaleDateString();
                        const isOpen = expandedDates[date];

                        return (
                            <div key={date} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all">
                                {/* Header del Acordeón - Estilo Corporativo */}
                                <button 
                                    onClick={() => toggleDate(date)}
                                    className={`w-full flex justify-between items-center p-4 transition-colors ${isOpen ? 'bg-blue-50/40 border-b border-gray-200' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold tracking-wide uppercase ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                                            {isToday ? "Hoy" : date}
                                        </span>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold tracking-wider uppercase border border-gray-200">
                                            {groupedMovements[date].length} Movimientos
                                        </span>
                                    </div>
                                    <svg 
                                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Lista de Movimientos */}
                                {isOpen && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50/50">
                                                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hora</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Producto</th>
                                                    <th className="px-5 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                                                    <th className="px-5 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cantidad</th>
                                                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Motivo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {groupedMovements[date].map((mov) => (
                                                    <tr key={mov.id} className="hover:bg-gray-50/30 transition-colors">
                                                        <td className="px-5 py-4 text-[11px] text-gray-500 font-medium">
                                                            {new Date(mov.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p className="text-xs font-semibold text-gray-800 tracking-tight">{mov.product_name}</p>
                                                        </td>
                                                        <td className="px-5 py-4 text-center">
                                                            <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-bold tracking-wide uppercase ${
                                                                mov.type === 'INGRESO' 
                                                                ? 'bg-emerald-50 text-emerald-600' 
                                                                : 'bg-rose-50 text-rose-600'
                                                            }`}>
                                                                {mov.type}
                                                            </span>
                                                        </td>
                                                        <td className={`px-5 py-4 text-center text-xs font-bold ${mov.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            {mov.type === 'INGRESO' ? '+' : '-'}{mov.quantity}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p className="text-xs text-gray-500 italic max-w-xs truncate">
                                                                {mov.reason || "Sin observación"}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}