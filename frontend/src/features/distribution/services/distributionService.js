import api from "../../../api/axios";

export const distributionService = {
    createRoute: async (routeData) => {
        try {
            const response = await api.post('/distribution/batches/manage_routes/', routeData);
            return response.data;
        } catch (error) {
            console.error("Error al crear ruta:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al conectar con el servidor"
            };
        }
    },

    getMyRoute: async () => {
        try {
            const res = await api.get('/distribution/batches/my_route/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    updateStatus: async (batchId, presaleId, status, returned_items = [], reprogram_date = null, reprogram_reason = null, justification = null) => {
        try {
            const res = await api.post(`/distribution/batches/${batchId}/update_delivery_status/`, {
                presale_id: presaleId,
                status: status,
                returned_items: returned_items,
                reprogram_date: reprogram_date,
                reprogram_reason: reprogram_reason,
                justification: justification
            });
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, data: error.response?.data, error: error.response?.data };
        }
    },

    getAllRoutes: async () => {
        try {
            const response = await api.get('distribution/batches/all_active_routes/');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: "Error al cargar rutas" };
        }
    },

    getMetadata: async () => {
        try {
            const res = await api.get('/distribution/batches/metadata/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    getPendingPreSales: async () => {
        try {
            const res = await api.get('/sales/presales/?status=PENDIENTE');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    createRouteSheet: async (data) => {
        try {
            const res = await api.post('/distribution/batches/create_route_sheet/', data);
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    getPendingReturns: async () => {
        try {
            const res = await api.get('/distribution/batches/pending_returns/');
            return { success: true, data: res.data.data };
        } catch (e) {
            return { success: false, message: "Error al conectar con el servidor" };
        }
    },

    confirmReturn: async (assignmentId) => {
        try {
            const res = await api.post(`/distribution/batches/${assignmentId}/confirm_return/`);
            return { success: true, data: res.data };
        } catch (e) {
            return { success: false, message: "Error al procesar el reingreso" };
        }
    },

    // GPS Real - Enviar ubicación desde el móvil del distribuidor
    updateGPSLocation: async (latitude, longitude) => {
        try {
            const res = await api.post('/distribution/batches/update_gps_location/', {
                latitude,
                longitude
            });
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    // GPS Real - Obtener todas las ubicaciones (solo gerencia)
    getAllGPSLocations: async () => {
        try {
            const res = await api.get('/distribution/batches/get_all_gps_locations/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    // Delivery Tracking - Update intermediate state
    updateDeliveryState: async (batchId, deliveryId, state, notes = '') => {
        try {
            const res = await api.post(`/distribution/batches/${batchId}/update_delivery_state/`, {
                delivery_id: deliveryId,
                state: state,
                notes: notes
            });
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    // Get delivery timeline
    getDeliveryTimeline: async (deliveryId) => {
        try {
            const res = await api.get(`/distribution/batches/${deliveryId}/delivery_timeline/`);
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    // Get batch progress
    getBatchProgress: async () => {
        try {
            const res = await api.get('/distribution/batches/batch_progress/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    // Get distributor history
    getMyHistory: async () => {
        try {
            const res = await api.get('/distribution/batches/my_history/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    }
};