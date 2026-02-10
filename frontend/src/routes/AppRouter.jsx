import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginForm } from "../features/auth/components/LoginForm"
import { RegisterForm } from "../features/auth/components/RegisterForm"
import { Dashboard } from "../pages/Dashboard"
import { Unauthorized } from "../components/Unauthorized"
import { ProtectedRoute } from "./ProtectedRoute"
import { ClientForm } from "../features/sales/components/ClientForm"
import { ProductsList } from "../features/products/components/ProductsList"
import { MainLayout } from "../layouts/MainLayout"
import { CreatePreSale } from "../features/presale/components/CreatePreSale"
import { GPSMonitoring } from "../features/distribution/components/GPSMonitoring"
import { ClientVisitHistory } from "../features/sales/components/ClientVisitHistory"

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. RUTAS PÚBLICAS: Acceso total sin login */}
                <Route path='/login' element={<LoginForm />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* 2. RUTAS PROTEGIDAS BAJO LAYOUT PRINCIPAL */}
                <Route element={<MainLayout />}>
                    
                    {/* A. Acceso para CUALQUIER usuario autenticado */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/client" element={<ClientForm />} />
                        <Route path="/products" element={<ProductsList />} />
                        <Route path="/pre_venta" element={<CreatePreSale />} />
                        <Route path="/clients/:clientId/history" element={<ClientVisitHistory />} />
                    </Route>

                    {/* B. Acceso para GERENCIA y ALMACEN */}
                    <Route element={<ProtectedRoute allowedRoles={['GERENCIA', 'ALMACEN']} />}>
                        <Route path='/gps' element={<GPSMonitoring />} />
                    </Route>

                    {/* C. Acceso EXCLUSIVO para GERENCIA */}
                    <Route element={<ProtectedRoute allowedRoles={['GERENCIA']} />}>
                        <Route path='/register' element={<RegisterForm />} />
                    </Route>

                </Route>

                {/* 3. REDIRECCIÓN POR DEFECTO: Si la ruta no existe */}
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}