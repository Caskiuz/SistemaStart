import api from "../../../api/axios";

export const accountingService = {
    // --- LIQUIDACIÓN DE RUTAS ---
    getPendingSettlements: async () => {
        const response = await api.get('/accounting/pending_settlements/');
        return response.data;
    },

    getBatchSummary: async (batchId) => {
        const response = await api.get(`/accounting/${batchId}/batch_summary/`);
        return response.data;
    },

    finalizeSettlement: async (batchId, data) => {
        const response = await api.post(`/accounting/${batchId}/finalize_settlement/`, data);
        return response.data;
    },

    // --- REPORTES Y BALANCE ---
    getFinancialStatement: async () => {
        const response = await api.get('/accounting/financial_statement/');
        return response.data;
    },

    getCashReport: async () => {
        const response = await api.get('/accounting/cash_report/');
        return response.data;
    },

    getBalanceReport: async () => {
        const response = await api.get('/accounting/balance_report/');
        return response.data;
    },

    // --- EGRESOS (GASTOS) ---
    getExpenses: async () => {
        const response = await api.get('/accounting/expenses/');
        return response.data;
    },

    createExpense: async (expenseData) => {
        const response = await api.post('/accounting/expenses/', expenseData);
        return response.data;
    },

    // --- CUENTAS POR COBRAR (CLIENTES) ---
    getDebts: async () => {
        const response = await api.get('/accounting/accounts-receivable/');
        return response.data;
    },

    payDebt: async (debtId, amount) => {
        const response = await api.post(`/accounting/accounts-receivable/${debtId}/register_payment/`, { amount });
        return response.data;
    },

    // --- CUENTAS POR PAGAR (PROVEEDORES) ---
    getPayables: async () => {
        const response = await api.get('/accounting/accounts-payable/');
        return response.data;
    },

    createPayable: async (payableData) => {
        const response = await api.post('/accounting/accounts-payable/', payableData);
        return response.data;
    },

    payProvider: async (payableId, amount) => {
        const response = await api.post(`/accounting/${payableId}/pay-provider/`, {
            amount: parseFloat(amount)
        });
        return response.data;
    },

    // --- GESTIÓN DE PERSONAL Y NÓMINA ---
    getEmployees: async () => {
        const response = await api.get('/accounting/employees/');
        return response.data;
    },

    getSystemUsers: async () => {
        const response = await api.get('/accounting/system_users/');
        return response.data;
    },

    updateSalary: async (userId, newSalary) => {
        const response = await api.patch(`/accounting/${userId}/update_salary/`, {
            base_salary: newSalary
        });
        return response.data;
    },

    processPayroll: async (payrollData) => {
        const response = await api.post('/accounting/process_payroll/', payrollData);
        return response.data;
    },

    // // --- REGLAS DE PRECIOS ---
    // getPriceRules: async () => {
    //     const response = await api.get('/accounting/price-rules/');
    //     return response.data;
    // },

    // updatePriceRule: async (ruleId, data) => {
    //     const response = await api.patch(`/accounting/${ruleId}/update-price-rule/`, data);
    //     return response.data;
    // },

    // createPriceRule: async (ruleData) => {
    //     const response = await api.post('/accounting/price-rules/', ruleData);
    //     return response.data;
    // },

    // --- TASA DE CAMBIO ---
    getExchangeRate: async () => {
        try {
            const response = await api.get('/accounting/exchange-rate/');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    setExchangeRate: async (rate) => {
        try {
            const response = await api.post('/accounting/set-exchange-rate/', { rate });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};