import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';

export function ClientVisitHistory() {
    const { clientId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            const res = await clientService.getVisitHistory(clientId);
            if (res.success) {
                setData(res.data);
            }
            setLoading(false);
        };
        loadHistory();
    }, [clientId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <p className="text-gray-500">No se pudo cargar el historial</p>
            </div>
        );
    }

    const hasGPS = data.client.latitude && data.client.longitude;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{data.client.business_name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{data.client.address}</p>
                </div>
                <Link to="/" className="text-sm text-blue-600 hover:underline">← Volver</Link>
            </div>

            {hasGPS && (
                <div className="mb-6 h-80 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(data.client.longitude)-0.01},${parseFloat(data.client.latitude)-0.01},${parseFloat(data.client.longitude)+0.01},${parseFloat(data.client.latitude)+0.01}&layer=mapnik&marker=${data.client.latitude},${data.client.longitude}`}
                        allowFullScreen
                    />
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Historial de Visitas</h3>
                    <span className="text-sm text-gray-500">{data.visit_count} visitas totales</span>
                </div>

                <div className="space-y-3">
                    {data.visits.map((visit) => (
                        <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Preventa #{visit.id}</p>
                                <p className="text-xs text-gray-500 mt-1">{visit.date}</p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Vendedor: {visit.seller_name || 'N/A'} | Distribuidor: {visit.distributor_name || 'Pendiente'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                    visit.status === 'CONFIRMADO' ? 'bg-green-100 text-green-700' :
                                    visit.status === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {visit.status}
                                </span>
                                <p className="text-sm font-bold text-gray-900 mt-2">Bs. {visit.total_amount.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
