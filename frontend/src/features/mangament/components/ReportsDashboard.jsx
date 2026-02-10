import React, { useState, useEffect } from 'react';
import { preSaleService } from '../../presale/services/preSaleServices';
import { useCurrency } from '../../../context/CurrencyContext';

export function ReportsDashboard() {
    const { formatAmount } = useCurrency();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const res = await preSaleService.getDashboardStats();
            if (res.success || res.data) setStats(res.data);
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStats(); }, []);

    if (loading) return (
        <div className="h-64 flex items-center justify-center text-slate-400 font-light text-xs tracking-[0.2em] uppercase">
            Sincronizando reportes...
        </div>
    );

    const entregados = stats?.distribucion_estados.find(s => s.status === 'CONFIRMADO')?.count || 0;
    const total = stats?.distribucion_estados.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const porcentajeEfectividad = Math.round((entregados / total) * 100);
    const dashOffset = 364 - (364 * porcentajeEfectividad) / 100;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Análisis Operativo</h2>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Resumen de rendimiento logístico</p>
                </div>
                <button 
                    onClick={loadStats}
                    className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-md bg-white shadow-sm"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    REFRESCAR
                </button>
            </header>

            {/* --- KPIs PRINCIPALES --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Ventas Netas" value={formatAmount(stats?.ventas_totales || 0)} color="slate" label="Efectivo/Crédito" />
                <KPICard title="Entregas" value={entregados} color="blue" label="Completadas hoy" />
                <KPICard title="Pendientes" value={stats?.distribucion_estados.find(s => s.status === 'ASIGNADO')?.count || 0} color="amber" label="En despacho" />
                <KPICard title="Incidencias" value={stats?.distribucion_estados.find(s => s.status === 'CANCELADO')?.count || 0} color="rose" label="Rechazados" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* --- PRODUCTOS MÁS VENDIDOS --- */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-6">Volumen por Producto</h3>
                    <div className="space-y-6">
                        {stats?.top_productos.map((prod, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{prod.product__name}</span>
                                    <span className="text-xs font-semibold text-slate-800">{prod.total_qty} u.</span>
                                </div>
                                <div className="w-full h-1 bg-slate-50 rounded-full">
                                    <div 
                                        className="h-full bg-slate-400 group-hover:bg-blue-500 transition-all duration-700 rounded-full" 
                                        style={{ width: `${(prod.total_qty / stats.top_productos[0].total_qty) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- EFECTIVIDAD DE DISTRIBUCIÓN --- */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-6">Ratio de Entrega</h3>
                    <div className="flex items-center gap-12 justify-center h-40">
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="56" cy="56" r="50" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                                <circle 
                                    cx="56" cy="56" r="50" 
                                    stroke="#3b82f6" strokeWidth="6" 
                                    fill="transparent" 
                                    strokeDasharray="314" 
                                    strokeDashoffset={314 - (314 * porcentajeEfectividad) / 100} 
                                    strokeLinecap="round"
                                    className="transition-all duration-1000" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-semibold text-slate-800">{porcentajeEfectividad}%</span>
                                <span className="text-[9px] font-medium text-slate-400">LOGRADO</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <StatDetail color="bg-blue-500" label="Finalizados" count={entregados} />
                            <StatDetail color="bg-slate-300" label="Pendientes" count={stats?.distribucion_estados.find(s => s.status === 'ASIGNADO')?.count || 0} />
                            <StatDetail color="bg-rose-400" label="Rechazos" count={stats?.distribucion_estados.find(s => s.status === 'CANCELADO')?.count || 0} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatDetail({ color, label, count }) {
    return (
        <div className="flex items-center gap-4 w-32 justify-between">
            <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
                <span className="text-[10px] font-medium text-slate-500 uppercase">{label}</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">{count}</span>
        </div>
    );
}

function KPICard({ title, value, label }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-xl font-semibold text-slate-800 mb-1">{value}</p>
            <p className="text-[9px] text-slate-400 font-medium italic">{label}</p>
        </div>
    );
}