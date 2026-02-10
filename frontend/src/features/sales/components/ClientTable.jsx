import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clientService } from "../services/clientService";

export function ClientTable() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadClients = async () => {
            const result = await clientService.getClients();
            if (result.success) {
                setClients(Array.isArray(result.data) ? result.data : result.data.results || []);
            } else {
                setError("No se pudieron cargar los clientes.");
            }
            setLoading(false);
        };
        loadClients();
    }, []);

    if (loading) return <div className="p-8 text-slate-400 animate-pulse font-light">Cargando base de datos...</div>;

    return (
        <div className="m-8 border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden font-sans">
            <header className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Cartera de Clientes</h2>
                <div className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    Activos: {clients.filter(c => c.is_active).length}
                </div>
            </header>
            
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identidad</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Negocio</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">RIF</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5 whitespace-nowrap">
                                    {client.business_image ? (
                                        <img src={client.business_image} className="w-10 h-10 rounded-xl object-cover border border-slate-200" alt="" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">NA</div>
                                    )}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-sm font-bold text-slate-900">{client.business_name}</div>
                                    <div className="text-xs text-slate-500 font-medium">Dueño: {client.owner_name}</div>
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-600">
                                    <div className="font-medium text-slate-700">{client.phone}</div>
                                </td>
                                <td className="px-8 py-5 text-sm font-mono text-slate-500 tracking-tighter">
                                    {client.rif_cedula}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                            client.is_active 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                                        }`}>
                                            {client.is_active ? '● Activo' : '○ Inactivo'}
                                        </span>
                                        <Link 
                                            to={`/clients/${client.id}/history`}
                                            className="text-xs text-blue-600 hover:underline font-semibold"
                                        >
                                            📊 Historial
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}