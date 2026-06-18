const STORAGE_KEY = 'expense_tracker_transactions';

export const saveTransactions = (transactions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const loadTransactions = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const clearTransactions = () => {
    localStorage.removeItem(STORAGE_KEY);
};