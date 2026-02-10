import api from "../../../api/axios";

export const salesGPSService = {
    // Vendedor envía su ubicación
    updateLocation: async (latitude, longitude) => {
        try {
            const res = await api.post('/users/sales-gps/update/', {
                latitude,
                longitude
            });
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    // Gerencia obtiene todas las ubicaciones de vendedores
    getAllLocations: async () => {
        try {
            const res = await api.get('/users/sales-gps/all/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    }
};
