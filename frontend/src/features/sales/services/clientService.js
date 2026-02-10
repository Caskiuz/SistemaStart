import api from "../../../api/axios"

export const clientService = {
    createClient: async (credentials) => {
        try {
            const response = await api.post('sales/clients/', credentials, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                errors: error.response?.data || "Error al conectar con el servidor"
            };
        }
    },

    getClients: async () => {
        try {
            const response = await api.get('sales/clients/');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                errors: error.response?.data || "Error al obtener clientes"
            };
        }
    },

    downloadExcelReport: async (start, end) => {
        try {
            const response = await api.get(`/sales/presales/export_excel_report/`, {
                params: { start, end },
                responseType: 'blob', 
            });

            // 1. Crear un objeto URL a partir del Blob recibido
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);

            // 2. Crear un elemento <a> invisible para disparar la descarga
            const link = document.createElement('a');
            link.href = url;

            // Nombre del archivo sugerido
            link.setAttribute('download', `Reporte_Ventas_${start}_al_${end}.xlsx`);

            // 3. Simular el click y limpiar
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url); // Liberar memoria

            return { success: true };
        } catch (error) {
            console.error("Error detallado en la descarga:", error);
            return {
                success: false,
                error: error.response?.data || "Error al generar el archivo"
            };
        }
    },

    getVisitHistory: async (clientId) => {
        try {
            const response = await api.get(`sales/clients/${clientId}/visit_history/`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || "Error al obtener historial"
            };
        }
    }
}