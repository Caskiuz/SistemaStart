import { useState, useEffect, useMemo } from "react";
import { clientService } from "../../sales/services/clientService";
import { productService } from "../../products/services/productService";
import { preSaleService } from "../services/preSaleServices";
import { useAuth } from "../../auth/context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";

export function CreatePreSale() {
    const { user } = useAuth();
    const { formatAmount } = useCurrency();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [saleType, setSaleType] = useState('HORIZONTAL'); // HORIZONTAL, MAYORISTA, MODERNO
    const [saleUnit, setSaleUnit] = useState('UNIT'); // UNIT o BOX
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const loadData = async () => {
            const [resClients, resProducts] = await Promise.all([
                clientService.getClients(),
                productService.getProducts()
            ]);
            if (resClients.success) setClients(Array.isArray(resClients.data) ? resClients.data : resClients.data.results || []);
            if (resProducts.success) setProducts(Array.isArray(resProducts.data) ? resProducts.data : resProducts.data.results || []);
            setLoading(false);
        };
        loadData();
    }, []);

    // Helper para obtener el precio correcto según el tipo de venta
    const getCurrentPrice = (product) => {
        if (!product) return 0;
        switch (saleType) {
            case 'MAYORISTA': return product.price_mayorista;
            case 'MODERNO': return product.price_moderno;
            default: return product.price_horizontal;
        }
    };

    // Actualizar los precios del carrito si el Gerente cambia el tipo de venta
    useEffect(() => {
        setCart(prevCart => prevCart.map(item => ({
            ...item,
            price_at_sale: getCurrentPrice(item)
        })));
    }, [saleType]);

    const filteredProducts = useMemo(() => {
        return products.filter(prod =>
            prod.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const addToCart = (product, unit = 'UNIT') => {
        if (product.stock <= 0) return;
        const priceToApply = getCurrentPrice(product);
        const qtyToAdd = unit === 'BOX' ? product.units_per_box : 1;
        const pricePerItem = unit === 'BOX' ? priceToApply * product.units_per_box : priceToApply;
        
        const exists = cart.find(item => item.id === product.id);

        if (exists) {
            if (exists.qty + qtyToAdd > product.stock) {
                setMessage({ type: "error", text: `Stock insuficiente` });
                return;
            }
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, qty: item.qty + qtyToAdd, price_at_sale: priceToApply }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, qty: qtyToAdd, price_at_sale: priceToApply, sale_unit: unit }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (Number(item.price_at_sale) * item.qty), 0).toFixed(2);
    };

    const handleSubmit = async () => {
        if (!selectedClient) {
            setMessage({ type: "error", text: "Seleccione un cliente" });
            return;
        }
        if (cart.length === 0) {
            setMessage({ type: "error", text: "Carrito vacío" });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                client: selectedClient,
                sale_type: saleType,
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.qty,
                    price_at_sale: item.price_at_sale
                }))
            };

            const result = await preSaleService.createPreSale(data);
            if (result.success) {
                setMessage({ type: "success", text: "Preventa creada con éxito" });
                setCart([]);
            } else {
                setMessage({ type: "error", text: result.error || "Error al procesar" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Ocurrió un error inesperado" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Cargando catálogo...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen text-slate-800">
            {/* Notificaciones */}
            {message.text && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded border shadow-lg transition-all ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                    <p className="text-sm font-bold">{message.text}</p>
                </div>
            )}

            <header className="mb-8 pb-6 border-b border-slate-100 flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Nueva Preventa</h1>
                    <p className="text-sm text-slate-500 font-medium">Canal de Venta Actual: <span className="text-indigo-600">{saleType}</span></p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Usuario</span>
                    <p className="text-xs font-bold text-slate-700">{user?.username} ({user?.role})</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Catálogo */}
                <div className="lg:col-span-7">
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Productos</h2>
                    <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredProducts.map(prod => {
                            const cartItem = cart.find(item => item.id === prod.id);
                            const isOutOfStock = prod.stock <= 0;
                            const currentPrice = getCurrentPrice(prod);

                            return (
                                <div key={prod.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all ${isOutOfStock ? 'bg-slate-50 opacity-60' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center text-[10px] text-slate-400">
                                            {prod.product_image ? <img src={prod.product_image} className="w-full h-full object-cover" alt="" /> : "SIN FOTO"}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-800">{prod.name}</h3>
                                            <p className="text-xs text-slate-500">
                                                Stock: <span className={prod.stock < 10 ? 'text-orange-500 font-bold' : ''}>{prod.stock}</span> uds
                                                {prod.units_per_box > 1 && <span className="text-slate-400"> ({(prod.stock / prod.units_per_box).toFixed(1)} cajas)</span>}
                                            </p>
                                            <p className="text-xs mt-1">
                                                <span className="text-indigo-600 font-bold">{formatAmount(currentPrice)}</span>/ud
                                                {prod.units_per_box > 1 && (
                                                    <span className="text-emerald-600 font-bold ml-2">{formatAmount(currentPrice * prod.units_per_box)}</span>
                                                )}
                                                {prod.units_per_box > 1 && <span className="text-slate-400">/caja</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => addToCart(prod, 'UNIT')}
                                            disabled={isOutOfStock || (cartItem && cartItem.qty >= prod.stock) || isSubmitting}
                                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all uppercase"
                                        >
                                            + Unidad
                                        </button>
                                        {prod.units_per_box > 1 && (
                                            <button
                                                onClick={() => addToCart(prod, 'BOX')}
                                                disabled={isOutOfStock || (cartItem && cartItem.qty + prod.units_per_box > prod.stock) || isSubmitting}
                                                className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-full hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all uppercase"
                                                title={`Caja (${prod.units_per_box} uds) - ${formatAmount(currentPrice * prod.units_per_box)}`}
                                            >
                                                + Caja
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Carrito / Resumen */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-6">
                        <h2 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-4 mb-6 uppercase tracking-tighter">Resumen de Orden</h2>

                        <div className="space-y-5 mb-8">
                            {/* Selector de Cliente */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Cliente</label>
                                <select
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                                </select>
                            </div>

                            {/* Selector de Canal de Venta (Protegido por Rol) */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Tipo de Venta (Canal)</label>
                                <select
                                    disabled={user.role !== 'GERENCIA' || isSubmitting}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-indigo-700 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                                    value={saleType}
                                    onChange={(e) => setSaleType(e.target.value)}
                                >
                                    <option value="HORIZONTAL">Canal Horizontal</option>
                                </select>
                                {user.role !== 'GERENCIA' && (
                                    <p className="text-[9px] text-orange-400 mt-2 font-medium">⚠️ Solo el Gerente puede modificar el canal de precios.</p>
                                )}
                            </div>
                        </div>

                        {/* Listado de Productos en Carrito */}
                        <div className="border-t border-slate-200 pt-6 mb-6 max-h-56 overflow-y-auto pr-2">
                            {cart.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-xs text-slate-400 italic">No hay productos en la orden</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center mb-4 last:mb-0">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 leading-tight">{item.qty} x {item.name}</span>
                                            <span className="text-[10px] text-slate-400">P. Unit: {formatAmount(item.price_at_sale)}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black text-slate-900">{formatAmount(item.price_at_sale * item.qty)}</span>
                                            <button 
                                                onClick={() => removeFromCart(item.id)} 
                                                disabled={isSubmitting}
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Total y Botón */}
                        <div className="flex justify-between items-center border-t border-slate-200 pt-6 mb-8">
                            <span className="text-[10px] font-black uppercase text-slate-400">Total Preventa</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{formatAmount(calculateTotal())}</span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || cart.length === 0}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-indigo-100"
                        >
                            {isSubmitting ? 'Guardando en Servidor...' : 'Confirmar Orden de Salida'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}