import { useState } from "react";
import { productService } from "../../products/services/productService";

export function StockAdjustment({ product, onUpdate }) {
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleAdjustment = async (type) => {
        if (!quantity || quantity <= 0) return;
        setLoading(true);
        setMessage({ text: "", type: "" }); 

        const movementData = {
            product: product.id,
            type: type,
            quantity: parseInt(quantity),
            reason: type === 'INGRESO' ? "Entrada por almacén" : "Salida por ajuste manual"
        };

        const result = await productService.registerMovement(movementData);
        
        if (result.success) {
            setQuantity("");
            onUpdate();
            setMessage({ text: "Ajuste realizado con éxito", type: "success" });
        } else {
            setMessage({ text: "Error al procesar el ajuste", type: "error" });
        }
        
        setLoading(false);
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    return (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <label className="block text-[10px] font-bold text-blue-400 uppercase mb-1">Ajustar Stock</label>
            <div className="flex gap-2">
                <input 
                    type="number" 
                    placeholder="Cant."
                    className="w-full text-sm p-1.5 rounded border-none focus:ring-2 focus:ring-blue-400 outline-none"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <button 
                    disabled={loading}
                    onClick={() => handleAdjustment('INGRESO')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600 transition-colors"
                >
                    +
                </button>
                <button 
                    disabled={loading}
                    onClick={() => handleAdjustment('EGRESO')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600 transition-colors"
                >
                    -
                </button>
            </div>

            {/* Mensaje de feedback elegante */}
            {message.text && (
                <p className={`text-[9px] font-black uppercase tracking-tighter mt-2 text-center ${
                    message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}