import { state } from '../state/transactions.js';
import { calculateIncome, calculateExpense, calculateBalance, getTransactionCount } from '../utils/calculations.js';

export const formatMoney = (amount) => {
    return '$' + Math.abs(amount).toFixed(2);
};

export const renderSummary = () => {
    const incomeTotalEl = document.getElementById('income-total');
    const expenseTotalEl = document.getElementById('expense-total');
    const balanceEl = document.getElementById('balance');
    const countEl = document.getElementById('transaction-count');
    
    if (!incomeTotalEl) return;
    
    const income = calculateIncome(state.transactions);
    const expense = calculateExpense(state.transactions);
    const balance = calculateBalance(state.transactions);
    const count = getTransactionCount(state.transactions);
    
    balanceEl.innerText = `${balance < 0 ? '-' : ''}${formatMoney(balance)}`;
    incomeTotalEl.innerText = `+${formatMoney(income)}`;
    expenseTotalEl.innerText = `-${formatMoney(expense)}`;
    
    if (countEl) {
        countEl.innerText = count;
    }
    
    // Color balance based on value
    balanceEl.style.color = balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
};

export const renderTransactions = (transactions = state.transactions) => {
    const transactionListEl = document.getElementById('transaction-list');
    const emptyStateEl = document.getElementById('empty-state');
    
    if (!transactionListEl) return;
    
    transactionListEl.innerHTML = '';
    
    if (transactions.length === 0) {
        emptyStateEl?.classList.add('show');
        return;
    }
    
    emptyStateEl?.classList.remove('show');
    
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.className = `transaction-item ${transaction.type}`;
        li.dataset.id = transaction.id;
        
        const sign = transaction.amount < 0 ? '-' : '+';
        const displayAmount = Math.abs(transaction.amount);
        
        li.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-name">${transaction.description}</span>
                <span class="transaction-date">${transaction.date}</span>
            </div>
            <div class="transaction-amount ${transaction.type}">
                <span>${sign}${formatMoney(displayAmount)}</span>
            </div>
            <div class="transaction-actions">
                <button class="action-btn edit-btn" onclick="window.appEditTransaction('${transaction.id}')" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="window.appDeleteTransaction('${transaction.id}')" title="Delete">🗑️</button>
            </div>
        `;
        
        transactionListEl.appendChild(li);
    });
};

export const renderEmptyState = () => {
    const emptyStateEl = document.getElementById('empty-state');
    if (emptyStateEl) {
        emptyStateEl.classList.add('show');
    }
};

export const renderAll = (transactionsParam) => {
    const transactions = transactionsParam || state.transactions;
    renderTransactions(transactions);
    // Render summary based on all transactions (not filtered)
    renderSummary();
};