import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { useCurrency } from '../../../context/CurrencyContext';

export function PettyCashManager() {
    const { formatAmount } = useCurrency();
    const [pettyCash, setPettyCash] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        transaction_type: 'GASTO',
        category: 'REFRIGERIO',
        amount: '',
        description: '',
        receipt_number: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log('📥 Cargando datos de caja chica...');
            const [cashRes, transRes] = await Promise.all([
                axios.get('/accounting/petty-cash/'),
                axios.get('/accounting/petty-cash-transactions/')
            ]);
            
            console.log('💰 Caja chica response:', cashRes.data);
            console.log('📋 Transacciones response:', transRes.data);
            
            // Manejar respuesta paginada
            const cashData = cashRes.data.results || cashRes.data;
            
            // Usar la primera caja chica activa o crear una nueva
            if (Array.isArray(cashData) && cashData.length > 0) {
                // Buscar la caja chica activa con más transacciones
                const activeCash = cashData.find(c => c.is_active) || cashData[0];
                setPettyCash(activeCash);
                console.log('✅ Usando caja chica ID:', activeCash.id);
                
                // Cargar transacciones de esta caja específica
                const specificTransRes = await axios.get(`/accounting/petty-cash-transactions/?petty_cash=${activeCash.id}`);
                const transData = specificTransRes.data.results || specificTransRes.data;
                const transactionsArray = Array.isArray(transData) ? transData : [];
                console.log('📊 Transacciones de caja', activeCash.id, ':', transactionsArray.length);
                setTransactions(transactionsArray);
            } else {
                // Crear caja chica si no existe
                console.log('⚠️ No existe caja chica, creando...');
                const newCash = await axios.post('/accounting/petty-cash/', {
                    name: 'Caja Chica Principal',
                    initial_amount: 0
                });
                console.log('✅ Caja chica creada:', newCash.data);
                setPettyCash(newCash.data);
                setTransactions([]);
            }
        } catch (error) {
            console.error('❌ Error cargando caja chica:', error);
            console.error('Error details:', error.response?.data);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('📤 Enviando transacción:', {
                ...formData,
                petty_cash: pettyCash.id
            });
            
            const response = await axios.post('/accounting/petty-cash-transactions/', {
                ...formData,
                petty_cash: pettyCash.id
            });
            
            console.log('✅ Transacción guardada:', response.data);
            
            setFormData({
                transaction_type: 'GASTO',
                category: 'REFRIGERIO',
                amount: '',
                description: '',
                receipt_number: ''
            });
            setShowForm(false);
            await loadData();
            alert('✅ Movimiento registrado exitosamente');
        } catch (error) {
            console.error('❌ Error registrando movimiento:', error);
            console.error('Error response:', error.response?.data);
            alert(`Error: ${error.response?.data?.detail || error.message || 'No se pudo guardar el movimiento'}`);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div className="space-y-6">
            {/* Header con Saldo */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-90">Saldo Disponible</p>
                        <p className="text-4xl font-black mt-2">{formatAmount(pettyCash?.current_balance || 0)}</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-all"
                    >
                        {showForm ? 'Cancelar' : '+ Nuevo Movimiento'}
                    </button>
                </div>
            </div>

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Registrar Movimiento</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Tipo</label>
                                <select
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm"
                                    value={formData.transaction_type}
                                    onChange={(e) => setFormData({...formData, transaction_type: e.target.value})}
                                >
                                    <option value="GASTO">Gasto</option>
                                    <option value="INGRESO">Ingreso/Reposición</option>
                                </select>
                            </div>
                            
                            {formData.transaction_type === 'GASTO' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">Categoría</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="REFRIGERIO">Refrigerio</option>
                                        <option value="TRANSPORTE">Transporte</option>
                                        <option value="COMBUSTIBLE">Combustible</option>
                                        <option value="PAPELERIA">Papelería</option>
                                        <option value="LIMPIEZA">Limpieza</option>
                                        <option value="MANTENIMIENTO">Mantenimiento</option>
                                        <option value="OTROS">Otros</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Monto (Bs.)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">N° Recibo (Opcional)</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm"
                                    value={formData.receipt_number}
                                    onChange={(e) => setFormData({...formData, receipt_number: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Descripción</label>
                            <textarea
                                required
                                rows="2"
                                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all"
                        >
                            Registrar Movimiento
                        </button>
                    </form>
                </div>
            )}

            {/* Historial */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Historial de Movimientos</h3>
                <div className="space-y-3">
                    {!Array.isArray(transactions) || transactions.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">No hay movimientos registrados</p>
                    ) : (
                        transactions.map((trans) => (
                            <div key={trans.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{trans.description}</p>
                                    <p className="text-xs text-slate-500">
                                        {trans.category} • {new Date(trans.created_at).toLocaleDateString()} • {trans.user_name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${trans.transaction_type === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}>
                                        {trans.transaction_type === 'INGRESO' ? '+' : '-'} {formatAmount(trans.amount)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
