const STORAGE_KEY = 'expense_tracker_transactions';

export const state = {
    transactions: []
};

// Load transactions from localStorage
export const loadState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        state.transactions = JSON.parse(stored);
    }
};

// Save transactions to localStorage
export const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
};

// Create a new transaction
export const addTransaction = (text, amount) => {
    const transaction = {
        id: generateID(),
        text,
        amount: +amount // convert to number
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

// Update an existing transaction
export const updateTransaction = (id, text, amount) => {
    const index = state.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        state.transactions[index].text = text;
        state.transactions[index].amount = +amount;
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
