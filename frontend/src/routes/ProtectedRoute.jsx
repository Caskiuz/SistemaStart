import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

export function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation(); // Obtenemos la ruta actual

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                Verificando Credenciales...
            </div>
        </div>
    );

    // 1. Si no hay usuario, al login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. PROTECCIÓN ESPECIAL: Solo GERENCIA puede entrar a /register
    if (location.pathname === '/register' && user.role !== 'GERENCIA') {
        console.warn(`Intento de acceso no autorizado a registro por: ${user.username}`);
        return <Navigate to="/" replace />; // O a /unauthorized
    }

    // 3. Validación de roles específicos definidos en la ruta
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}