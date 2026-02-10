import { useState, useEffect } from "react";
import { productService } from "../services/productService";

export function AddProduct({ onProductAdded }) {
    const [categories, setCategories] = useState([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        category: "",
        description: "",
        warehouse_location: "",
        units_per_box: 1,
        purchase_price: "",
        price_horizontal: "",
        stock: 0,
        stock_min: 5,
        product_image: null,
        is_active: true
    });

    const fetchCategories = async () => {
        const res = await productService.getCategories();
        if (res.success) {
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setCategories(data);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const showNotification = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        const res = await productService.createCategory(newCategoryName);
        if (res.success) {
            await fetchCategories();
            setFormData({ ...formData, category: res.data.id });
            setIsAddingCategory(false);
            setNewCategoryName("");
            showNotification("Categoría creada", "success");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") data.append(key, value);
        });

        const result = await productService.createProduct(data);

        if (result.success) {
            showNotification("Producto guardado con éxito", "success");
            setFormData({
                code: "", name: "", category: "", description: "",
                warehouse_location: "", units_per_box: 1,
                purchase_price: "", price_horizontal: "",
                stock: 0, stock_min: 5, product_image: null, is_active: true
            });
            if (typeof onProductAdded === 'function') {
                setTimeout(() => onProductAdded(), 1000);
            }
        } else {
            showNotification("Error: Verifique los datos", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="md:col-span-3 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-semibold text-slate-800 tracking-tighter">Registrar Mercadería</h3>
                <p className="text-xs text-slate-400 font-medium">Ingresa los datos del producto con precio único</p>
            </div>

            {/* Columna Izquierda: Info Básica */}
            <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Código de Producto</label>
                        <input type="text" required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ubicación en Almacén</label>
                        <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                            placeholder="Ej: Sector A-3"
                            value={formData.warehouse_location}
                            onChange={(e) => setFormData({ ...formData, warehouse_location: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre del Producto</label>
                    <input type="text" required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descripción (Opcional)</label>
                    <textarea rows="2" className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>

                {/* Sección de Precios: Precio Único */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-indigo-400 uppercase mb-1">Costo Compra (USD)</label>
                        <input type="number" step="0.01" required className="w-full bg-white border border-indigo-100 rounded-lg p-2 font-bold text-slate-700 outline-none focus:border-indigo-400"
                            value={formData.purchase_price}
                            onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1">Precio Venta (USD)</label>
                        <input type="number" step="0.01" required className="w-full bg-white border border-emerald-200 rounded-lg p-2 font-bold text-emerald-600 outline-none focus:border-emerald-400"
                            value={formData.price_horizontal}
                            onChange={(e) => setFormData({ ...formData, price_horizontal: e.target.value })} />
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Categoría y Stock */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
                        <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)} className="text-[10px] font-bold text-indigo-600 uppercase">
                            {isAddingCategory ? "✕" : "+ Nueva"}
                        </button>
                    </div>
                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <input autoFocus className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-sm outline-none"
                                placeholder="Nombre..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                            <button onClick={handleCreateCategory} type="button" className="bg-indigo-600 text-white px-3 rounded-lg text-xs font-bold">OK</button>
                        </div>
                    ) : (
                        <select required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none"
                            value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="">Seleccione...</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Inicial (Unidades)</label>
                        <input type="number" required className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unidades por Caja</label>
                        <input type="number" required className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
                            value={formData.units_per_box}
                            onChange={(e) => setFormData({ ...formData, units_per_box: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Mínimo</label>
                    <input type="number" required className="w-full bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
                        value={formData.stock_min}
                        onChange={(e) => setFormData({ ...formData, stock_min: e.target.value })} />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Imagen</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-100 border-dashed rounded-xl hover:border-indigo-300 transition-colors relative">
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setFormData({ ...formData, product_image: e.target.files[0] })} />
                        <div className="text-center">
                            <p className="text-xs text-slate-500">{formData.product_image ? formData.product_image.name : "Subir archivo"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer: Notificaciones y Botón */}
            <div className="md:col-span-3 flex items-center justify-between pt-6 border-t border-slate-100 mt-2">
                <div className="h-4">
                    {message.text && (
                        <span className={`text-[10px] font-black uppercase tracking-widest animate-pulse ${
                            message.type === 'success' ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                            {message.text}
                        </span>
                    )}
                </div>
                <button type="submit" className="bg-slate-900 hover:bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95">
                    Guardar Producto
                </button>
            </div>
        </form>
    );
}