import { useState, useEffect } from "react";
import { productService } from "../services/productService";

export function UpdateProduct({ product, onProductUpdated, onCancel }) {
    const [formData, setFormData] = useState({ ...product });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        const fetchCats = async () => {
            const res = await productService.getCategories();
            if (res.success) {
                const data = Array.isArray(res.data) ? res.data : res.data.results || [];
                setCategories(data);
            }
        };
        fetchCats();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "El nombre es obligatorio";
        if (formData.purchase_price <= 0) newErrors.purchase_price = "Costo inválido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setStatusMsg({ text: "", type: "" });
        
        const data = new FormData();
        // Campos que queremos enviar (excluimos calculados y la imagen actual si no cambia)
        const fieldsToSync = [
            'name', 'description', 'category', 'purchase_price', 
            'price_horizontal', 'price_mayorista', 'price_moderno', 
            'stock_min', 'units_per_box', 'warehouse_location', 'is_active'
        ];

        fieldsToSync.forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        if (formData.new_image) {
            data.append('product_image', formData.new_image);
        }

        const res = await productService.updateProduct(product.id, data);
        
        if (res.success) {
            setStatusMsg({ text: "Cambios aplicados con éxito", type: "success" });
            setTimeout(() => onProductUpdated(), 1500);
        } else {
            setErrors(res.error || {});
            setStatusMsg({ text: "Error: Revisa los campos resaltados", type: "error" });
        }
        setLoading(false);
    };

    const inputStyle = (field) => `w-full border rounded-lg p-2 text-sm font-light outline-none transition-all ${
        errors[field] ? "border-rose-400 bg-rose-50" : "border-slate-200 focus:border-slate-400 bg-white"
    }`;

    const labelStyle = "block text-[10px] font-semibold text-slate-400 uppercase tracking-tight mb-1";

    return (
        <div className="p-8 bg-white rounded-xl">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-light text-slate-800">Editar Especificaciones</h2>
                    <p className="text-xs text-slate-400 font-light">ID de producto: {product.id}</p>
                </div>
                {statusMsg.text && (
                    <span className={`text-xs px-3 py-1 rounded-full ${
                        statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                        {statusMsg.text}
                    </span>
                )}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* SECCIÓN 1: GENERAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelStyle}>Nombre del Producto</label>
                        <input 
                            className={inputStyle('name')}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelStyle}>Descripción</label>
                        <textarea 
                            rows="2"
                            className={inputStyle('description')}
                            value={formData.description || ""}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className={labelStyle}>Categoría</label>
                        <select 
                            className={inputStyle('category')}
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            {Array.isArray(categories) && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className={labelStyle}>Estado del Producto</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input 
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                className="w-4 h-4 accent-slate-800"
                            />
                            <span className="text-xs text-slate-500 font-light">Producto Activo en Catálogo</span>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECCIÓN 2: INVENTARIO Y CAJAS */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-800 uppercase mb-4 tracking-widest">Control de Inventario</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelStyle}>Stock Mínimo</label>
                            <input type="number" className={inputStyle('stock_min')}
                                value={formData.stock_min || 5}
                                onChange={(e) => setFormData({...formData, stock_min: e.target.value})} />
                            <p className="text-[9px] text-slate-400 mt-1">Alerta cuando stock sea menor</p>
                        </div>
                        <div>
                            <label className={labelStyle}>Unidades por Caja 📦</label>
                            <input type="number" min="1" className={inputStyle('units_per_box')}
                                value={formData.units_per_box || 1}
                                onChange={(e) => setFormData({...formData, units_per_box: e.target.value})} />
                            <p className="text-[9px] text-slate-400 mt-1">Para venta por cajas</p>
                        </div>
                        <div>
                            <label className={labelStyle}>Ubicación en Almacén</label>
                            <input type="text" className={inputStyle('warehouse_location')}
                                value={formData.warehouse_location || ''}
                                onChange={(e) => setFormData({...formData, warehouse_location: e.target.value})}
                                placeholder="Ej: A1-05" />
                            <p className="text-[9px] text-slate-400 mt-1">Código de ubicación</p>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECCIÓN 3: PRECIOS */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-800 uppercase mb-4 tracking-widest">Precios de Venta (Bs.)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Costo de Compra</label>
                            <input type="number" step="0.01" className={inputStyle('purchase_price')}
                                value={formData.purchase_price}
                                onChange={(e) => setFormData({...formData, purchase_price: e.target.value})} />
                            <p className="text-[9px] text-slate-400 mt-1">Precio al que compras el producto</p>
                        </div>
                        <div>
                            <label className={labelStyle}>Precio de Venta</label>
                            <input type="number" step="0.01" className={inputStyle('price_horizontal')}
                                value={formData.price_horizontal}
                                onChange={(e) => setFormData({...formData, price_horizontal: e.target.value})} />
                            <p className="text-[9px] text-slate-400 mt-1">Precio al que vendes el producto</p>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECCIÓN 4: IMAGEN */}
                <div>
                    <label className={labelStyle}>Actualizar Fotografía</label>
                    <div className="mt-1 flex items-center gap-6">
                        {product.product_image && !formData.new_image && (
                            <img src={product.product_image} className="w-16 h-16 rounded-lg object-cover border border-slate-100" alt="Preview" />
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, new_image: e.target.files[0]})}
                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-4 pt-6">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="px-6 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-all"
                    >
                        Descartar Cambios
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-slate-900 text-white px-10 py-2.5 rounded-lg text-xs font-light hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                    >
                        {loading ? "Sincronizando..." : "Confirmar Actualización"}
                    </button>
                </div>
            </form>
        </div>
    );
}