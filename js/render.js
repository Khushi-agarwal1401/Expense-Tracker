import { state } from './state.js';

// DOM Elements
const currentBalanceEl = document.getElementById('current-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const transactionCountEl = document.getElementById('transaction-count');
const transactionListEl = document.getElementById('transaction-list');
const emptyStateEl = document.getElementById('empty-state');

// Stats Elements
const statHighIncome = document.getElementById('stat-high-income');
const statHighExpense = document.getElementById('stat-high-expense');
const statAvg = document.getElementById('stat-avg');

// Overview Elements
const incomePercentEl = document.getElementById('income-percent');
const expensePercentEl = document.getElementById('expense-percent');
const incomeBarEl = document.getElementById('income-bar');
const expenseBarEl = document.getElementById('expense-bar');
const donutChartEl = document.getElementById('donut-chart');

// Format money
const formatMoney = (amount) => {
    return '₹' + Math.abs(amount).toFixed(2);
};

// Format Date
const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
};

// Compute and render summary, stats, and overview
export const updateDashboard = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    let highIncome = 0;
    let highExpense = 0;

    state.transactions.forEach(t => {
        if (t.type === 'income') {
            totalIncome += t.amount;
            if (t.amount > highIncome) highIncome = t.amount;
        } else {
            totalExpense += t.amount;
            if (t.amount > highExpense) highExpense = t.amount;
        }
    });

    const balance = totalIncome - totalExpense;
    
    // Update top 4 cards
    currentBalanceEl.innerText = formatMoney(balance);
    totalIncomeEl.innerText = formatMoney(totalIncome);
    totalExpensesEl.innerText = formatMoney(totalExpense);
    transactionCountEl.innerText = state.transactions.length;

    // Update Stats Section
    const totalTransactions = state.transactions.length;
    const avg = totalTransactions === 0 ? 0 : (totalIncome + totalExpense) / totalTransactions;
    
    statHighIncome.innerText = formatMoney(highIncome);
    statHighExpense.innerText = formatMoney(highExpense);
    statAvg.innerText = formatMoney(avg);

    // Update Monthly Overview Section (Donut chart & progress)
    const grandTotal = totalIncome + totalExpense;
    let incPct = 0, expPct = 0;
    
    if (grandTotal > 0) {
        incPct = Math.round((totalIncome / grandTotal) * 100);
        expPct = 100 - incPct;
    }

    incomePercentEl.innerText = `${incPct}%`;
    expensePercentEl.innerText = `${expPct}%`;
    incomeBarEl.style.width = `${incPct}%`;
    expenseBarEl.style.width = `${expPct}%`;

    // Update CSS Donut Chart
    // The conic gradient starts at top.
    // 0 to incPct% is green, incPct% to 100% is red.
    // Color variables: var(--primary) and var(--expense)
    donutChartEl.style.background = `conic-gradient(var(--primary) 0% ${incPct}%, var(--expense) ${incPct}% 100%)`;
};

// Render a single transaction row
const renderTransactionRow = (transaction, index) => {
    const tr = document.createElement('tr');
    tr.dataset.id = transaction.id;

    const isIncome = transaction.type === 'income';
    const amountClass = isIncome ? 'income text-green' : 'expense text-red';
    const badgeClass = isIncome ? 'income-badge' : 'expense-badge';
    const sign = isIncome ? '+' : '-';

    tr.innerHTML = `
        <td>${index + 1}</td>
        <td style="font-weight: 500;">${transaction.text}</td>
        <td class="transaction-amount ${amountClass}" style="font-family: monospace; font-weight: 600;">
            ${sign}${formatMoney(transaction.amount)}
        </td>
        <td><span class="badge ${badgeClass}">${isIncome ? 'Income' : 'Expense'}</span></td>
        <td class="transaction-date">${formatDate(transaction.date)}</td>
        <td>
            <div class="action-btns">
                <button class="action-btn edit" onclick="window.appEditTransaction('${transaction.id}')" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="action-btn delete" onclick="window.appPromptDelete('${transaction.id}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    transactionListEl.appendChild(tr);
};

// Render the entire list with active filters/sorting
export const renderList = (filter = 'all', sort = 'latest', searchQuery = '') => {
    transactionListEl.innerHTML = '';
    
    let filtered = [...state.transactions];

    // Filter by type
    if (filter !== 'all') {
        filtered = filtered.filter(t => t.type === filter);
    }

    // Search by description
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(t => t.text.toLowerCase().includes(query));
    }

    // Sort
    filtered.sort((a, b) => {
        if (sort === 'latest') return new Date(b.date) - new Date(a.date);
        if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sort === 'highest') return b.amount - a.amount;
        if (sort === 'lowest') return a.amount - b.amount;
        return 0;
    });

    if (filtered.length === 0) {
        emptyStateEl.classList.add('show');
        document.querySelector('.transaction-table').classList.add('hidden');
    } else {
        emptyStateEl.classList.remove('show');
        document.querySelector('.transaction-table').classList.remove('hidden');
        filtered.forEach((t, i) => renderTransactionRow(t, i));
    }
};

// Master render function
export const renderAll = (filter = 'all', sort = 'latest', search = '') => {
    renderList(filter, sort, search);
    updateDashboard();
};
