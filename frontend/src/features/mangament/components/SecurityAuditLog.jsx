export function SecurityAuditLog({ logs = [] }) {
    return (
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Auditoría del Sistema</h3>
            <div className="space-y-3">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-4 text-[11px] font-mono leading-tight border-l-2 border-slate-700 pl-3">
                        <span className="text-slate-500">{log.time}</span>
                        <span className="text-blue-400 uppercase font-bold">{log.user}</span>
                        <span className="text-slate-300">{log.action}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}