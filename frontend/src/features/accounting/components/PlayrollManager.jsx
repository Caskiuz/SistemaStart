import { useState, useEffect } from 'react';
import { accountingService } from '../services/accountingService';
import { useCurrency } from '../../../context/CurrencyContext';

export function PayrollManager() {
    const { formatAmount } = useCurrency();
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newSalary, setNewSalary] = useState("");
    const [notification, setNotification] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // Estado para el modal de confirmación

    useEffect(() => { loadUsers(); }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const loadUsers = async () => {
        try {
            const data = await accountingService.getSystemUsers();
            setUsers(data);
        } catch (error) {
            showNotify("error", "Error de conexión");
        }
    };

    const showNotify = (type, message) => setNotification({ type, message });

    const handleSaveSalary = async (userId) => {
        if (!newSalary || newSalary < 0) return showNotify("error", "Monto no válido");
        try {
            await accountingService.updateSalary(userId, newSalary);
            setEditingId(null);
            loadUsers();
            showNotify("success", "Sueldo actualizado");
        } catch (error) {
            showNotify("error", "Error al actualizar");
        }
    };

    const executePayment = async () => {
        const { userId, salary, username } = confirmAction;
        try {
            await accountingService.processPayroll({
                employee_id: userId,
                amount_paid: salary,
                month_period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
            });

            showNotify("success", `Pago realizado: ${username}`);
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));

            setConfirmAction(null);
        } catch (error) {
            showNotify("error", "Error en la transacción");
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative transition-all">

            {/* Modal de Confirmación Profesional */}
            {confirmAction && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-200 w-80 text-center scale-in-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">Confirmar Desembolso</h4>
                        <p className="text-[11px] text-slate-500 mb-6">¿Desea procesar el pago de <strong>{formatAmount(confirmAction.salary)}</strong> para {confirmAction.username}?</p>
                        <div className="flex gap-2">
                            <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase">Cancelar</button>
                            <button onClick={executePayment} className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase transition-transform active:scale-95 shadow-lg shadow-slate-200">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificaciones */}
            {notification && (
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-[11px] font-semibold tracking-wide shadow-xl border transition-all z-[60] flex items-center gap-3 animate-in slide-in-from-right-5
                    ${notification.type === 'success' ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-rose-100 text-rose-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {notification.message}
                </div>
            )}

            <header className="px-8 py-6 border-b border-slate-50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Control de Nómina</h3>
            </header>

            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/30">
                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">Personal</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">Salario Base</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Gestión</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700">{u.username}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{u.role}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                {editingId === u.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number" autoFocus
                                            className="w-24 px-2 py-1.5 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-blue-500/10 outline-none"
                                            value={newSalary}
                                            onChange={(e) => setNewSalary(e.target.value)}
                                        />
                                        <button onClick={() => handleSaveSalary(u.id)} className="text-emerald-500 p-1 hover:bg-emerald-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg></button>
                                        <button onClick={() => setEditingId(null)} className="text-slate-300 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-600 tracking-tight">
                                            {formatAmount(u.base_salary || 0)}
                                        </span>
                                        <button
                                            onClick={() => { setEditingId(u.id); setNewSalary(u.base_salary); }}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-blue-500 transition-all"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button
                                    onClick={() => setConfirmAction({ userId: u.id, username: u.username, salary: u.base_salary })}
                                    className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm"
                                >
                                    Emitir Pago
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}