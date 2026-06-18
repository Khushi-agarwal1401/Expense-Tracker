import { loadTransactions, saveTransactions } from '../storage/localStorage.js';

export const state = {
    transactions: []
};

export const loadState = () => {
    state.transactions = loadTransactions();
};

export const saveState = () => {
    saveTransactions(state.transactions);
};

export const addTransaction = (description, amount, type, date) => {
    const numericAmount = +amount;
    const signedAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount);
    
    const transaction = {
        id: Date.now().toString(),
        description,
        amount: signedAmount,
        type,
        date: date || new Date().toISOString().split('T')[0]
    };
    state.transactions.push(transaction);
    saveState();
    return transaction;
};

export const deleteTransaction = (id) => {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
};

export const updateTransaction = (id, description, amount, type, date) => {
    const index = state.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        const numericAmount = +amount;
        const signedAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount);
        
        state.transactions[index] = {
            ...state.transactions[index],
            description,
            amount: signedAmount,
            type,
            date: date || state.transactions[index].date
        };
        saveState();
        return state.transactions[index];
    }
    return null;
};

export const getTransaction = (id) => {
    return state.transactions.find(t => t.id === id);
};

export const clearAllTransactions = () => {
    state.transactions = [];
    saveState();
};