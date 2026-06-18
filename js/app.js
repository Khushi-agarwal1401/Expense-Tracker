import { loadState, addTransaction, updateTransaction, deleteTransaction, getTransaction, clearAllTransactions, state } from './state/transactions.js';
import { renderAll, renderTransactions } from './render.js';

// DOM Elements
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const dateInput = document.getElementById('date');
const editIdInput = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const textError = document.getElementById('text-error');
const amountError = document.getElementById('amount-error');

// Initialize
const init = () => {
    loadState();
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    window.allTransactions = [...state.transactions];
    window.filteredTransactions = [...state.transactions];
    renderAll();
};

const showError = (element, show, message) => {
    if (show) {
        element.textContent = message;
        element.classList.add('show');
        const input = element.previousElementSibling;
        input?.classList?.add('input-invalid');
    } else {
        element.classList.remove('show');
        element.previousElementSibling?.classList?.remove('input-invalid');
    }
};

const validateForm = () => {
    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    
    let isValid = true;
    
    if (description === '') {
        showError(textError, true, 'Please enter a description');
        isValid = false;
    } else {
        showError(textError, false, '');
    }
    
    if (amount === '' || isNaN(parseFloat(amount))) {
        showError(amountError, true, 'Please enter a valid amount');
        isValid = false;
    } else {
        showError(amountError, false, '');
    }
    
    return isValid;
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const description = descriptionInput.value.trim();
    const amount = +amountInput.value;
    const type = typeInput.value;
    const date = dateInput.value || new Date().toISOString().split('T')[0];
    
    const editId = editIdInput.value;
    
    if (editId) {
        updateTransaction(editId, description, amount, type, date);
        exitEditMode();
    } else {
        addTransaction(description, amount, type, date);
    }
    
    clearForm();
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    window.allTransactions = [...state.transactions];
    window.filteredTransactions = [...state.transactions];
    renderAll();
};

const clearForm = () => {
    descriptionInput.value = '';
    amountInput.value = '';
    typeInput.value = 'expense';
};

const exitEditMode = () => {
    clearForm();
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    editIdInput.value = '';
    formTitle.innerText = 'Add Transaction';
    submitBtn.innerText = 'Add Transaction';
    cancelEditBtn.classList.add('hidden');
};

export const enterEditMode = (id) => {
    const transaction = getTransaction(id);
    if (!transaction) return;
    
    editIdInput.value = transaction.id;
    descriptionInput.value = transaction.description;
    amountInput.value = Math.abs(transaction.amount);
    typeInput.value = transaction.type;
    dateInput.value = transaction.date;
    
    formTitle.innerText = 'Edit Transaction';
    submitBtn.innerText = 'Update Transaction';
    cancelEditBtn.classList.remove('hidden');
    
    document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
};

// Search handler
const searchInput = document.getElementById('search-input');
searchInput?.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const source = window.filteredTransactions?.length 
        ? window.filteredTransactions 
        : state.transactions;
    const filtered = source.filter(t => 
        t.description.toLowerCase().includes(keyword)
    );
    renderTransactions(filtered);
});

// Filter handler
const filterSelect = document.getElementById('filter-select');
filterSelect?.addEventListener('change', (e) => {
    const filter = e.target.value;
    let filtered = [...state.transactions];
    
    if (filter === 'income') {
        filtered = filtered.filter(t => t.type === 'income');
    } else if (filter === 'expense') {
        filtered = filtered.filter(t => t.type === 'expense');
    }
    
    window.filteredTransactions = filtered;
    renderTransactions(filtered);
});

// Sort handler
const sortSelect = document.getElementById('sort-select');
sortSelect?.addEventListener('change', (e) => {
    const sortValue = e.target.value;
    const source = window.filteredTransactions?.length 
        ? window.filteredTransactions 
        : [...state.transactions];
    const sorted = [...source].sort((a, b) => {
        switch (sortValue) {
            case 'highest':
                return Math.abs(b.amount) - Math.abs(a.amount);
            case 'lowest':
                return Math.abs(a.amount) - Math.abs(b.amount);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'latest':
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    renderTransactions(sorted);
});

// Clear all handler
const clearAllBtn = document.getElementById('clear-all-trigger');
clearAllBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all transactions? This cannot be undone.')) {
        clearAllTransactions();
        window.allTransactions = [];
        window.filteredTransactions = [];
        renderAll();
    }
});

// Expose for inline handlers
window.enterEditMode = enterEditMode;
window.deleteTransaction = (id) => {
    deleteTransaction(id);
    window.allTransactions = [...state.transactions];
    window.filteredTransactions = [...state.transactions];
    renderAll();
};

// Event Listeners
form?.addEventListener('submit', handleFormSubmit);
resetBtn?.addEventListener('click', clearForm);
cancelEditBtn?.addEventListener('click', exitEditMode);

// Boot
init();