const STORAGE_KEY = 'expense_tracker_transactions';

export const state = {
    transactions: [],
    theme: 'light'
};

// Load transactions from localStorage
export const loadState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        state.transactions = JSON.parse(stored);
    }
    const theme = localStorage.getItem('expense_tracker_theme');
    if (theme) {
        state.theme = theme;
    }
};

// Save transactions to localStorage
export const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
};

export const saveTheme = () => {
    localStorage.setItem('expense_tracker_theme', state.theme);
};

// Create a new transaction
export const addTransaction = (text, amount, type, date) => {
    const transaction = {
        id: generateID(),
        text,
        amount: Math.abs(+amount), // store absolute
        type, // 'income' or 'expense'
        date: date || new Date().toISOString().split('T')[0]
    };
    state.transactions.push(transaction);
    saveState();
    return transaction;
};

// Delete a transaction by ID
export const deleteTransaction = (id) => {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
};

export const clearAllTransactions = () => {
    state.transactions = [];
    saveState();
};

// Update an existing transaction
export const updateTransaction = (id, text, amount, type, date) => {
    const index = state.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        state.transactions[index].text = text;
        state.transactions[index].amount = Math.abs(+amount);
        state.transactions[index].type = type;
        state.transactions[index].date = date || new Date().toISOString().split('T')[0];
        saveState();
    }
};

// Get transaction by id
export const getTransaction = (id) => {
    return state.transactions.find(t => t.id === id);
};

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000).toString();
}
