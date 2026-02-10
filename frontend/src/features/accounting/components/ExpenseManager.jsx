import React, { useState, useEffect } from 'react';
import { accountingService } from '../services/accountingService';
import { useCurrency } from '../../../context/CurrencyContext';

export function ExpenseManager() {
    const { formatAmount } = useCurrency();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ description: '', amount: '', category: 'OTROS' });
    const [message, setMessage] = useState({ text: "", type: "" }); 

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const data = await accountingService.getExpenses();
            setExpenses(data);
        } catch (error) {
            console.error("Error cargando egresos", error);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.description || !form.amount) {
            return showMessage("Completa los campos obligatorios", "error");
        }
        
        try {
            await accountingService.createExpense(form);
            setForm({ description: '', amount: '', category: 'OTROS' });
            showMessage("Egreso registrado correctamente", "success");
            loadExpenses(); 
        } catch (error) {
            showMessage("Error al registrar gasto", "error");
        }
    };

    return (
        <div className="space-y-6">
            {/* Formulario de Registro */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Registrar Nuevo Egreso</h3>
                    
                    {/* Mensaje de feedback visual */}
                    {message.text && (
                        <span className={`text-[10px] font-bold uppercase tracking-tighter animate-pulse ${
                            message.type === 'success' ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                            {message.text}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input 
                        className="md:col-span-1 px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:border-blue-500 transition-all"
                        placeholder="Descripción"
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                    />
                    <select 
                        className="px-3 py-2 border border-slate-200 rounded text-sm bg-white outline-none"
                        value={form.category}
                        onChange={e => setForm({...form, category: e.target.value})}
                    >
                        <option value="PERSONAL">Sueldos</option>
                        <option value="LOGISTICA">Logística/Gasolina</option>
                        <option value="SERVICIOS">Servicios</option>
                        <option value="OTROS">Otros</option>
                    </select>
                    <input 
                        type="number"
                        className="px-3 py-2 border border-slate-200 rounded text-sm outline-none"
                        placeholder="Monto Bs."
                        value={form.amount}
                        onChange={e => setForm({...form, amount: e.target.value})}
                    />
                    <button type="submit" className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-tighter rounded hover:bg-slate-800 transition-colors">
                        Guardar Movimiento
                    </button>
                </form>
            </div>

            {/* Tabla de Historial */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Fecha</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Descripción</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">Categoría</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {expenses.map(exp => (
                            <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-3 text-xs text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                                <td className="px-5 py-3 text-xs font-bold text-slate-700 uppercase">{exp.description}</td>
                                <td className="px-5 py-3 text-center">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase border border-slate-200">
                                        {exp.category_display || exp.category}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-xs font-black text-rose-600 text-right">
                                    - {formatAmount(exp.amount)}
                                </td>
                            </tr>
                        ))}
                        {expenses.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="px-5 py-10 text-center text-xs text-slate-400 uppercase font-medium">No hay egresos registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}