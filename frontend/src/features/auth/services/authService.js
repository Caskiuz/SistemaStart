import api from "../../../api/axios";

export const authService = {
    login: async (credentials) => {
        try {
            console.log('🔐 authService.login - Enviando:', credentials);
            const response = await api.post('/users/login/', credentials)
            console.log('✅ authService.login - Respuesta:', response.data);

            return {
                success: true,
                data: response.data
            }

        } catch (error) {
            console.error("❌ Error en inicio de sesion:", error.response?.data || error.message);
            console.error("📊 Status:", error.response?.status);
            console.error("📊 Headers:", error.response?.headers);

            return {
                success: false,
                errors: error.response?.data?.detail || error.response?.data?.error,
                message: error.response?.data?.detail || 'No se pudo completar el inicio de sesion del usuario.'
            }
        }
    },

    register: async (credentials) => {
        try {
            const response = await api.post('users/register/', credentials)
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return {
                success: false,
                errors: error.response?.data || "Error en el registro"
            }
        }
    }
}