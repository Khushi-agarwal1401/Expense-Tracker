import { loadState, state } from './state/transactions.js';
import { renderOverview, formatMoney } from './render.js';

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

// Load Theme
loadTheme();

// Initialize Transactions
loadState();
window.filteredTransactions = [...state.transactions];

// We need a specific render for the preview table because it does not have the action buttons
// or we can just redefine renderTransactions for preview or modify the existing one.
// Let's create a custom render function here to avoid breaking the main app's edit/delete functionality.
const renderPreviewTransactions = (transactions = state.transactions) => {
    const tbody = document.querySelector('#transaction-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        emptyState?.classList.add('show');
        return;
    }
    emptyState?.classList.remove('show');
    
    transactions.forEach((t, index) => {
        const tr = document.createElement('tr');
        
        const sign = t.amount < 0 ? '-' : '+';
        const displayAmount = Math.abs(t.amount);
        
        let textColorClass = '';
        let badgeClass = '';
        if (t.type === 'income') { textColorClass = 'text-green'; badgeClass = 'income-badge'; }
        else if (t.type === 'expense') { textColorClass = 'text-red'; badgeClass = 'expense-badge'; }
        else if (t.type === 'borrow') { textColorClass = 'text-blue'; badgeClass = 'borrow-badge'; }
        else if (t.type === 'lend') { textColorClass = 'text-purple'; badgeClass = 'lend-badge'; }
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${t.description}</td>
            <td><span class="text-muted" style="font-size: 0.8rem;">${t.category}</span></td>
            <td class="${textColorClass}">${sign}${formatMoney(displayAmount)}</td>
            <td><span class="badge ${badgeClass}">${t.type}</span></td>
            <td>${t.date}</td>
        `;
        
        tbody.appendChild(tr);
    });
};

// Filter handler
const filterSelect = document.getElementById('filter-select');
filterSelect?.addEventListener('change', (e) => {
    const filter = e.target.value;
    let filtered = [...state.transactions];
    
    if (filter !== 'all') {
        filtered = filtered.filter(t => t.type === filter);
    }
    
    window.filteredTransactions = filtered;
    renderPreviewTransactions(filtered);
    
    // Trigger sort again if a sort is currently applied
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.dispatchEvent(new Event('change'));
    }
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
    renderPreviewTransactions(sorted);
});

const renderExpenseGraph = () => {
    const graphContainer = document.getElementById('expense-category-graph');
    if (!graphContainer) return;
    
    const expenseTransactions = state.transactions.filter(t => t.type === 'expense');
    
    if (expenseTransactions.length === 0) {
        graphContainer.innerHTML = '<p class="text-muted" style="font-size: 0.875rem; text-align: center;">No expense transactions available.</p>';
        return;
    }
    
    const categoryTotals = {};
    let totalExpense = 0;
    
    expenseTransactions.forEach(t => {
        const cat = t.category || 'Uncategorized';
        if (!categoryTotals[cat]) categoryTotals[cat] = 0;
        categoryTotals[cat] += Math.abs(t.amount);
        totalExpense += Math.abs(t.amount);
    });
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    graphContainer.innerHTML = '';
    
    sortedCategories.forEach(([cat, amount]) => {
        const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
        
        const itemHtml = `
            <div class="legend-item mt-15">
                <span class="dot red"></span>
                <span class="label" style="text-transform: capitalize;">${cat}</span>
                <span class="percent">${formatMoney(amount)} (${percent.toFixed(0)}%)</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar red" style="width: ${percent}%;"></div></div>
        `;
        graphContainer.innerHTML += itemHtml;
    });
};

const renderIncomeGraph = () => {
    const graphContainer = document.getElementById('income-category-graph');
    if (!graphContainer) return;
    
    const incomeTransactions = state.transactions.filter(t => t.type === 'income');
    
    if (incomeTransactions.length === 0) {
        graphContainer.innerHTML = '<p class="text-muted" style="font-size: 0.875rem; text-align: center;">No income transactions available.</p>';
        return;
    }
    
    // Calculate total income and group by category
    const categoryTotals = {};
    let totalIncome = 0;
    
    incomeTransactions.forEach(t => {
        const cat = t.category || 'Uncategorized';
        if (!categoryTotals[cat]) categoryTotals[cat] = 0;
        categoryTotals[cat] += Math.abs(t.amount);
        totalIncome += Math.abs(t.amount);
    });
    
    // Sort categories by amount descending
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    graphContainer.innerHTML = '';
    
    sortedCategories.forEach(([cat, amount]) => {
        const percent = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
        
        const itemHtml = `
            <div class="legend-item mt-15">
                <span class="dot green"></span>
                <span class="label" style="text-transform: capitalize;">${cat}</span>
                <span class="percent">${formatMoney(amount)} (${percent.toFixed(0)}%)</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar green" style="width: ${percent}%;"></div></div>
        `;
        graphContainer.innerHTML += itemHtml;
    });
};

// Initial Render
renderPreviewTransactions();
renderOverview();
renderIncomeGraph();
renderExpenseGraph();
