import { loadState, addTransaction, updateTransaction, deleteTransaction, getTransaction, clearAllTransactions, state } from './state/transactions.js';
import { renderAll, renderTransactions, renderOverview } from './render.js';

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
const clearAllBtn = document.getElementById('clear-all-trigger');
const exportExcelBtn = document.getElementById('export-excel-btn');

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
};

const setTheme = (theme) => {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
};

themeToggle?.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Initialize theme
loadTheme();

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
        const input = element.closest('.form-group')?.querySelector('input, select');
        input?.classList?.add('input-invalid');
    } else {
        element.classList.remove('show');
        element.closest('.form-group')?.querySelector('input, select')?.classList?.remove('input-invalid');
    }
};

const validateForm = () => {
    const description = descriptionInput.value.trim();
    const amountStr = amountInput.value.trim();
    
    let isValid = true;
    
    if (description === '') {
        showError(textError, true, 'Please enter a description');
        isValid = false;
    } else {
        showError(textError, false, '');
    }
    
    const amountNum = parseFloat(amountStr);
    if (amountStr === '' || isNaN(amountNum)) {
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
    const amount = parseFloat(amountInput.value) || 0;
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

window.enterEditMode = (id) => {
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

const escapeCsvValue = (value) => {
    const stringValue = String(value ?? '');
    if (/[",\n\r]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

const getExportFileName = () => {
    const today = new Date().toISOString().split('T')[0];
    return `transactions-${today}.csv`;
};

const exportTransactionsToExcel = () => {
    if (state.transactions.length === 0) {
        showToast('No transactions to export');
        return;
    }

    openModal('export-modal');
};

const downloadTransactionsToExcel = () => {
    const rows = [
        ['Date', 'Description', 'Type', 'Amount'],
        ...state.transactions.map(transaction => [
            transaction.date,
            transaction.description,
            transaction.type,
            transaction.amount
        ])
    ];

    const csvContent = rows
        .map(row => row.map(escapeCsvValue).join(','))
        .join('\r\n');

    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getExportFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    closeModal('export-modal');
    showToast('Transactions exported to Excel');
};

const showToast = (message) => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
};

// Modal handling
const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal?.classList.remove('hidden');
};

const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal?.classList.add('hidden');
};

// Clear all modal handler
const confirmClearBtn = document.getElementById('confirm-clear-btn');

clearAllBtn?.addEventListener('click', () => {
    openModal('clear-all-modal');
});

confirmClearBtn?.addEventListener('click', () => {
    clearAllTransactions();
    window.allTransactions = [];
    window.filteredTransactions = [];
    renderAll();
    closeModal('clear-all-modal');
});

const confirmExportBtn = document.getElementById('confirm-export-btn');

confirmExportBtn?.addEventListener('click', () => {
    downloadTransactionsToExcel();
});

// Delete transaction with modal
let pendingDeleteId = null;
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const allCancelBtns = document.querySelectorAll('.modal-cancel');

window.deleteTransaction = (id) => {
    pendingDeleteId = id;
    openModal('delete-modal');
};

confirmDeleteBtn?.addEventListener('click', () => {
    if (pendingDeleteId) {
        deleteTransaction(pendingDeleteId);
        window.allTransactions = [...state.transactions];
        window.filteredTransactions = [...state.transactions];
        renderAll();
    }
    closeModal('delete-modal');
    pendingDeleteId = null;
});

// Close all modals when clicking cancel
allCancelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.add('hidden');
        });
        pendingDeleteId = null;
    });
});

// Event Listeners
form?.addEventListener('submit', handleFormSubmit);
resetBtn?.addEventListener('click', clearForm);
cancelEditBtn?.addEventListener('click', exitEditMode);
exportExcelBtn?.addEventListener('click', exportTransactionsToExcel);

// Boot
init();