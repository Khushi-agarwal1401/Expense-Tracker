import { state } from './state.js';

// DOM Elements
const balanceEl = document.getElementById('balance');
const incomeTotalEl = document.getElementById('income-total');
const expenseTotalEl = document.getElementById('expense-total');
const transactionListEl = document.getElementById('transaction-list');
const emptyStateEl = document.getElementById('empty-state');

// Format money
const formatMoney = (amount) => {
    return '$' + Math.abs(amount).toFixed(2);
};

// Update the balance, income and expense using array methods (reduce, filter)
export const updateDashboard = () => {
    const amounts = state.transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
        
    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0);

    balanceEl.innerText = `${total < 0 ? '-' : ''}${formatMoney(total)}`;
    incomeTotalEl.innerText = `+${formatMoney(income)}`;
    expenseTotalEl.innerText = `-${formatMoney(expense)}`;
};

// Render a single transaction to the list
const renderTransaction = (transaction) => {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    
    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.dataset.id = transaction.id;

    item.innerHTML = `
        <div class="transaction-info">
            <span class="transaction-name">${transaction.text}</span>
            <span class="transaction-amount">${sign}${formatMoney(transaction.amount)}</span>
        </div>
        <div class="transaction-actions">
            <button class="action-btn edit-btn" onclick="window.appEditTransaction('${transaction.id}')" title="Edit">✏️</button>
            <button class="action-btn delete-btn" onclick="window.appDeleteTransaction('${transaction.id}')" title="Delete">🗑️</button>
        </div>
    `;

    transactionListEl.appendChild(item);
};

// Render the entire list of transactions
export const renderList = () => {
    transactionListEl.innerHTML = '';
    
    if (state.transactions.length === 0) {
        emptyStateEl.classList.add('show');
    } else {
        emptyStateEl.classList.remove('show');
        state.transactions.forEach(renderTransaction);
    }
};

// Master render function
export const renderAll = () => {
    renderList();
    updateDashboard();
};
