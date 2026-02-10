import api from '../../../api/axios.js';

export const productService = {
    getProducts: async () => {
        try {
            const response = await api.get('inventory/products/')

            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    getSalesReport: async (startDate, endDate) => {
        try {
            const response = await api.get('inventory/movements/report/', {
                params: { 
                    start_date: startDate, 
                    end_date: endDate 
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || "Error al generar reporte" 
            };
        }
    },

    updateProduct: async (id, formData) => {
        try {
            const res = await api.patch(`inventory/products/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },

    getCategories: async () => {
        try {
            const response = await api.get('inventory/categories/');
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || "Error al cargar categorías"
            };
        }
    },

    createCategory: async (categoryName) => {
        try {
            const response = await api.post('inventory/categories/', { name: categoryName });
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || "Error al crear categoría"
            };
        }
    },

    createProduct: async (productData) => {
        try {
            const response = await api.post('inventory/products/', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || "Error al registrar el producto"
            };
        }
    },

    registerMovement: async (movementData) => {
        try {
            const response = await api.post('inventory/movements/', movementData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || "Error al registrar el movimiento"
            };
        }
    },

    getMovements: async () => {
        try {
            const res = await api.get('/inventory/movements/');
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data };
        }
    },
}

