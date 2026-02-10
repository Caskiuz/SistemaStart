import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export function LoginForm() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const onChangeInput = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        
        try {
            console.log('🔐 Intentando login con:', formData.email)
            const result = await login(formData.email, formData.password)
            console.log('📊 Resultado login:', result)
            
            if (result.success) {
                console.log('✅ Login exitoso, redirigiendo...')
                navigate("/")
            } else {
                console.error('❌ Login fallido:', result)
                setError(result.message || "Credenciales inválidas. Inténtalo de nuevo.")
            }
        } catch (err) {
            console.error('💥 Error en handleSubmit:', err)
            setError("Error de conexión. Verifica tu internet.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                className="flex flex-col w-full max-w-[450px] p-6 sm:p-8 bg-white shadow-sm border border-gray-200 rounded-xl gap-4 sm:gap-6"
                onSubmit={handleSubmit}
            >
                <div className="text-center border-b pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">SISTEMA STAR</h2>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider mt-1">Iniciar Sesión</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3">
                        <p className="text-red-700 text-sm font-bold">{error}</p>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Correo electrónico</label>
                    <input
                        name="email"
                        className="border border-gray-300 w-full rounded-lg p-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={onChangeInput}
                        autoComplete="email"
                        inputMode="email"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight">Contraseña</label>
                    <input
                        name="password"
                        className="border border-gray-300 w-full rounded-lg p-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={onChangeInput}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-3.5 px-4 rounded-lg transition-all shadow-md active:scale-[0.98] mt-2 text-base min-h-[48px] flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Ingresando...</span>
                        </>
                    ) : (
                        'Ingresar al Sistema'
                    )}
                </button>
            </form>
        </div>
    )
}