import { loadState } from './state/transactions.js';
import { initFormHandlers, enterEditMode } from './ui/formHandler.js';
import { renderAll } from './ui/render.js';
import { state } from './state/transactions.js';

// Store for filtering
window.allTransactions = [];
window.filteredTransactions = [];

// Initialize
const init = () => {
    loadState();
    window.allTransactions = [...state.transactions];
    window.filteredTransactions = [...state.transactions];
    renderAll();
};

// Expose for formHandler
window.appEditTransaction = enterEditMode;
window.appDeleteTransaction = (id) => {
    import('./state/transactions.js').then(module => {
        module.deleteTransaction(id);
        window.allTransactions = [...state.transactions];
        window.filteredTransactions = [...state.transactions];
        renderAll();
    });
};

// Initialize form handlers
initFormHandlers();

// Boot application
init();