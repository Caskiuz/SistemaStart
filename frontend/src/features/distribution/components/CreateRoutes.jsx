import { useState } from "react";
import { distributionService } from "../services/distributionService";

export function CreateRoutes() {
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null); 
        
        if (!formData.name.trim()) {
            setStatusMessage({ text: "El nombre de la ruta es obligatorio", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const res = await distributionService.createRoute(formData);
            if (res.success) {
                setFormData({ name: "", description: "" });
                setStatusMessage({ text: "¡Ruta creada exitosamente!", type: "success" });
                
                // Limpiar mensaje de éxito después de 4 segundos
                setTimeout(() => setStatusMessage(null), 4000);
            } else {
                setStatusMessage({ 
                    text: res.message || "No se pudo crear la ruta", 
                    type: "error" 
                });
            }
        } catch (error) {
            setStatusMessage({ 
                text: "Error de conexión. Intente más tarde.", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                
                {/* Indicador visual de éxito/error en la parte superior */}
                {statusMessage && (
                    <div className={`absolute top-0 left-0 right-0 p-3 text-center text-[10px] font-black uppercase tracking-widest transition-all ${
                        statusMessage.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                        {statusMessage.text}
                    </div>
                )}

                <div className="mb-8 mt-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-900 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-blue-600"></span>
                        Configurador de Rutas
                    </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                            Nombre Identificador
                        </label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ej: RUTA ESTE - SECTOR MERCADOS"
                            className={`w-full p-3.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all placeholder:text-slate-300 ${
                                statusMessage?.type === 'error' && !formData.name ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500'
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                            Detalles de Cobertura (Opcional)
                        </label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe los barrios o puntos clave de esta ruta..."
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-28 resize-none placeholder:text-slate-300"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className={`
                            w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                            ${loading 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"}
                        `}
                    >
                        {loading ? "Registrando..." : "Guardar Nueva Ruta"}
                    </button>
                </form>
            </div>
            
            <div className="mt-6 flex justify-center">
                <button 
                    onClick={() => setStatusMessage(null)}
                    className="text-[9px] text-slate-300 hover:text-slate-500 uppercase font-bold tracking-tighter transition-colors"
                >
                    Limpiar estados
                </button>
            </div>
        </div>
    );
}