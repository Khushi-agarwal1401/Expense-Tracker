import { addTransaction, updateTransaction, getTransaction, clearAllTransactions, state } from '../state/transactions.js';
import { validateTransaction } from '../utils/validators.js';
import { renderAll, renderTransactions } from './render.js';

const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const editIdInput = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('[data-filter]');
const sortSelect = document.getElementById('sort-select');
const descriptionError = document.getElementById('text-error');
const amountError = document.getElementById('amount-error');

const showError = (element, show, message) => {
    if (show) {
        element.textContent = message;
        element.classList.add('show');
        element.previousElementSibling?.classList?.add('input-invalid');
    } else {
        element.classList.remove('show');
        element.previousElementSibling?.classList?.remove('input-invalid');
    }
};

const validateForm = () => {
    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    const type = typeInput.value;
    
    const { isValid, errors } = validateTransaction(description, amount, type);
    
    showError(descriptionError, !!errors.description, errors.description || '');
    showError(amountError, !!errors.amount, errors.amount || '');
    
    return isValid;
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    const type = typeInput.value;
    
    const editId = editIdInput.value;
    
    if (editId) {
        updateTransaction(editId, description, amount, type);
        exitEditMode();
    } else {
        addTransaction(description, +amount, type);
    }
    
    clearForm();
    // Sync global arrays from state
    window.allTransactions = [...state.transactions];
    window.filteredTransactions = [...state.transactions];
    renderAll();
};

const clearForm = () => {
    descriptionInput.value = '';
    amountInput.value = '';
    typeInput.value = 'income';
    
    showError(descriptionError, false, '');
    showError(amountError, false, '');
};

const enterEditMode = (id) => {
    const transaction = getTransaction(id);
    if (!transaction) return;
    
    editIdInput.value = transaction.id;
    descriptionInput.value = transaction.description;
    amountInput.value = Math.abs(transaction.amount);
    typeInput.value = transaction.type;
    
    formTitle.innerText = 'Edit Transaction';
    submitBtn.innerText = 'Update Transaction';
    cancelBtn.classList.remove('hidden');
    
    document.querySelector('.add-transaction')?.scrollIntoView({ behavior: 'smooth' });
    descriptionInput.focus();
};

const exitEditMode = () => {
    editIdInput.value = '';
    clearForm();
    formTitle.innerText = 'Add Transaction';
    submitBtn.innerText = 'Add Transaction';
    cancelBtn.classList.add('hidden');
};

const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = window.filteredTransactions?.filter(t => 
        t.description.toLowerCase().includes(keyword)
    ) || [];
    renderTransactions(filtered);
};

const handleFilter = (e) => {
    const filter = e.target.dataset.filter;
    let filtered = [...window.allTransactions];
    
    if (filter === 'income') {
        filtered = filtered.filter(t => t.type === 'income');
    } else if (filter === 'expense') {
        filtered = filtered.filter(t => t.type === 'expense');
    }
    
    window.filteredTransactions = filtered;
    renderAll(filtered);
};

const handleSort = (e) => {
    const sortValue = e.target.value;
    const sorted = [...window.allTransactions].sort((a, b) => {
        switch (sortValue) {
            case 'amount-asc':
                return a.amount - b.amount;
            case 'amount-desc':
                return b.amount - a.amount;
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            default:
                return 0;
        }
    });
    renderAll(sorted);
};

const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
        clearAllTransactions();
        exitEditMode();
        window.allTransactions = [];
        window.filteredTransactions = [];
        renderAll();
    }
};

export const initFormHandlers = () => {
    form?.addEventListener('submit', handleFormSubmit);
    cancelBtn?.addEventListener('click', exitEditMode);
    clearAllBtn?.addEventListener('click', handleClearAll);
    searchInput?.addEventListener('input', handleSearch);
    filterButtons.forEach(btn => btn.addEventListener('click', handleFilter));
    sortSelect?.addEventListener('change', handleSort);
    
    // Real-time validation feedback
    descriptionInput?.addEventListener('input', () => {
        if (descriptionInput.value.trim() !== '') {
            showError(descriptionError, false, '');
        }
    });
    
    amountInput?.addEventListener('input', () => {
        if (amountInput.value.trim() !== '' && !isNaN(parseFloat(amountInput.value))) {
            showError(amountError, false, '');
        }
    });
};

export { enterEditMode };