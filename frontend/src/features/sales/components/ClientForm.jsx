import { useState } from "react";
import { clientService } from "../services/clientService";
import { useNavigate } from "react-router-dom";
import { geocodingService } from "../../../services/geocodingService";

export function ClientForm() {
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const [capturingGPS, setCapturingGPS] = useState(false)
    const [formData, setFormData] = useState({
        business_name: "",
        owner_name: "",
        rif_cedula: "",
        phone: "",
        address: "",
        email: "",
        latitude: null,
        longitude: null
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const captureGPS = async () => {
        if (!navigator.geolocation) {
            setMessage({ type: "error", text: "GPS no disponible en este dispositivo" });
            return;
        }
        
        setCapturingGPS(true);
        setMessage({ type: "", text: "" });
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng
                }));
                
                // Obtener dirección desde coordenadas
                const addressData = await geocodingService.reverseGeocode(lat, lng);
                
                if (addressData && !formData.address) {
                    // Solo llenar si el campo está vacío
                    const shortAddress = `${addressData.road || ''} ${addressData.neighbourhood || ''}, ${addressData.city}`.trim();
                    setFormData(prev => ({
                        ...prev,
                        address: shortAddress
                    }));
                    setMessage({ type: "success", text: `📍 Ubicación: ${shortAddress}` });
                } else {
                    setMessage({ type: "success", text: "📍 Ubicación capturada correctamente" });
                }
                
                setCapturingGPS(false);
            },
            (error) => {
                setCapturingGPS(false);
                let errorMsg = "Error al obtener ubicación GPS";
                if (error.code === 1) errorMsg = "Permiso de ubicación denegado";
                if (error.code === 2) errorMsg = "Ubicación no disponible";
                if (error.code === 3) errorMsg = "Tiempo de espera agotado";
                setMessage({ type: "error", text: errorMsg });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const geocodeAddress = async () => {
        if (!formData.address) {
            setMessage({ type: "error", text: "Ingresa una dirección primero" });
            return;
        }
        
        setCapturingGPS(true);
        setMessage({ type: "", text: "" });
        const result = await geocodingService.geocodeAddress(formData.address + ", Santa Cruz, Bolivia");
        
        if (result) {
            setFormData(prev => ({
                ...prev,
                latitude: result.latitude,
                longitude: result.longitude
            }));
            setMessage({ type: "success", text: `🗺️ GPS obtenido: ${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}` });
        } else {
            setMessage({ type: "error", text: "No se pudo encontrar la ubicación. Intenta con más detalles (calle, barrio, ciudad)" });
        }
        setCapturingGPS(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        const dataToSend = new FormData()

        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });

        if (image) {
            dataToSend.append("business_image", image);
        }

        const result = await clientService.createClient(dataToSend);

        if (result.success) {
            setMessage({ type: "success", text: "Cliente registrado correctamente" });
            setFormData({ business_name: "", owner_name: "", rif_cedula: "", phone: "", address: "", email: "", latitude: null, longitude: null });
            setImage(null)

            setTimeout(() => {
                navigate('/')
            }, 1500)
        } else {
            const errorMsg = result.errors
                ? (typeof result.errors === 'object' ? "Error en los datos. Verifica el RIF o la imagen." : result.errors)
                : "Error al registrar el cliente";

            setMessage({ type: "error", text: errorMsg });
        }
    };

    return (
        <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col w-full max-w-[500px] p-8 bg-white shadow-sm border border-gray-200 rounded-xl gap-5"
            >
                <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">Registro de Nuevo Cliente</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Cartera de Ventas</p>
                </div>

                {message.text && (
                    <div className={`p-3 rounded-lg border font-medium text-sm ${
                        message.type === "success" 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Nombre del Negocio</label>
                    <input 
                        name="business_name" 
                        value={formData.business_name} 
                        onChange={handleChange} 
                        className="border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                        required 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Foto de Fachada</label>
                    <label className="flex items-center justify-center w-full h-14 px-4 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-white focus:outline-none">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
                                {image ? image.name : "Subir imagen..."}
                            </span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Dueño / Responsable</label>
                        <input name="owner_name" value={formData.owner_name} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">RIF o Cédula</label>
                        <input name="rif_cedula" value={formData.rif_cedula} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Teléfono de Contacto</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Correo (Opcional)</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Dirección de Entrega</label>
                    <textarea 
                        name="address" 
                        rows="2"
                        value={formData.address} 
                        onChange={handleChange} 
                        className="border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none resize-none" 
                        required 
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ubicación GPS (Opcional)</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={captureGPS}
                            disabled={capturingGPS}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                                formData.latitude 
                                ? "bg-green-50 border-2 border-green-500 text-green-700" 
                                : "bg-blue-50 border-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                            } ${capturingGPS ? "opacity-50 cursor-wait" : ""}`}
                        >
                            {capturingGPS ? (
                                <>⏳ Capturando...</>
                            ) : formData.latitude ? (
                                <>✅ GPS Capturado</>
                            ) : (
                                <>📍 Capturar GPS Actual</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={geocodeAddress}
                            disabled={capturingGPS || !formData.address}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all bg-purple-50 border-2 border-purple-300 text-purple-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🗺️ Desde Dirección
                        </button>
                    </div>
                    {formData.latitude && (
                        <p className="text-xs text-green-600 font-mono bg-green-50 p-2 rounded border border-green-200">
                            🌍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                        </p>
                    )}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800 font-semibold mb-1">💡 Dos formas de capturar GPS:</p>
                        <p className="text-xs text-blue-700">• <strong>📍 GPS Actual:</strong> Captura tu ubicación y llena la dirección automáticamente</p>
                        <p className="text-xs text-blue-700">• <strong>🗺️ Desde Dirección:</strong> Escribe la dirección y obtiene las coordenadas GPS</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md shadow-blue-100 mt-2 uppercase tracking-widest text-sm"
                >
                    Guardar Cliente
                </button>
            </form>
        </div>
    );
}