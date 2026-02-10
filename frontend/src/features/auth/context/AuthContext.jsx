import { useContext, createContext, useState, Children, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])

    const register = async (credentials) => {
        const result = await authService.register(credentials)

        return result
    }   

    const login = async (email, password) => {
        const credentials = { email: email, password: password };
        const result = await authService.login(credentials)

        if (result.success) {
            const userData = result.data.user

            setUser(userData)

            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('token', result.data.access)
        }

        return result
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    const value = {
        user,
        register,
        login,
        logout,
        loading
    }

    return (
        <AuthContext.Provider
            value={value}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context
}

