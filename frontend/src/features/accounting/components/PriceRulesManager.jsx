import { useState, useEffect } from 'react';
import { accountingService } from '../services/accountingService';

export function PriceRulesManager() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" }); 

    useEffect(() => { loadRules(); }, []);

    const loadRules = async () => {
        try {
            const data = await accountingService.getPriceRules();
            setRules(data);
        } catch (error) {
            console.error("Error cargando reglas:", error);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleMarginChange = async (id, newMargin) => {
        try {
            await accountingService.updatePriceRule(id, { margin_percentage: newMargin });
            showNotification("Margen actualizado", "success");
            loadRules(); 
        } catch (error) {
            showNotification("Error al actualizar", "error");
        }
    };

    if (loading) return <div className="p-10 text-center text-[10px] font-bold uppercase text-slate-400">Sincronizando márgenes...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Márgenes de Comercialización</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Define el % de ganancia sobre el costo</p>
                </div>

                {/* Mensaje de estado elegante en la cabecera */}
                {message.text && (
                    <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                        {message.text}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rules.map(rule => (
                    <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
                        <div>
                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase mb-1 inline-block">
                                {rule.sale_type_display}
                            </span>
                            <h4 className="text-xs font-bold text-slate-700">{rule.category_name}</h4>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <input 
                                    type="number" 
                                    className="w-16 text-right font-black text-blue-600 text-xs focus:outline-none border-b border-transparent focus:border-blue-400"
                                    defaultValue={rule.margin_percentage}
                                    onBlur={(e) => handleMarginChange(rule.id, e.target.value)}
                                />
                                <span className="text-xs font-bold text-blue-600 ml-1">%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-[10px] text-amber-700 font-medium">
                    <span className="font-bold">NOTA:</span> Los cambios en los márgenes afectarán automáticamente a las nuevas preventas creadas a partir de este momento.
                </p>
            </div>
        </div>
    );
}