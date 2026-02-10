import { useState, useEffect } from 'react';
import { accountingService } from '../services/accountingService';

export function ExchangeRateManager() {
    const [currentRate, setCurrentRate] = useState(6.96);
    const [newRate, setNewRate] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        loadRate();
    }, []);

    const loadRate = async () => {
        const res = await accountingService.getExchangeRate();
        if (res.success) {
            setCurrentRate(res.data.rate);
        }
        setLoading(false);
    };

    const handleUpdate = async () => {
        if (!newRate || parseFloat(newRate) <= 0) {
            setMessage({ text: 'Ingrese una tasa válida', type: 'error' });
            return;
        }

        const res = await accountingService.setExchangeRate(parseFloat(newRate));
        if (res.success) {
            setCurrentRate(parseFloat(newRate));
            setNewRate('');
            setMessage({ text: 'Tasa actualizada', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: 'Error al actualizar', type: 'error' });
        }
    };

    if (loading) return <div className="p-4 text-slate-400">Cargando...</div>;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Tasa de Cambio USD/BS</h3>
            
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Tasa Actual</label>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <span className="text-2xl font-black text-slate-900">{currentRate}</span>
                        <span className="text-xs text-slate-500 ml-2">Bs/USD</span>
                    </div>
                </div>
                
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Nueva Tasa</label>
                    <input
                        type="number"
                        step="0.01"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ej: 6.96"
                    />
                </div>
            </div>

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-xs font-bold ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                    {message.text}
                </div>
            )}

            <button
                onClick={handleUpdate}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all"
            >
                Actualizar Tasa
            </button>
        </div>
    );
}
