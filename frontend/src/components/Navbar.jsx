import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../features/auth/context/AuthContext"
import { useCurrency } from "../context/CurrencyContext"
import { useState } from "react"

export function Navbar() {
    const { logout, user } = useAuth()
    const { currency, toggleCurrency, exchangeRate } = useCurrency()
    const navigate = useNavigate()
    const [logoVariant, setLogoVariant] = useState(0)

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    const cycleLogo = () => {
        setLogoVariant((prev) => (prev + 1) % 3)
    }

    const logos = [
        // Logo 1: G simple + Estrella separada
        <svg viewBox="0 0 120 120" className="w-full h-full cursor-pointer transition-transform hover:scale-110">
            <defs>
                <linearGradient id="starBrand1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#A52A2A', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#8B4513', stopOpacity:1}} />
                </linearGradient>
            </defs>
            {/* G construida con path para que se vea claramente */}
            <path d="M 61 45 A 16 16 0 1 0 45 61 L 45 55 L 55 55 L 55 50 L 50 50 L 50 45" 
                  fill="none" stroke="url(#starBrand1)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Estrella más grande */}
            <polygon points="78,30 82,40 92,40 85,46 88,56 78,50 68,56 71,46 64,40 74,40" 
                     fill="url(#starBrand1)"/>
            <text x="60" y="85" fontSize="14" fontWeight="900" fill="url(#starBrand1)" textAnchor="middle" fontFamily="Arial">STAR</text>
        </svg>,
        
        // Logo 2: G + Estrella en marco
        <svg viewBox="0 0 120 120" className="w-full h-full cursor-pointer transition-transform hover:rotate-6">
            <rect x="10" y="10" width="100" height="100" rx="20" fill="#2D1B1B" stroke="#A52A2A" strokeWidth="3"/>
            {/* G corregida para que no parezca C */}
            <circle cx="40" cy="40" r="14" fill="none" stroke="#A52A2A" strokeWidth="5" 
                    strokeDasharray="0 22 44 22"/>
            <line x1="40" y1="40" x2="52" y2="40" stroke="#A52A2A" strokeWidth="5" strokeLinecap="round"/>
            <line x1="52" y1="40" x2="52" y2="50" stroke="#A52A2A" strokeWidth="5" strokeLinecap="round"/>
            {/* Estrella más grande */}
            <polygon points="75,28 79,38 89,38 82,44 85,54 75,48 65,54 68,44 61,38 71,38" 
                     fill="#A52A2A"/>
            <text x="60" y="75" fontSize="12" fontWeight="700" fill="#A52A2A" textAnchor="middle" fontFamily="Arial">STAR</text>
        </svg>,
        
        // Logo 3: G + Estrella premium
        <svg viewBox="0 0 120 120" className="w-full h-full cursor-pointer transition-all hover:scale-110">
            <defs>
                <linearGradient id="starBrand3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#CD853F', stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:'#A52A2A', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#8B4513', stopOpacity:1}} />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
                </filter>
            </defs>
            <circle cx="60" cy="50" r="32" fill="url(#starBrand3)" filter="url(#shadow)"/>
            {/* G blanca clara */}
            <circle cx="50" cy="42" r="12" fill="none" stroke="white" strokeWidth="4" 
                    strokeDasharray="0 19 38 19"/>
            <line x1="50" y1="42" x2="60" y2="42" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <line x1="60" y1="42" x2="60" y2="48" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            {/* Estrella blanca más grande */}
            <polygon points="75,30 79,40 89,40 82,46 85,56 75,50 65,56 68,46 61,40 71,40" 
                     fill="white"/>
            <text x="60" y="85" fontSize="12" fontWeight="900" fill="url(#starBrand3)" textAnchor="middle" fontFamily="Arial">STAR</text>
        </svg>
    ]

    return (
        <nav className="w-full bg-amber-950 text-white shadow-lg border-b border-amber-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 px-4 sm:px-8 gap-3 sm:gap-0">
                
                {/* Logo y Nombre - Minimalista */}
                <Link to="/" className="flex items-center gap-2 sm:gap-4 transition-opacity hover:opacity-90">
                    <div onClick={(e) => { e.preventDefault(); cycleLogo(); }} className="bg-amber-50 p-1 rounded-xl shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        {logos[logoVariant]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-black tracking-[0.15em] uppercase leading-none">Star</span>
                        <span className="text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase tracking-tighter">Santa Cruz - Bolivia</span>
                    </div>
                </Link>

                {/* Acciones Globales */}
                <div className="flex items-center gap-2 sm:gap-6 flex-wrap justify-center">
                    {/* Toggle de Moneda */}
                    <button
                        onClick={toggleCurrency}
                        className="flex items-center gap-1 sm:gap-2 bg-amber-900 hover:bg-amber-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all border border-amber-700"
                        title={`Tasa: ${exchangeRate} Bs/USD`}
                    >
                        <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase">Moneda:</span>
                        <span className="text-xs sm:text-sm font-black text-white">{currency}</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                    </button>
                    
                    {(user?.role === 'GERENCIA' || user?.role === 'ALMACEN') && (
                        <>
                            <Link to='/gps' className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-300 hover:text-amber-100 transition-colors">
                                📍 GPS
                            </Link>
                        </>
                    )}
                    
                    {user?.role === 'GERENCIA' && (
                        <Link to='/register' className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-200 hover:text-white transition-colors">
                            Admin
                        </Link>
                    )}
                    
                    <button
                        className="bg-red-900/20 hover:bg-red-900/30 text-red-300 text-[9px] sm:text-[10px] font-black uppercase tracking-widest py-1.5 sm:py-2 px-3 sm:px-5 border border-red-800/30 rounded-full transition-all"
                        onClick={handleLogout}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    )
}