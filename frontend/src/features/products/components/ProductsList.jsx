import { useEffect, useState, useCallback } from "react";
import { productService } from "../services/productService";
import { StockAdjustment } from "../../auth/components/StockAdjustment";
import { AddProduct } from "./addProduct";
import { UpdateProduct } from "./UpdateProduct";
import { useAuth } from "../../auth/context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import axios from '../../../api/axios';

export function ProductsList() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'gallery'
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importResult, setImportResult] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    
    // Estado para el modal de edición
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = useCallback(async () => {
        const result = await productService.getProducts();
        if (result.success) {
            const data = Array.isArray(result.data) ? result.data : result.data.results || [];
            setProducts(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleImportExcel = async () => {
        if (!importFile) return;
        
        setIsImporting(true);
        const formData = new FormData();
        formData.append('file', importFile);
        
        try {
            const response = await axios.post('/inventory/products/import_excel/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImportResult(response.data);
            loadProducts();
        } catch (error) {
            setImportResult({ error: error.response?.data?.error || 'Error al importar' });
        } finally {
            setIsImporting(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const response = await axios.get('/inventory/products/export_excel/', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Plantilla_Productos.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al descargar plantilla:', error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-3">
            <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-600 animate-spin rounded-full" />
            <p className="text-xs font-medium text-gray-500">Sincronizando almacén...</p>
        </div>
    );

    return (
        <main className="p-6 bg-gray-50/50 min-h-screen font-sans relative">
            {/* MODAL DE EDICIÓN */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button 
                            onClick={() => setEditingProduct(null)}
                            className="absolute top-4 right-6 text-slate-400 hover:text-slate-600 text-2xl font-light"
                        >
                            ×
                        </button>
                        <div className="p-2">
                            {/* Reutilizamos AddProduct pasando el producto a editar */}
                            <UpdateProduct
                                product={editingProduct} 
                                onProductUpdated={() => { 
                                    loadProducts(); 
                                    setEditingProduct(null); 
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Control de Inventario</h1>
                        <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} productos encontrados</p>
                    </div>

                    <div className="flex-1 max-w-md w-full px-4">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nombre, código o categoría..."
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Vista Cuadrícula"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('gallery')}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'gallery' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Vista Galería"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Vista Lista"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowImportModal(true)}
                        className="px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    >
                        📊 Importar Excel
                    </button>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${showForm
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-blue-600 text-white shadow-sm'
                        }`}
                    >
                        {showForm ? "Cerrar Registro" : "+ Nuevo Producto"}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <AddProduct onProductAdded={() => { loadProducts(); setShowForm(false); }} />
                    </div>
                )}

                {/* MODAL DE IMPORTACIÓN */}
                {showImportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Importar Productos desde Excel</h2>
                                <button onClick={() => { setShowImportModal(false); setImportResult(null); setImportFile(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 mb-3">📋 El archivo Excel debe contener las siguientes columnas:</p>
                                    <p className="text-xs text-blue-600 font-mono">CÓDIGO | NOMBRE | CATEGORÍA | UBICACIÓN | UNIDADES/CAJA | STOCK | STOCK MÍN | PRECIO COMPRA | P. HORIZONTAL | P. MAYORISTA | P. MODERNO</p>
                                    <button onClick={downloadTemplate} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 underline">
                                        ⬇️ Descargar plantilla de ejemplo
                                    </button>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <input 
                                        type="file" 
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setImportFile(e.target.files[0])}
                                        className="hidden"
                                        id="excel-upload"
                                    />
                                    <label htmlFor="excel-upload" className="cursor-pointer">
                                        <div className="text-4xl mb-2">📁</div>
                                        <p className="text-sm font-bold text-gray-700">{importFile ? importFile.name : 'Seleccionar archivo Excel'}</p>
                                        <p className="text-xs text-gray-500 mt-1">Haz clic para seleccionar</p>
                                    </label>
                                </div>

                                {importResult && (
                                    <div className={`p-4 rounded-lg ${importResult.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                                        {importResult.error ? (
                                            <p className="text-sm text-red-800 font-bold">❌ {importResult.error}</p>
                                        ) : (
                                            <div className="text-sm text-green-800">
                                                <p className="font-bold mb-2">✅ Importación exitosa:</p>
                                                <p>• {importResult.created} productos creados</p>
                                                <p>• {importResult.updated} productos actualizados</p>
                                                {importResult.errors?.length > 0 && (
                                                    <div className="mt-2 text-xs text-orange-600">
                                                        <p className="font-bold">⚠️ Errores:</p>
                                                        {importResult.errors.slice(0, 5).map((err, i) => <p key={i}>• {err}</p>)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleImportExcel}
                                        disabled={!importFile || isImporting}
                                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isImporting ? '⏳ Importando...' : '📥 Importar Productos'}
                                    </button>
                                    <button 
                                        onClick={() => { setShowImportModal(false); setImportResult(null); setImportFile(null); }}
                                        className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {filteredProducts.length === 0 ? (
                    <div className="text-center p-20 bg-white rounded-lg border border-gray-200 border-dashed">
                        <p className="text-gray-400 text-sm font-medium">No se encontraron registros.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' && (
                            <ProductGrid 
                                products={filteredProducts}
                                onRefresh={loadProducts}
                                isGerente={user?.role === 'GERENCIA'}
                                onEdit={setEditingProduct}
                            />
                        )}
                        {viewMode === 'gallery' && (
                            <ProductGallery 
                                products={filteredProducts}
                                onRefresh={loadProducts}
                                isGerente={user?.role === 'GERENCIA'}
                                onEdit={setEditingProduct}
                            />
                        )}
                        {viewMode === 'list' && (
                            <ProductList 
                                products={filteredProducts}
                                onRefresh={loadProducts}
                                isGerente={user?.role === 'GERENCIA'}
                                onEdit={setEditingProduct}
                            />
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

function ProductGrid({ products, onRefresh, isGerente, onEdit }) {
    const { currency } = useCurrency();
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard 
                    key={`${product.id}-${currency}`}
                    product={product} 
                    onRefresh={onRefresh}
                    isGerente={isGerente}
                    onEdit={() => onEdit(product)}
                />
            ))}
        </div>
    );
}

function ProductGallery({ products, onRefresh, isGerente, onEdit }) {
    const { currency } = useCurrency();
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductGalleryCard 
                    key={`${product.id}-${currency}`}
                    product={product} 
                    onRefresh={onRefresh}
                    isGerente={isGerente}
                    onEdit={() => onEdit(product)}
                />
            ))}
        </div>
    );
}

function ProductGalleryCard({ product, onRefresh, isGerente, onEdit }) {
    const isLowStock = product.stock <= product.stock_min;
    const { formatAmount } = useCurrency();
    const stockPercentage = (product.stock / (product.stock_min * 3)) * 100;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group relative transform hover:-translate-y-1">
            {isGerente && (
                <button 
                    onClick={onEdit}
                    className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:border-blue-300 shadow-lg"
                >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            )}

            <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                {product.product_image ? (
                    <>
                        <img 
                            src={product.product_image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sin Imagen</span>
                    </div>
                )}
                
                {isLowStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-tight shadow-lg animate-pulse">
                        ⚠️ Stock Crítico
                    </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-tight shadow-lg">
                    {product.category_name || 'General'}
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{product.code}</p>
                    {product.warehouse_location && (
                        <p className="text-xs text-blue-600 font-bold mt-1">📍 {product.warehouse_location}</p>
                    )}
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase">Precio</span>
                        <span className="text-xl font-black text-gray-900">{formatAmount(product.purchase_price)}</span>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500 font-bold uppercase">Stock</span>
                            <span className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
                                {product.stock} <span className="text-xs text-gray-400 font-medium">uds</span>
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                    isLowStock ? 'bg-red-500' : stockPercentage > 50 ? 'bg-emerald-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                        </div>
                        {product.units_per_box > 1 && (
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                📦 {product.total_boxes?.toFixed(1)} cajas ({product.units_per_box} uds/caja)
                            </p>
                        )}
                    </div>
                </div>

                <StockAdjustment product={product} onUpdate={onRefresh} />
            </div>
        </div>
    );
}

function ProductList({ products, onRefresh, isGerente, onEdit }) {
    const { currency } = useCurrency();
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Imagen</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Producto</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Categoría</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ubicación</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Precio</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <ProductListRow 
                                key={`${product.id}-${currency}`}
                                product={product} 
                                onRefresh={onRefresh}
                                isGerente={isGerente}
                                onEdit={() => onEdit(product)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProductListRow({ product, onRefresh, isGerente, onEdit }) {
    const isLowStock = product.stock <= product.stock_min;
    const { formatAmount } = useCurrency();

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {product.product_image ? (
                        <img src={product.product_image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                <div>
                    <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{product.code}</p>
                    {product.units_per_box > 1 && (
                        <p className="text-xs text-blue-600 mt-1">📦 {product.units_per_box} uds/caja</p>
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {product.category_name || 'General'}
                </span>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-gray-600 font-medium">
                    {product.warehouse_location || '-'}
                </span>
            </td>
            <td className="px-4 py-3 text-right">
                <div>
                    <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
                        {product.stock}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">uds</span>
                    {isLowStock && (
                        <div className="text-xs text-red-500 font-bold mt-1">⚠️ Crítico</div>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 text-right">
                <span className="text-sm font-bold text-gray-900">{formatAmount(product.purchase_price)}</span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                    {isGerente && (
                        <button 
                            onClick={onEdit}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    )}
                    <StockAdjustment product={product} onUpdate={onRefresh} />
                </div>
            </td>
        </tr>
    );
}

function ProductCard({ product, onRefresh, isGerente, onEdit }) {
    const isLowStock = product.stock <= product.stock_min;
    const { formatAmount, currency } = useCurrency();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative">
            {/* BOTÓN EDITAR PARA GERENTE */}
            {isGerente && (
                <button 
                    onClick={onEdit}
                    className="absolute top-2 left-2 z-10 bg-white/90 p-2 rounded-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            )}

            <div className="relative h-44 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                {product.product_image ? (
                    <img src={product.product_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Sin imagen</span>
                    </div>
                )}
                {isLowStock && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] px-2 py-1 rounded-sm font-bold uppercase tracking-tighter shadow-sm">
                        Stock Crítico
                    </span>
                )}
            </div>

            <div className="p-5">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                    {product.category_name || 'General'}
                </span>
                <h3 className="font-bold text-gray-800 truncate text-sm mb-4">{product.name}</h3>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 mb-4">
                    <div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Precio Unitario</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {formatAmount(product.purchase_price)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Stock</p>
                        <p className={`text-sm font-bold ${isLowStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {product.stock} <span className="text-[10px] text-gray-400 font-medium">Uds</span>
                        </p>
                        {product.units_per_box > 1 && (
                            <p className="text-[9px] text-gray-500 mt-1">
                                {product.total_boxes?.toFixed(1)} cajas
                            </p>
                        )}
                    </div>
                </div>

                <StockAdjustment product={product} onUpdate={onRefresh} />
            </div>
        </div>
    );
}