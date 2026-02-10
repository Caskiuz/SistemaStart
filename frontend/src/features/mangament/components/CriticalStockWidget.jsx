export function CriticalStockWidget({ products = [] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Alertas de Almacén</h3>
            <div className="space-y-4">
                {products.length > 0 ? products.map((prod, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-slate-50 pb-2">
                        <div>
                            <p className="text-xs font-semibold text-slate-700">{prod.name}</p>
                            <p className="text-[9px] text-slate-400">Punto de reorden: {prod.stock_min} u.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-rose-600">{prod.stock} en stock</span>
                        </div>
                    </div>
                )) : <p className="text-[10px] text-slate-400 text-center py-4">Sin alertas de stock</p>}
            </div>
        </div>
    );
}