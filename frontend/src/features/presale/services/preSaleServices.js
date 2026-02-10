import api from "../../../api/axios";

export const preSaleService = {
    getDashboardStats: async () => {
        try {
            const response = await api.get('sales/presales/dashboard_stats/');
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error en service stats:", error);
            return { 
                success: false, 
                error: "No se pudieron obtener las estadísticas gerenciales" 
            };
        }
    },

    createPreSale: async (preSaleData) => {
        try {
            const response = await api.post('sales/presales/', preSaleData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Error al procesar la preventa"
            };
        }
    },

    getPreSales: async () => {
        try {
            const response = await api.get('sales/presales/');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: "No se pudo cargar el historial" };
        }
    },

    getPDFBlob: async (id) => {
        try {
            const response = await api.get(`sales/presales/${id}/generate_pdf/`, {
                responseType: 'blob'
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: "Error al obtener el archivo" };
        }
    },

    downloadPDF: async (id) => {
        try {
            const response = await api.get(`sales/presales/${id}/generate_pdf/`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Nota_Venta_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            return { success: false, error: "No se pudo descargar el PDF" };
        }
    },

    confirmPresale: async (id) => {
        try {
            const response = await api.post(`sales/presales/${id}/confirm_presale/`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error al confirmar la preventa"
            };
        }
    }
};