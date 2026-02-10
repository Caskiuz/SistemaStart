// import { useEffect, useState } from "react"
// import { useAuth } from "../features/auth/context/AuthContext"
// import { ClientTable } from "../features/sales/components/ClientTable"
// import { ListPreSale } from "../features/presale/components/ListPreSale"
// import { ProductsList } from "../features/products/components/ProductsList"
// import { MovementHistory } from "../features/products/components/MovementHistory"
// import { RoutesList } from "../features/distribution/components/RoutesList"
// import { ReturnsManager } from "../features/products/components/ReturnsManager"
// import { LogisticsPanel } from "../features/distribution/components/LogisticPanel"
// import { CreatePreSale } from "../features/presale/components/CreatePreSale"
// import { ClientForm } from "../features/sales/components/ClientForm"
// import { CashSettlementForm } from "../features/accounting/components/CashSettlementForm"
// import { SettlementList } from "../features/accounting/components/SettlementList"
// import { ExpenseManager } from "../features/accounting/components/ExpenseManager"
// import { FinancialSummary } from "../features/accounting/components/FinancialSummary"
// import { PayrollManager } from "../features/accounting/components/PlayRollManager"
// import { PayablesManager } from "../features/accounting/components/PayablesManager"
// import { PriceRulesManager } from "../features/accounting/components/PriceRulesManager"
// import { ReceivablesManager } from "../features/accounting/components/ReceivablesManager"

// // MÓDULO GERENCIA
// import { ReportsDashboard } from "../features/mangament/components/ReportsDashboard"
// import { SecurityAuditLog } from "../features/mangament/components/SecurityAuditLog"
// import { ProfitMarginWidget } from "../features/mangament/components/ProfitMarginWidget"
// import { CriticalStockWidget } from "../features/mangament/components/CriticalStockWidget"

// // SERVICIO
// import { preSaleService } from "../features/presale/services/preSaleServices"

// export function Dashboard() {
//     const { user } = useAuth()
//     const [activeTab, setActiveTab] = useState('main');
//     const [selectedBatch, setSelectedBatch] = useState(null);

//     // --- ESTADO PARA ESTADÍSTICAS GERENCIALES (Soluciona ReferenceError) ---
//     const [stats, setStats] = useState({
//         ventas_totales: 0,
//         gastos_totales: 0,
//         cuentas_por_cobrar: 0,
//         productos_criticos: [],
//         recientes_logs: [],
//         distribucion_estados: [],
//         top_productos: []
//     });
//     const [loading, setLoading] = useState(false);

//     // --- CARGA DE DATOS REALES ---
//     useEffect(() => {
//         const loadGerenciaData = async () => {
//             if (user?.role === 'GERENCIA') {
//                 setLoading(true);
//                 const response = await preSaleService.getDashboardStats();
//                 if (response.success) {
//                     setStats(response.data);
//                 }
//                 setLoading(false);
//             }
//         };
//         loadGerenciaData();
//     }, [user]);

//     // Estilos de pestañas
//     const tabClass = (id) => `
//         px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 
//         ${activeTab === id
//             ? 'border-slate-900 text-slate-900 bg-slate-50/50'
//             : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/30'}
//     `;

//     return (
//         <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-900">
//             {/* Header Corporativo */}
//             <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
//                 <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
//                             Enterprise <span className="text-blue-600">Core</span>
//                         </h1>
//                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">
//                             Sistema de Gestión Interna
//                         </p>
//                     </div>

//                     <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
//                         <div className="text-right">
//                             <p className="text-xs font-bold text-slate-800 leading-none">{user?.username}</p>
//                             <p className="text-[10px] text-blue-500 font-black uppercase mt-1">{user?.role}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
//                             {user?.username?.charAt(0).toUpperCase()}
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto p-8">

//                 {/* --- INTERFAZ CONTABILIDAD --- */}
//                 {user?.role === 'CONTABILIDAD' && (
//                     <div className="space-y-6">
//                         <FinancialSummary refreshTrigger={activeTab} />
//                         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//                             <div className="border-b border-slate-100 flex overflow-x-auto bg-white">
//                                 <button onClick={() => { setActiveTab('liquidations'); setSelectedBatch(null) }} className={tabClass('liquidations')}>Liquidación de Rutas</button>
//                                 <button onClick={() => setActiveTab('receivables')} className={tabClass('receivables')}>Cuentas por Cobrar</button>
//                                 <button onClick={() => setActiveTab('payables')} className={tabClass('payables')}>Cuentas por Pagar</button>
//                                 <button onClick={() => setActiveTab('payments-history')} className={tabClass('payments-history')}>Pagos Realizados</button>
//                                 <button onClick={() => setActiveTab('price-rules')} className={tabClass('price-rules')}>Reglas de Precios</button>
//                                 <button onClick={() => setActiveTab('payroll')} className={tabClass('payroll')}>Planilla Sueldos</button>
//                             </div>

//                             <div className="p-6">
//                                 {activeTab === 'liquidations' && !selectedBatch && (
//                                     <SettlementList onSelectBatch={(id) => {
//                                         setSelectedBatch(id);
//                                         setActiveTab('process-settlement');
//                                     }} />
//                                 )}

//                                 {activeTab === 'process-settlement' && selectedBatch && (
//                                     <div className="max-w-md mx-auto py-8">
//                                         <CashSettlementForm
//                                             batchId={selectedBatch}
//                                             onComplete={() => {
//                                                 setSelectedBatch(null);
//                                                 setActiveTab('liquidations');
//                                             }}
//                                         />
//                                     </div>
//                                 )}

//                                 {activeTab === 'receivables' && <ReceivablesManager />}
//                                 {activeTab === 'payables' && <PayablesManager />}
//                                 {activeTab === 'payments-history' && <ExpenseManager />}
//                                 {activeTab === 'price-rules' && <PriceRulesManager />}
//                                 {activeTab === 'payroll' && <PayrollManager />}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* --- INTERFAZ VENTAS --- */}
//                 {user?.role === 'VENTAS' && (
//                     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//                         <div className="border-b border-slate-100 flex overflow-x-auto bg-white scrollbar-hide">
//                             <button onClick={() => setActiveTab('clients')} className={tabClass('clients')}>Lista Clientes</button>
//                             <button onClick={() => setActiveTab('new-client')} className={tabClass('new-client')}>Registrar Cliente</button>
//                             <button onClick={() => setActiveTab('history')} className={tabClass('history')}>Historial Preventas</button>
//                             <button onClick={() => setActiveTab('new-presale')} className={tabClass('new-presale')}>Nueva Preventa</button>
//                         </div>
//                         <div className="p-6">
//                             {activeTab === 'clients' && <ClientTable />}
//                             {activeTab === 'new-client' && <ClientForm />}
//                             {activeTab === 'history' && <ListPreSale />}
//                             {activeTab === 'new-presale' && <CreatePreSale />}
//                         </div>
//                     </div>
//                 )}

//                 {/* --- INTERFAZ ALMACÉN --- */}
//                 {user?.role === 'ALMACEN' && (
//                     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//                         <div className="border-b border-slate-100 flex overflow-x-auto bg-white">
//                             <button onClick={() => setActiveTab('inventory')} className={tabClass('inventory')}>Inventario</button>
//                             <button onClick={() => setActiveTab('movements')} className={tabClass('movements')}>Movimientos</button>
//                             <button onClick={() => setActiveTab('logistics')} className={tabClass('logistics')}>Logística</button>
//                             <button onClick={() => setActiveTab('returns')} className={tabClass('returns')}>Devoluciones</button>
//                         </div>
//                         <div className="p-6">
//                             {activeTab === 'inventory' && <ProductsList />}
//                             {activeTab === 'movements' && <MovementHistory />}
//                             {activeTab === 'logistics' && <LogisticsPanel />}
//                             {activeTab === 'returns' && <ReturnsManager />}
//                         </div>
//                     </div>
//                 )}

//                 {/* --- INTERFAZ DISTRIBUCIÓN --- */}
//                 {user?.role === 'DISTRIBUCION' && (
//                     <div className="max-w-3xl mx-auto">
//                         <div className="mb-8 text-center">
//                             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Rutas de Entrega</h2>
//                             <p className="text-sm text-slate-500">Seleccione una ruta para iniciar el despacho</p>
//                         </div>
//                         <RoutesList />
//                     </div>
//                 )}

//                 {user?.role === 'GERENCIA' && (
//                     <div className="space-y-6">
//                         {/* 1. Widgets de Resumen Rápido (Siempre visibles arriba) */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <ProfitMarginWidget
//                                 sales={stats.ventas_totales}
//                                 expenses={stats.gastos_totales}
//                                 debt={stats.cuentas_por_cobrar}
//                             />
//                             <CriticalStockWidget products={stats.productos_criticos} />

//                             {/* Widget de Seguridad Rápido */}
//                             <div className="bg-[#1a1f2e] rounded-xl p-5 border border-slate-800 shadow-sm overflow-hidden relative">
//                                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Estado del Sistema</h3>
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between items-center text-[11px]">
//                                         <span className="text-slate-400">Último acceso:</span>
//                                         <span className="text-emerald-400 font-mono">{stats.recientes_logs[0]?.time || '--:--'}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-[11px]">
//                                         <span className="text-slate-400">Acción reciente:</span>
//                                         <span className="text-blue-400 font-mono truncate ml-2">
//                                             {stats.recientes_logs[0]?.user || 'Ninguna'}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* 2. Contenedor de Navegación Universal para Gerencia */}
//                         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//                             <div className="border-b border-slate-100 flex overflow-x-auto bg-white scrollbar-hide">
//                                 {/* Dashboard Principal */}
//                                 <button onClick={() => setActiveTab('main')} className={tabClass('main')}>Reportes Base</button>

//                                 {/* Acceso a Ventas */}
//                                 <button onClick={() => setActiveTab('clients')} className={tabClass('clients')}>Clientes</button>
//                                 <button onClick={() => setActiveTab('new-presale')} className={tabClass('new-presale')}>Crear Preventa</button>
//                                 <button onClick={() => setActiveTab('client-form')} className={tabClass('client-form')}>Registrar cliente</button>

//                                 {/* Acceso a Almacén */}
//                                 <button onClick={() => setActiveTab('inventory')} className={tabClass('inventory')}>Inventario</button>
//                                 <button onClick={() => setActiveTab('returns')} className={tabClass('returns')}>Devoluciones</button>

//                                 {/* Acceso a Distribución */}
//                                 <button onClick={() => setActiveTab('gerencia-logistics')} className={tabClass('gerencia-logistics')}>Logística/Rutas</button>

//                                 {/* Acceso a Contabilidad */}
//                                 <button onClick={() => setActiveTab('gerencia-accounting')} className={tabClass('gerencia-accounting')}>Contabilidad</button>
//                                 <button onClick={() => setActiveTab('payroll')} className={tabClass('payroll')}>Planilla/Sueldos</button>

//                                 {/* Auditoría */}
//                                 <button onClick={() => setActiveTab('gerencia-audit')} className={tabClass('gerencia-audit')}>Auditoría</button>
//                             </div>

//                             <div className="p-6">
//                                 {/* RENDERIZADO DE COMPONENTES SEGÚN PESTAÑA */}

//                                 {/* Dashboard y Auditoría */}
//                                 {activeTab === 'main' && <ReportsDashboard data={stats} />}
//                                 {activeTab === 'gerencia-audit' && <SecurityAuditLog logs={stats.recientes_logs} />}

//                                 {/* Módulo Ventas */}
//                                 {activeTab === 'clients' && <ClientTable />}
//                                 {activeTab === 'new-presale' && <CreatePreSale />}
//                                 {activeTab === 'client-form' && <ClientForm />}

//                                 {/* Módulo Almacén */}
//                                 {activeTab === 'inventory' && <ProductsList />}
//                                 {activeTab === 'returns' && <ReturnsManager />}

//                                 {/* Módulo Distribución */}
//                                 {(activeTab === 'gerencia-logistics') && (
//                                     <div className="space-y-8">
//                                         <LogisticsPanel />
//                                         <hr className="border-slate-100" />
//                                         <RoutesList />
//                                     </div>
//                                 )}

//                                 {/* Módulo Contabilidad */}
//                                 {activeTab === 'gerencia-accounting' && (
//                                     <div className="space-y-6">
//                                         <FinancialSummary />
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <ReceivablesManager />
//                                             <PayablesManager />
//                                         </div>
//                                         <ExpenseManager />
//                                     </div>
//                                 )}
//                                 {activeTab === 'payroll' && <PayrollManager />}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     )
// }

import { useEffect, useState } from "react"
import { useAuth } from "../features/auth/context/AuthContext"
import { ClientTable } from "../features/sales/components/ClientTable"
import { ListPreSale } from "../features/presale/components/ListPreSale"
import { ProductsList } from "../features/products/components/ProductsList"
import { MovementHistory } from "../features/products/components/MovementHistory"
import { RoutesList } from "../features/distribution/components/RoutesList"
import { ReturnsManager } from "../features/products/components/ReturnsManager"
import { LogisticsPanel } from "../features/distribution/components/LogisticPanel"
import { CreatePreSale } from "../features/presale/components/CreatePreSale"
import { ClientForm } from "../features/sales/components/ClientForm"
import { CashSettlementForm } from "../features/accounting/components/CashSettlementForm"
import { SettlementList } from "../features/accounting/components/SettlementList"
import { ExpenseManager } from "../features/accounting/components/ExpenseManager"
import { FinancialSummary } from "../features/accounting/components/FinancialSummary"
import { PayrollManager } from "../features/accounting/components/PlayRollManager"
import { PayablesManager } from "../features/accounting/components/PayablesManager"
// import { PriceRulesManager } from "../features/accounting/components/PriceRulesManager"
import { ReceivablesManager } from "../features/accounting/components/ReceivablesManager"

// MÓDULO GERENCIA
import { ReportsDashboard } from "../features/mangament/components/ReportsDashboard"
import { SecurityAuditLog } from "../features/mangament/components/SecurityAuditLog"
import { ProfitMarginWidget } from "../features/mangament/components/ProfitMarginWidget"
import { CriticalStockWidget } from "../features/mangament/components/CriticalStockWidget"
import { SalesReport } from "../features/sales/components/SalesReport"
import { ExchangeRateManager } from "../features/accounting/components/ExchangeRateManager"
import { CreateRoutes } from "../features/distribution/components/CreateRoutes"
import { GPSTracker } from "../features/distribution/components/GPSTracker"
import { SalesGPSTracker } from "../features/auth/components/SalesGPSTracker"
import { PettyCashManager } from "../features/accounting/components/PettyCashManager"

// SERVICIO
import { preSaleService } from "../features/presale/services/preSaleServices"

export function Dashboard() {
    const { user } = useAuth()
    const [activeSection, setActiveSection] = useState('gerencia-dashboard');
    const [activeTab, setActiveTab] = useState('main');
    const [selectedBatch, setSelectedBatch] = useState(null);

    const [stats, setStats] = useState({
        ventas_totales: 0,
        gastos_totales: 0,
        cuentas_por_cobrar: 0,
        productos_criticos: [],
        recientes_logs: [],
        distribucion_estados: [],
        top_productos: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGerenciaData = async () => {
            if (user?.role === 'GERENCIA') {
                setLoading(true);
                setError(null);
                const response = await preSaleService.getDashboardStats();
                console.log('📊 Dashboard Stats Response:', response);
                if (response.success && response.data) {
                    console.log('✅ Stats Data:', response.data);
                    setStats(response.data);
                } else {
                    console.error('❌ Error loading stats:', response.error);
                    setError(response.error || 'Error al cargar estadísticas');
                }
                setLoading(false);
            }
        };
        loadGerenciaData();
    }, [user]);

    // Clases de estilo para consistencia visual
    const sectionTabClass = (id) => `
        px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 border-b-2 whitespace-nowrap flex-shrink-0
        ${activeSection === id
            ? 'text-blue-600 border-blue-600 bg-blue-50/30'
            : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50'}
    `;

    const subTabClass = (id) => `
        px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all
        ${activeTab === id
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}
    `;

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-900">
            {/* Header Corporativo */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                            Enterprise <span className="text-blue-600">Core</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">
                            Sistema de Gestión Interna
                        </p>
                    </div>

                    <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-800 leading-none">{user?.username}</p>
                            <p className="text-[10px] text-blue-500 font-black uppercase mt-1">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">

                {/* --- INTERFAZ GERENCIA (REESTRUCTURADA) --- */}
                {user?.role === 'GERENCIA' && (
                    <div className="space-y-6">
                        {/* Indicador de carga */}
                        {loading && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                    <span className="text-sm font-medium text-blue-700">Cargando datos del sistema...</span>
                                </div>
                            </div>
                        )}

                        {/* Error de autenticación */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔒</span>
                                    <div>
                                        <p className="text-sm font-semibold text-red-800">Error de autenticación</p>
                                        <p className="text-xs text-red-600 mt-1">{error}</p>
                                        <p className="text-xs text-red-500 mt-2">Por favor, cierra sesión y vuelve a iniciar sesión.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 1. Widgets de Resumen Rápido */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ProfitMarginWidget
                                sales={stats?.ventas_totales || 0}
                                expenses={stats?.gastos_totales || 0}
                                debt={stats?.cuentas_por_cobrar || 0}
                            />
                            <CriticalStockWidget products={stats?.productos_criticos || []} />
                            <div className="bg-[#1a1f2e] rounded-xl p-5 border border-slate-800 shadow-sm">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Estado del Sistema</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-slate-400">Último acceso:</span>
                                        <span className="text-emerald-400 font-mono">{stats?.recientes_logs?.[0]?.time || '--:--'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-slate-400">Usuario:</span>
                                        <span className="text-blue-400 font-mono truncate ml-2">
                                            {stats?.recientes_logs?.[0]?.user || 'Ninguna'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Navegación Principal por Secciones */}
                        <div className="bg-white border border-slate-200 rounded-t-2xl shadow-sm overflow-x-auto flex">
                            <button onClick={() => { setActiveSection('gerencia-dashboard'); setActiveTab('main') }} className={sectionTabClass('gerencia-dashboard')}>Dashboard</button>
                            <button onClick={() => { setActiveSection('gerencia-ventas'); setActiveTab('clients') }} className={sectionTabClass('gerencia-ventas')}>Ventas</button>
                            <button onClick={() => { setActiveSection('gerencia-almacen'); setActiveTab('inventory') }} className={sectionTabClass('gerencia-almacen')}>Almacén</button>
                            <button onClick={() => { setActiveSection('gerencia-distribucion'); setActiveTab('gerencia-logistics') }} className={sectionTabClass('gerencia-distribucion')}>Distribución</button>
                            <button onClick={() => { setActiveSection('gerencia-contabilidad'); setActiveTab('gerencia-accounting') }} className={sectionTabClass('gerencia-contabilidad')}>Contabilidad</button>
                        </div>

                        {/* 3. Panel de Contenido con Sub-Navegación Dinámica */}
                        <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl shadow-sm p-8 min-h-[600px]">

                            {/* Sub-Tabs Dinámicos */}
                            <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-50">
                                {activeSection === 'gerencia-dashboard' && (
                                    <>
                                        <button onClick={() => setActiveTab('main')} className={subTabClass('main')}>Reportes Base</button>
                                        <button onClick={() => setActiveTab('gerencia-audit')} className={subTabClass('gerencia-audit')}>Auditoría de Seguridad</button>
                                        <button onClick={() => setActiveTab('report-product')} className={subTabClass('report-product')}>Reportes de venta</button>
                                    </>
                                )}
                                {activeSection === 'gerencia-ventas' && (
                                    <>
                                        <button onClick={() => setActiveTab('clients')} className={subTabClass('clients')}>Lista de Clientes</button>
                                        <button onClick={() => setActiveTab('new-presale')} className={subTabClass('new-presale')}>Nueva Preventa</button>
                                        <button onClick={() => setActiveTab('client-form')} className={subTabClass('client-form')}>Registrar Cliente</button>
                                        <button onClick={() => setActiveTab('history')} className={subTabClass('history')}>Historial</button>
                                    </>
                                )}
                                {activeSection === 'gerencia-almacen' && (
                                    <>
                                        <button onClick={() => setActiveTab('inventory')} className={subTabClass('inventory')}>Stock de Productos</button>
                                        <button onClick={() => setActiveTab('movements')} className={subTabClass('movements')}>Movimientos de Kárdex</button>
                                        <button onClick={() => setActiveTab('returns')} className={subTabClass('returns')}>Devoluciones</button>
                                    </>
                                )}
                                {activeSection === 'gerencia-distribucion' && (
                                    <>
                                        <button onClick={() => setActiveTab('gerencia-create-routes')} className={subTabClass('gerencia-create-routes')}>Crear ruta</button>
                                        <button onClick={() => setActiveTab('gerencia-logistics')} className={subTabClass('gerencia-logistics')}>Panel Logístico</button>
                                        <button onClick={() => setActiveTab('gerencia-routes')} className={subTabClass('gerencia-routes')}>Monitoreo de Rutas</button>
                                    </>
                                )}
                                {activeSection === 'gerencia-contabilidad' && (
                                    <>
                                        <button onClick={() => { setActiveTab('liquidations'); setSelectedBatch(null) }} className={subTabClass('liquidations')}>Liquidación de Ventas</button>
                                        <button onClick={() => setActiveTab('gerencia-accounting')} className={subTabClass('gerencia-accounting')}>Resumen Financiero</button>
                                        <button onClick={() => setActiveTab('receivables')} className={subTabClass('receivables')}>Cuentas por Cobrar</button>
                                        <button onClick={() => setActiveTab('payables')} className={subTabClass('payables')}>Cuentas por Pagar</button>
                                        <button onClick={() => setActiveTab('payroll')} className={subTabClass('payroll')}>Planilla Sueldos</button>
                                        <button onClick={() => setActiveTab('exchange-rate')} className={subTabClass('exchange-rate')}>Tasa de Cambio</button>
                                        <button onClick={() => setActiveTab('petty-cash')} className={subTabClass('petty-cash')}>Caja Chica</button>
                                    </>
                                )}
                            </div>

                            {/* Renderizado de Componentes Final */}
                            <div className="fade-in transition-opacity duration-300">
                                {activeTab === 'main' && <ReportsDashboard data={stats} />}
                                {activeTab === 'report-product' && <SalesReport />}
                                {activeTab === 'gerencia-audit' && <SecurityAuditLog logs={stats.recientes_logs} />}
                                {activeTab === 'clients' && <ClientTable />}
                                {activeTab === 'new-presale' && <CreatePreSale />}
                                {activeTab === 'client-form' && <ClientForm />}
                                {activeTab === 'history' && <ListPreSale />}
                                {activeTab === 'inventory' && <ProductsList />}
                                {activeTab === 'movements' && <MovementHistory />}
                                {activeTab === 'returns' && <ReturnsManager />}
                                {activeTab === 'gerencia-logistics' && <LogisticsPanel />}
                                {activeTab === 'gerencia-routes' && <RoutesList />}
                                {activeTab === 'gerencia-accounting' && (
                                    <div className="space-y-8">
                                        <FinancialSummary />
                                        <ExpenseManager />
                                    </div>
                                )}
                                {activeTab === 'gerencia-create-routes' && <CreateRoutes/>}
                                {activeTab === 'receivables' && <ReceivablesManager />}
                                {activeTab === 'payables' && <PayablesManager />}
                                {activeTab === 'payroll' && <PayrollManager />}
                                {activeTab === 'exchange-rate' && <ExchangeRateManager />}
                                {activeTab === 'petty-cash' && <PettyCashManager />}
                                {activeTab === 'liquidations' && !selectedBatch && (
                                    <SettlementList onSelectBatch={(id) => { setSelectedBatch(id); setActiveTab('process-settlement'); }} />
                                )}
                                {activeTab === 'process-settlement' && selectedBatch && (
                                    <div className="max-w-md mx-auto py-8">
                                        <CashSettlementForm batchId={selectedBatch} onComplete={() => { setSelectedBatch(null); setActiveTab('liquidations'); }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- RESTO DE ROLES (ALMACEN, VENTAS, CONTABILIDAD, DISTRIBUCION) --- */}

                {user?.role === 'CONTABILIDAD' && (
                    <div className="space-y-6">
                        <FinancialSummary refreshTrigger={activeTab} />
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 flex overflow-x-auto bg-white">
                                <button onClick={() => { setActiveTab('liquidations'); setSelectedBatch(null) }} className={sectionTabClass('liquidations')}>Liquidación de Ventas</button>
                                <button onClick={() => setActiveTab('receivables')} className={sectionTabClass('receivables')}>Cuentas por Cobrar</button>
                                <button onClick={() => setActiveTab('payables')} className={sectionTabClass('payables')}>Cuentas por Pagar</button>
                                <button onClick={() => setActiveTab('payments-history')} className={sectionTabClass('payments-history')}>Pagos Realizados</button>
                                {/* <button onClick={() => setActiveTab('price-rules')} className={sectionTabClass('price-rules')}>Reglas de Precios</button> */}
                                <button onClick={() => setActiveTab('payroll')} className={sectionTabClass('payroll')}>Planilla Sueldos</button>
                                <button onClick={() => setActiveTab('petty-cash')} className={sectionTabClass('petty-cash')}>Caja Chica</button>
                            </div>
                            <div className="p-6">
                                {activeTab === 'liquidations' && !selectedBatch && (
                                    <SettlementList onSelectBatch={(id) => { setSelectedBatch(id); setActiveTab('process-settlement'); }} />
                                )}
                                {activeTab === 'process-settlement' && selectedBatch && (
                                    <div className="max-w-md mx-auto py-8">
                                        <CashSettlementForm batchId={selectedBatch} onComplete={() => { setSelectedBatch(null); setActiveTab('liquidations'); }} />
                                    </div>
                                )}
                                {activeTab === 'receivables' && <ReceivablesManager />}
                                {activeTab === 'payables' && <PayablesManager />}
                                {activeTab === 'payments-history' && <ExpenseManager />}
                                {/* {activeTab === 'price-rules' && <PriceRulesManager />} */}
                                {activeTab === 'payroll' && <PayrollManager />}
                                {activeTab === 'petty-cash' && <PettyCashManager />}
                            </div>
                        </div>
                    </div>
                )}

                {user?.role === 'VENTAS' && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 flex overflow-x-auto bg-white scrollbar-hide">
                            <button onClick={() => setActiveTab('clients')} className={sectionTabClass('clients')}>Lista Clientes</button>
                            <button onClick={() => setActiveTab('new-client')} className={sectionTabClass('new-client')}>Registrar Cliente</button>
                            <button onClick={() => setActiveTab('history')} className={sectionTabClass('history')}>Historial Preventas</button>
                            <button onClick={() => setActiveTab('new-presale')} className={sectionTabClass('new-presale')}>Nueva Preventa</button>
                        </div>
                        <div className="p-6">
                            {activeTab === 'clients' && <ClientTable />}
                            {activeTab === 'new-client' && <ClientForm />}
                            {activeTab === 'history' && <ListPreSale />}
                            {activeTab === 'new-presale' && <CreatePreSale />}
                        </div>
                        <SalesGPSTracker />
                    </div>
                )}

                {user?.role === 'ALMACEN' && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 flex overflow-x-auto bg-white">
                            <button onClick={() => setActiveTab('inventory')} className={sectionTabClass('inventory')}>Inventario</button>
                            <button onClick={() => setActiveTab('movements')} className={sectionTabClass('movements')}>Movimientos</button>
                            <button onClick={() => setActiveTab('pending-presales')} className={sectionTabClass('pending-presales')}>Preventas Pendientes</button>
                            <button onClick={() => setActiveTab('logistics')} className={sectionTabClass('logistics')}>Crear Hojas de Ruta</button>
                            <button onClick={() => setActiveTab('returns')} className={sectionTabClass('returns')}>Devoluciones</button>
                        </div>
                        <div className="p-6">
                            {activeTab === 'inventory' && <ProductsList />}
                            {activeTab === 'movements' && <MovementHistory />}
                            {activeTab === 'pending-presales' && <ListPreSale />}
                            {activeTab === 'logistics' && <LogisticsPanel />}
                            {activeTab === 'returns' && <ReturnsManager />}
                        </div>
                    </div>
                )}

                {user?.role === 'DISTRIBUCION' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Rutas de Entrega</h2>
                            <p className="text-sm text-slate-500">Seleccione una ruta para iniciar el despacho</p>
                        </div>
                        <RoutesList />
                        <GPSTracker />
                    </div>
                )}

            </main>
        </div>
    )
}