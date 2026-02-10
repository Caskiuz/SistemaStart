import { useState, useEffect } from "react";
import { salesGPSService } from "../services/salesGPSService";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export function SalesGPSTracker() {
    const { user } = useAuth();
    const location = useLocation();
    const [tracking, setTracking] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [showBanner, setShowBanner] = useState(true);

    // Ocultar widget en ruta de registro de cliente
    const hideWidget = location.pathname === '/client';

    useEffect(() => {
        // Detener tracking si estamos en la página de registro de cliente
        if (hideWidget && tracking) {
            setTracking(false);
        }
    }, [hideWidget]);

    useEffect(() => {
        if (tracking) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => stopTracking();
    }, [tracking]);

    const startTracking = () => {
        if (!navigator.geolocation) {
            setError("Tu dispositivo no soporta geolocalización");
            return;
        }

        const id = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocationData({ latitude, longitude });
                setError(null);

                // Enviar ubicación al backend
                const res = await salesGPSService.updateLocation(latitude, longitude);
                if (res.success) {
                    setLastUpdate(new Date());
                    console.log("📍 Ubicación vendedor enviada:", latitude, longitude);
                } else {
                    console.error("❌ Error al enviar ubicación:", res.error);
                }
            },
            (err) => {
                let errorMsg = "Error GPS";
                switch(err.code) {
                    case err.PERMISSION_DENIED:
                        errorMsg = "⚠️ Permiso denegado. Ve a Configuración del navegador > Permisos > Ubicación y permite el acceso";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMsg = "📡 Ubicación no disponible. Verifica tu conexión GPS";
                        break;
                    case err.TIMEOUT:
                        errorMsg = "⏱️ Tiempo agotado. Intenta de nuevo";
                        break;
                    default:
                        errorMsg = `Error: ${err.message}`;
                }
                setError(errorMsg);
                console.error("GPS Error:", err);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        setWatchId(id);
    };

    const stopTracking = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
    };

    if (user?.role !== 'VENTAS' || hideWidget) {
        return null;
    }

    return (
        <>
            {/* Banner de advertencia cuando GPS está inactivo */}
            {!tracking && showBanner && (
                <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[9999] max-w-2xl w-full px-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-yellow-800">📍 GPS Desactivado</p>
                                <p className="text-xs text-yellow-700 mt-1">Activa el GPS para registrar tu actividad de ventas y ubicación</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="flex-shrink-0 ml-4 text-yellow-400 hover:text-yellow-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Widget GPS */}
            <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-xs z-50">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">👤 GPS Ventas</h3>
                    <button
                        onClick={() => setTracking(!tracking)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            tracking
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {tracking ? '🟢 Activo' : '⚪ Inactivo'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-red-700 font-semibold mb-2">{error}</p>
                        {error.includes("Permiso denegado") && (
                            <div className="text-[10px] text-red-600 space-y-1">
                                <p className="font-bold">Cómo activar:</p>
                                <p>• Chrome: 🔒 (candado) junto a la URL > Permisos > Ubicación > Permitir</p>
                                <p>• Firefox: 🔒 > Permisos > Ubicación > Permitir</p>
                                <p>• Luego recarga la página</p>
                            </div>
                        )}
                    </div>
                )}

                {locationData && (
                    <div className="space-y-2">
                        <div className="bg-purple-50 rounded-lg p-2">
                            <p className="text-[10px] text-purple-600 font-semibold">Latitud</p>
                            <p className="text-xs text-purple-900 font-mono">{locationData.latitude.toFixed(6)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                            <p className="text-[10px] text-purple-600 font-semibold">Longitud</p>
                            <p className="text-xs text-purple-900 font-mono">{locationData.longitude.toFixed(6)}</p>
                        </div>
                        {lastUpdate && (
                            <p className="text-[10px] text-gray-500 text-center">
                                Última actualización: {lastUpdate.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                )}

                {!locationData && tracking && (
                    <div className="flex items-center justify-center py-4">
                        <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-xs text-gray-500 ml-2">Obteniendo ubicación...</p>
                    </div>
                )}

                <p className="text-[9px] text-gray-400 text-center mt-3">
                    Tu ubicación es visible para gerencia
                </p>
            </div>
        </>
    );
}