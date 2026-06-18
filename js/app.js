import { loadState, addTransaction, deleteTransaction, updateTransaction, getTransaction } from './state.js';
import { renderAll } from './render.js';

// DOM Elements
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const editIdInput = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Initialize Application
const init = () => {
    loadState();
    renderAll();
};

// Handle Form Submit (Add or Edit)
const handleFormSubmit = (e) => {
    e.preventDefault();

    const text = textInput.value.trim();
    const amount = amountInput.value.trim();

    if (text === '' || amount === '') {
        alert('Please enter a valid text and amount');
        return;
    }

    const editId = editIdInput.value;

    if (editId) {
        // We are updating an existing transaction
        updateTransaction(editId, text, amount);
        exitEditMode();
    } else {
        // We are adding a new transaction
        addTransaction(text, amount);
    }

    // Clear form
    textInput.value = '';
    amountInput.value = '';
    
    renderAll();
};

// Enter Edit Mode
const enterEditMode = (id) => {
    const transaction = getTransaction(id);
    if (!transaction) return;

    editIdInput.value = transaction.id;
    textInput.value = transaction.text;
    amountInput.value = transaction.amount;

    formTitle.innerText = 'Edit Transaction';
    submitBtn.innerText = 'Update Transaction';
    cancelBtn.classList.remove('hidden');
    
    // Smooth scroll to form
    document.querySelector('.add-transaction').scrollIntoView({ behavior: 'smooth' });
    textInput.focus();
};

// Exit Edit Mode
const exitEditMode = () => {
    editIdInput.value = '';
    textInput.value = '';
    amountInput.value = '';

    formTitle.innerText = 'Add Transaction';
    submitBtn.innerText = 'Add Transaction';
    cancelBtn.classList.add('hidden');
};

// Expose delete and edit functions to window so inline onclick handlers in render.js can access them
// (Since we are using JS modules, functions aren't globally available by default)
window.appDeleteTransaction = (id) => {
    deleteTransaction(id);
    renderAll();
};

window.appEditTransaction = (id) => {
    enterEditMode(id);
};

// Event Listeners
form.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', exitEditMode);

// Boot
init();
