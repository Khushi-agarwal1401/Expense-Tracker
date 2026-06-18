import { state, loadState, saveTheme, addTransaction, deleteTransaction, clearAllTransactions, updateTransaction, getTransaction } from './state.js';
import { renderAll } from './render.js';

// Form Elements
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const dateInput = document.getElementById('date');
const editIdInput = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Error Elements
const textError = document.getElementById('text-error');
const amountError = document.getElementById('amount-error');

// Toolbar Elements
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');

// Modal Elements
const deleteModal = document.getElementById('delete-modal');
const clearAllModal = document.getElementById('clear-all-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const confirmClearBtn = document.getElementById('confirm-clear-btn');
const clearAllTrigger = document.getElementById('clear-all-trigger');
const modalCancelBtns = document.querySelectorAll('.modal-cancel');

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');

// Empty State Add Btn
const emptyAddBtn = document.getElementById('empty-add-btn');

// Toast
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

let itemToDeleteId = null;

// Initialize Application
const init = () => {
    loadState();
    
    // Apply Theme
    if (state.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // Set Default Date
    dateInput.value = new Date().toISOString().split('T')[0];
    
    renderAll();
};

// Show Toast
const showToast = (message) => {
    toastMsg.innerText = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
};

// Show validation error
const showError = (element, show) => {
    if (show) {
        element.classList.add('show');
        element.previousElementSibling?.classList?.add('input-invalid');
    } else {
        element.classList.remove('show');
        element.previousElementSibling?.classList?.remove('input-invalid');
    }
};

// Form validation
const validateForm = () => {
    const text = textInput.value.trim();
    const amount = amountInput.value.trim();
    
    let isValid = true;
    
    if (text === '') {
        showError(textError, true);
        isValid = false;
    } else {
        showError(textError, false);
    }
    
    if (amount === '' || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        showError(amountError, true);
        isValid = false;
    } else {
        showError(amountError, false);
    }
    
    return isValid;
};

// Real-time validation feedback
textInput.addEventListener('input', () => {
    if (textInput.value.trim() !== '') showError(textError, false);
});
amountInput.addEventListener('input', () => {
    if (amountInput.value.trim() !== '' && !isNaN(parseFloat(amountInput.value)) && parseFloat(amountInput.value) > 0) {
        showError(amountError, false);
    }
});

// Handle Form Submit
const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const text = textInput.value.trim();
    const amount = amountInput.value.trim();
    const type = typeSelect.value;
    const date = dateInput.value;
    
    const editId = editIdInput.value;
    
    if (editId) {
        updateTransaction(editId, text, amount, type, date);
        showToast('Transaction Updated successfully');
        exitEditMode();
    } else {
        addTransaction(text, amount, type, date);
        showToast('Transaction Added successfully');
        resetForm();
    }
    
    updateView();
};

// Reset Form
const resetForm = () => {
    textInput.value = '';
    amountInput.value = '';
    typeSelect.value = 'expense';
    dateInput.value = new Date().toISOString().split('T')[0];
    showError(textError, false);
    showError(amountError, false);
};

resetBtn.addEventListener('click', resetForm);

// Enter Edit Mode
const enterEditMode = (id) => {
    const transaction = getTransaction(id);
    if (!transaction) return;
    
    editIdInput.value = transaction.id;
    textInput.value = transaction.text;
    amountInput.value = transaction.amount;
    typeSelect.value = transaction.type;
    dateInput.value = transaction.date;
    
    formTitle.innerText = 'Update Transaction';
    submitBtn.innerText = 'Update Transaction';
    cancelEditBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
    
    showError(textError, false);
    showError(amountError, false);
    
    // Smooth scroll to form
    document.querySelector('.left-panel').scrollIntoView({ behavior: 'smooth' });
    textInput.focus();
};

// Exit Edit Mode
const exitEditMode = () => {
    editIdInput.value = '';
    resetForm();
    
    formTitle.innerText = 'Add Transaction';
    submitBtn.innerText = 'Add Transaction';
    cancelEditBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
};

cancelEditBtn.addEventListener('click', exitEditMode);

// -------------------------------------
// Toolbar Logic
// -------------------------------------
const updateView = () => {
    renderAll(filterSelect.value, sortSelect.value, searchInput.value);
};

searchInput.addEventListener('input', updateView);
filterSelect.addEventListener('change', updateView);
sortSelect.addEventListener('change', updateView);

// -------------------------------------
// Modal Logic
// -------------------------------------
window.appPromptDelete = (id) => {
    itemToDeleteId = id;
    deleteModal.classList.remove('hidden');
};

const closeModals = () => {
    deleteModal.classList.add('hidden');
    clearAllModal.classList.add('hidden');
    itemToDeleteId = null;
};

modalCancelBtns.forEach(btn => btn.addEventListener('click', closeModals));

confirmDeleteBtn.addEventListener('click', () => {
    if (itemToDeleteId) {
        deleteTransaction(itemToDeleteId);
        showToast('Transaction Deleted');
        updateView();
        closeModals();
    }
});

clearAllTrigger.addEventListener('click', () => {
    if (state.transactions.length > 0) {
        clearAllModal.classList.remove('hidden');
    }
});

confirmClearBtn.addEventListener('click', () => {
    clearAllTransactions();
    showToast('All Transactions Cleared');
    updateView();
    closeModals();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModals();
    }
});

// -------------------------------------
// Global Handlers
// -------------------------------------
window.appEditTransaction = (id) => {
    enterEditMode(id);
};

emptyAddBtn.addEventListener('click', () => {
    document.querySelector('.left-panel').scrollIntoView({ behavior: 'smooth' });
    textInput.focus();
});

// -------------------------------------
// Theme Toggle
// -------------------------------------
themeToggleBtn.addEventListener('click', () => {
    if (state.theme === 'light') {
        state.theme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        state.theme = 'light';
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    saveTheme();
});

// Boot
form.addEventListener('submit', handleFormSubmit);
init();
