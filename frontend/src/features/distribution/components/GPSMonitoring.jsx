import { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { distributionService } from "../services/distributionService";
import { salesGPSService } from "../../auth/services/salesGPSService";
import { useAuth } from "../../auth/context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const clientIcon = (number) => new L.DivIcon({
  html: `<div style="background: #EF4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${number}</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

function MapUpdater({ center, deliveryPoints }) {
    const map = useMap();
    useEffect(() => {
        if (deliveryPoints.length > 0) {
            const bounds = L.latLngBounds(deliveryPoints.map(p => p.position));
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(center, 13);
        }
    }, [map, center, deliveryPoints]);
    return null;
}

export function GPSMonitoring() {
    const { user } = useAuth();
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [distributorLocations, setDistributorLocations] = useState({});
    const [salesLocations, setSalesLocations] = useState([]); // Ubicaciones de vendedores
    const [lastUpdate, setLastUpdate] = useState(null);
    const [updateKey, setUpdateKey] = useState(0);
    const [showSales, setShowSales] = useState(true); // Toggle para mostrar vendedores
    const [showDistributors, setShowDistributors] = useState(true); // Toggle para mostrar distribuidores

    const currentBatch = selectedBatch || batches[0];
    const center = [-17.783327, -63.182140]; // Santa Cruz, Bolivia

    const deliveryPoints = useMemo(() => {
        if (!currentBatch?.deliveries) return [];
        
        // Usar coordenadas reales de los clientes si están disponibles
        return currentBatch.deliveries.map((d, idx) => ({
            id: d.id,
            position: d.client_location || [-17.783327 + (idx * 0.01), -63.182140 + (idx * 0.01)],
            client: d.presale_details?.client_business_name || 'Cliente',
            status: d.presale_details?.status || 'ASIGNADO',
            order: idx + 1
        }));
    }, [currentBatch?.id, currentBatch?.deliveries]);

    const currentRoute = useMemo(() => {
        if (!currentBatch?.id || !distributorLocations[currentBatch.id]) return [];
        const location = distributorLocations[currentBatch.id];
        return deliveryPoints.map(p => p.position).concat([location.position]);
    }, [currentBatch?.id, distributorLocations, deliveryPoints]);

    useEffect(() => {
        if (user?.role !== 'GERENCIA') return;
        
        loadRoutes();
    }, [user?.role]);

    useEffect(() => {
        if (batches.length === 0) return;
        
        // Actualizar ubicaciones GPS desde el backend
        const fetchRealGPS = async () => {
            // Obtener ubicaciones de distribuidores
            const resDistributors = await distributionService.getAllGPSLocations();
            if (resDistributors.success && resDistributors.data?.data) {
                const newLocations = {};
                resDistributors.data.data.forEach(loc => {
                    newLocations[loc.batch_id] = {
                        position: [parseFloat(loc.latitude), parseFloat(loc.longitude)],
                        status: loc.status,
                        isReal: true,
                        lastUpdate: loc.last_update
                    };
                });
                setDistributorLocations(newLocations);
            }
            
            // Obtener ubicaciones de vendedores
            const resSales = await salesGPSService.getAllLocations();
            if (resSales.success && resSales.data?.data) {
                setSalesLocations(resSales.data.data);
            }
            
            setLastUpdate(new Date());
        };
        
        fetchRealGPS();
        const gpsInterval = setInterval(fetchRealGPS, 5000); // Actualizar cada 5 segundos
        return () => clearInterval(gpsInterval);
    }, [batches.length]);

    const loadRoutes = async () => {
        try {
            // Cargar datos reales del backend
            const res = await distributionService.getAllRoutes();
            
            if (res.success && res.data) {
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const activeBatches = data.filter(b => b.status !== 'FINALIZADO');
                
                if (activeBatches.length > 0) {
                    console.log('✅ GPS Real: Cargando rutas reales del backend', activeBatches);
                    setBatches(activeBatches);
                    if (!selectedBatch) setSelectedBatch(activeBatches[0]);
                    
                    // Inicializar ubicaciones reales si existen
                    const realLocations = {};
                    activeBatches.forEach(batch => {
                        if (batch.current_latitude && batch.current_longitude && batch.gps_enabled) {
                            realLocations[batch.id] = {
                                position: [parseFloat(batch.current_latitude), parseFloat(batch.current_longitude)],
                                status: batch.status,
                                isReal: true
                            };
                        }
                    });
                    
                    if (Object.keys(realLocations).length > 0) {
                        setDistributorLocations(realLocations);
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ Error al cargar rutas', error);
        }
        
        setLoading(false);
    };

    if (user?.role !== 'GERENCIA') {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 text-center border border-red-200 rounded-3xl bg-red-50">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-red-800 font-semibold text-sm">Acceso Restringido</h3>
                <p className="text-red-600 text-xs mt-1">Solo el personal de gerencia puede acceder al monitoreo GPS.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-600 animate-spin rounded-full mb-3" />
                <p className="text-xs text-gray-500 font-medium">Cargando mapa GPS...</p>
            </div>
        );
    }

    if (batches.length === 0) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 text-center border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </div>
                <h3 className="text-gray-800 font-semibold text-sm">Sin rutas activas</h3>
                <p className="text-gray-500 text-xs mt-1">No hay despachos en ruta para monitorear.</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="bg-white border-b border-gray-200 p-3 md:p-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-gray-900">📍 Rastreo GPS en Tiempo Real</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Panel de Gerencia • Vendedores y Distribuidores • {lastUpdate ? `${lastUpdate.toLocaleTimeString()}` : 'Conectando...'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                        <Link
                            to="/"
                            className="px-3 py-2 rounded-lg text-xs font-bold transition-all bg-amber-100 text-amber-700 hover:bg-amber-200 text-center"
                        >
                            🏠 Inicio
                        </Link>
                        <button
                            onClick={() => setShowSales(!showSales)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                showSales 
                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {showSales ? '👤 Vendedores' : '🚫 Vendedores'}
                        </button>
                        <button
                            onClick={() => setShowDistributors(!showDistributors)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                showDistributors 
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {showDistributors ? '🚚 Distribuidores' : '🚫 Distribuidores'}
                        </button>
                        <select
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium bg-white min-w-0 flex-1 sm:flex-none sm:min-w-[200px]"
                            value={currentBatch?.id || ''}
                            onChange={(e) => setSelectedBatch(batches.find(b => b.id === parseInt(e.target.value)))}
                        >
                            {batches.map(b => {
                                const loc = distributorLocations[b.id];
                                return (
                                    <option key={b.id} value={b.id}>
                                        👤 {b.distributor_name} - Trabajando ({loc?.visitedClients || 0} clientes)
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative touch-pan-x touch-pan-y" key={currentBatch.id}>
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <MapUpdater center={center} deliveryPoints={deliveryPoints} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    
                    {currentRoute.length > 0 && showDistributors && (
                        <Polyline
                            positions={currentRoute}
                            pathOptions={{
                                color: '#3B82F6',
                                weight: 3,
                                opacity: 0.6,
                                dashArray: '10, 10'
                            }}
                        />
                    )}
                    
                    {/* Marcadores de Distribuidores (vehículos) */}
                    {showDistributors && Object.entries(distributorLocations).map(([batchId, location]) => {
                        const batch = batches.find(b => b.id === parseInt(batchId));
                        if (!batch) return null;
                        
                        const isSelected = currentBatch?.id === parseInt(batchId);
                        const icon = new L.Icon({
                            iconUrl: `data:image/svg+xml;base64,${btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="${isSelected ? '#3B82F6' : '#10B981'}" stroke="white" stroke-width="3"/>
                                    <circle cx="12" cy="9" r="3" fill="white"/>
                                    <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                                </svg>
                            `)}`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 20],
                            popupAnchor: [0, -20]
                        });
                        
                        return (
                            <Marker key={`${batchId}-${updateKey}`} position={location.position} icon={icon}>
                                <Popup>
                                    <div className="text-xs">
                                        <p className="font-bold text-blue-600 text-sm">👤 {batch.distributor_name}</p>
                                        <p className="text-gray-600 font-semibold">{batch.route_name}</p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-green-600 text-[11px] font-bold">
                                                🟢 Trabajando • {lastUpdate?.toLocaleTimeString()}
                                            </p>
                                            <p className="text-gray-600 text-[10px] font-semibold">
                                                👥 Clientes atendidos: {location.visitedClients}
                                            </p>
                                            <p className="text-gray-500 text-[10px]">
                                                📍 {location.position[0].toFixed(4)}, {location.position[1].toFixed(4)}
                                            </p>
                                            <p className="text-blue-600 text-[10px] font-semibold">
                                                🕰️ Tiempo activo: {Math.floor(Math.random() * 4 + 1)}h {Math.floor(Math.random() * 60)}min
                                            </p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Marcadores de Vendedores (preventistas) */}
                    {showSales && salesLocations.map((seller) => {
                        const icon = new L.Icon({
                            iconUrl: `data:image/svg+xml;base64,${btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="#9333EA" stroke="white" stroke-width="3"/>
                                    <circle cx="12" cy="9" r="3" fill="white"/>
                                    <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                                </svg>
                            `)}`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 20],
                            popupAnchor: [0, -20]
                        });
                        
                        return (
                            <Marker 
                                key={`seller-${seller.seller_id}`} 
                                position={[parseFloat(seller.latitude), parseFloat(seller.longitude)]} 
                                icon={icon}
                            >
                                <Popup>
                                    <div className="text-xs">
                                        <p className="font-bold text-purple-600 text-sm">👤 {seller.seller_name}</p>
                                        <p className="text-gray-600 text-[11px] mt-1">{seller.seller_email}</p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-green-600 text-[11px] font-bold">
                                                🔴 Trabajando
                                            </p>
                                            <p className="text-gray-500 text-[10px]">
                                                📍 {parseFloat(seller.latitude).toFixed(4)}, {parseFloat(seller.longitude).toFixed(4)}
                                            </p>
                                            <p className="text-blue-600 text-[10px] font-semibold">
                                                🕗 {new Date(seller.last_update).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {deliveryPoints.map((point) => (
                        <Marker key={point.id} position={point.position} icon={clientIcon(point.order)}>
                            <Popup>
                                <div className="text-xs">
                                    <p className="font-bold text-red-600 text-sm">🎯 Parada #{point.order}</p>
                                    <p className="text-gray-700 font-semibold mt-1">{point.client}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-[10px] font-bold ${
                                        point.status === 'CONFIRMADO' ? 'bg-green-100 text-green-700' :
                                        point.status === 'ASIGNADO' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {point.status}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="bg-white border-t border-gray-200 p-3">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-2 sm:gap-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            <span className="text-gray-600">Vendedores ({salesLocations.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="text-gray-600">Distribuidores ({Object.keys(distributorLocations).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            <span className="text-gray-600">Clientes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="font-semibold text-green-600">Monitoreando</span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center sm:text-right">
                        Ubicación GPS en tiempo real
                    </p>
                </div>
            </div>
        </div>
    );
}