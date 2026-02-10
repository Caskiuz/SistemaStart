import { useState } from "react";
import { clientService } from "../services/clientService";

export function SalesReport() {
    const today = new Date().toISOString().split('T')[0];
    const [dates, setDates] = useState({ start: today, end: today });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    };

    const handleExportExcel = async () => {
        // Validación rápida antes de enviar
        if (dates.start > dates.end) {
            showMessage("La fecha inicio es mayor a la fin", "error");
            return;
        }

        setLoading(true);
        const res = await clientService.downloadExcelReport(dates.start, dates.end);
        
        if (res.success) {
            showMessage("Reporte generado exitosamente");
        } else {
            showMessage("Error en el servidor (500)", "error");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-100 mt-10 relative">
            
            {/* NOTIFICACIÓN ESTILIZADA */}
            {message.text && (
                <div className={`fixed top-10 right-10 z-50 flex items-center p-4 rounded-xl shadow-2xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
                    message.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${message.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                    <span className="text-xs font-black uppercase tracking-tight">{message.text}</span>
                </div>
            )}

            <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-emerald-50 rounded-full mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase">Reporte General de Ventas</h2>
                <p className="text-sm text-slate-500">Selecciona el rango de fechas para exportar el consolidado por vendedor.</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha de Inicio</label>
                        <input 
                            type="date" 
                            className="bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={dates.start}
                            onChange={(e) => setDates({...dates, start: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha de Fin</label>
                        <input 
                            type="date" 
                            className="bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={dates.end}
                            onChange={(e) => setDates({...dates, end: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleExportExcel}
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                             GENERANDO ARCHIVO...
                        </span>
                    ) : (
                        <>
                            DESCARGAR EXCEL (XLSX)
                            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}