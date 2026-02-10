import { createContext, useContext, useState, useEffect } from 'react';
import { accountingService } from '../features/accounting/services/accountingService';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('USD'); // 'BS' o 'USD' - USD por defecto
    const [exchangeRate, setExchangeRate] = useState(6.96);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadRate();
        }
    }, []);

    const loadRate = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const res = await accountingService.getExchangeRate();
        if (res.success) {
            setExchangeRate(res.data.rate);
        }
    };

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'BS' ? 'USD' : 'BS');
    };

    const convertAmount = (amount, fromCurrency = 'BS') => {
        const numAmount = parseFloat(amount) || 0;
        if (currency === fromCurrency) return numAmount;
        
        if (currency === 'USD' && fromCurrency === 'BS') {
            return numAmount / exchangeRate;
        }
        if (currency === 'BS' && fromCurrency === 'USD') {
            return numAmount * exchangeRate;
        }
        return numAmount;
    };

    const formatAmount = (amount, fromCurrency = 'BS') => {
        if (amount === null || amount === undefined || amount === '') {
            return currency === 'BS' ? 'Bs. 0.00' : '$ 0.00';
        }
        const converted = convertAmount(amount, fromCurrency);
        const symbol = currency === 'BS' ? 'Bs.' : '$';
        return `${symbol} ${converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ 
            currency, 
            exchangeRate, 
            toggleCurrency, 
            convertAmount, 
            formatAmount,
            refreshRate: loadRate
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency debe usarse dentro de CurrencyProvider');
    }
    return context;
};
