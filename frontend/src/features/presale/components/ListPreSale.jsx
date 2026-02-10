import { useEffect, useState, useMemo } from "react";
import { preSaleService } from "../services/preSaleServices";
import { useCurrency } from "../../../context/CurrencyContext";

export function ListPreSale() {
    const { formatAmount } = useCurrency();
    const [preSales, setPreSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [expandedDates, setExpandedDates] = useState({});

    useEffect(() => {
        const getPreSales = async () => {
            const result = await preSaleService.getPreSales();
            if (result.success) {
                const data = Array.isArray(result.data) ? result.data : result.data.results || [];
                setPreSales(data);
                if (data.length > 0) {
                    const latestDate = new Date(data[0].created_at).toLocaleDateString();
                    setExpandedDates({ [latestDate]: true });
                }
            } else {
                setError(result.error || 'Error al cargar las preventas');
            }
            setLoading(false);
        };
        getPreSales();
    }, []);

    const groupedPreSales = useMemo(() => {
        return preSales.reduce((groups, preSale) => {
            const date = new Date(preSale.created_at).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(preSale);
            return groups;
        }, {});
    }, [preSales]);

    const toggleDate = (date) => {
        setExpandedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const handleViewPDF = async (id) => {
        const result = await preSaleService.getPDFBlob(id);
        if (result.success) {
            const url = window.URL.createObjectURL(result.data);
            setPdfUrl(url);
        }
    };

    const closePDFViewer = () => {
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 animate-pulse font-light">Cargando registros...</div>;
    if (error) return <div className="m-4 p-4 border border-red-100 text-red-500 bg-red-50/30 rounded-lg text-sm">{error}</div>;

    return (
        <div className="m-6 space-y-4">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light text-slate-800 tracking-tight">Historial de Preventas</h2>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                    {preSales.length} Operaciones Totales
                </span>
            </header>

            {Object.keys(groupedPreSales).map((date) => (
                <div key={date} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
                    {/* CABECERA DEL GRUPO (FECHA) */}
                    <button 
                        onClick={() => toggleDate(date)}
                        className="w-full px-6 py-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-700">{date}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase font-bold">
                                {groupedPreSales[date].length} Ventas
                            </span>
                        </div>
                        <svg 
                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${expandedDates[date] ? 'rotate-180' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* TABLA COLAPSABLE */}
                    {expandedDates[date] && (
                        <div className="overflow-x-auto border-t border-slate-100 animate-fadeIn">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-white">
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {groupedPreSales[date].map((preSale) => (
                                        <tr key={preSale.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{preSale.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700">{preSale.client_name}</div>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{preSale.sale_type}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                                {formatAmount(preSale.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${preSale.status === 'PENDIENTE'
                                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                    {preSale.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleViewPDF(preSale.id)}
                                                        className="text-blue-500 hover:text-blue-700 font-bold text-[10px] transition-all border border-blue-200 hover:border-blue-300 px-3 py-1 rounded-md"
                                                        title="Ver PDF"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button
                                                        onClick={() => preSaleService.downloadPDF(preSale.id)}
                                                        className="text-slate-400 hover:text-slate-900 font-bold text-[10px] transition-all border border-slate-200 hover:border-slate-300 px-3 py-1 rounded-md"
                                                    >
                                                        PDF ↓
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}

            {/* MODAL VISOR PDF */}
            {pdfUrl && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closePDFViewer}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800">Vista Previa - Nota de Entrega</h3>
                            <button
                                onClick={closePDFViewer}
                                className="text-slate-400 hover:text-slate-900 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <iframe
                            src={pdfUrl}
                            className="flex-1 w-full"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}