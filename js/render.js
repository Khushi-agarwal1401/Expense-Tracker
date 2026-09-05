import { state } from './state/transactions.js';

const formatMoney = (amount) => {
    return '₹' + Math.abs(amount).toFixed(2);
};

const calculateIncome = (transactions) => {
    return transactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
};

const calculateExpense = (transactions) => {
    return transactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Math.abs(item.amount), 0);
};

const calculateBorrow = (transactions) => {
    return transactions
        .filter(item => item.type === 'borrow')
        .reduce((sum, item) => sum + Math.abs(item.amount), 0);
};

const calculateLend = (transactions) => {
    return transactions
        .filter(item => item.type === 'lend')
        .reduce((sum, item) => sum + Math.abs(item.amount), 0);
};

const calculateBalance = (transactions) => {
    const income = calculateIncome(transactions);
    const expense = calculateExpense(transactions);
    const borrow = calculateBorrow(transactions);
    const lend = calculateLend(transactions);
    return income + borrow - expense - lend;
};

const getTransactionCount = (transactions) => {
    return transactions.length;
};

export const renderSummary = () => {
    const balanceEl = document.getElementById('current-balance');
    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expenses');
    const borrowEl = document.getElementById('total-borrow');
    const lendEl = document.getElementById('total-lend');
    const countEl = document.getElementById('transaction-count');
    
    if (!balanceEl) return;
    
    const income = calculateIncome(state.transactions);
    const expense = calculateExpense(state.transactions);
    const borrow = calculateBorrow(state.transactions);
    const lend = calculateLend(state.transactions);
    const balance = calculateBalance(state.transactions);
    const count = getTransactionCount(state.transactions);
    
    balanceEl.innerText = `${balance < 0 ? '-' : ''}${formatMoney(balance)}`;
    incomeEl.innerText = `${formatMoney(income)}`;
    expenseEl.innerText = `${formatMoney(expense)}`;
    if (borrowEl) borrowEl.innerText = `${formatMoney(borrow)}`;
    if (lendEl) lendEl.innerText = `${formatMoney(lend)}`;
    countEl.innerText = count;
    
    balanceEl.style.color = balance >= 0 ? 'var(--primary)' : 'var(--expense)';
};

export const renderStatistics = () => {
    const incomeTxns = state.transactions.filter(t => t.type === 'income');
    const expenseTxns = state.transactions.filter(t => t.type === 'expense');
    
    const highIncome = incomeTxns.length > 0 
        ? Math.max(...incomeTxns.map(t => t.amount)) 
        : 0;
    const highExpense = expenseTxns.length > 0 
        ? Math.max(...expenseTxns.map(t => Math.abs(t.amount))) 
        : 0;
    
    const amounts = state.transactions.map(t => Math.abs(t.amount));
    const avg = amounts.length > 0 
        ? amounts.reduce((sum, a) => sum + a, 0) / amounts.length 
        : 0;
    
    const highIncomeEl = document.getElementById('stat-high-income');
    const highExpenseEl = document.getElementById('stat-high-expense');
    const avgEl = document.getElementById('stat-avg');
    
    if (highIncomeEl) highIncomeEl.innerText = formatMoney(highIncome || 0);
    if (highExpenseEl) highExpenseEl.innerText = formatMoney(highExpense || 0);
    if (avgEl) avgEl.innerText = formatMoney(avg);
};

export const renderOverview = () => {
    const income = calculateIncome(state.transactions);
    const expense = calculateExpense(state.transactions);
    const total = income + expense;
    
    const incomePercent = total > 0 ? (income / total) * 100 : 0;
    const expensePercent = total > 0 ? (expense / total) * 100 : 0;
    
    const incomePercentEl = document.getElementById('income-percent');
    const expensePercentEl = document.getElementById('expense-percent');
    const incomeBar = document.getElementById('income-bar');
    const expenseBar = document.getElementById('expense-bar');
    const donutChart = document.getElementById('donut-chart');
    
    if (incomePercentEl) incomePercentEl.innerText = `${incomePercent.toFixed(0)}%`;
    if (expensePercentEl) expensePercentEl.innerText = `${expensePercent.toFixed(0)}%`;
    
    if (incomeBar) incomeBar.style.width = `${incomePercent}%`;
    if (expenseBar) expenseBar.style.width = `${expensePercent}%`;
    
    if (donutChart) {
        donutChart.style.background = `conic-gradient(
            var(--primary) 0% ${incomePercent}%,
            var(--expense) ${incomePercent}% 100%
        )`;
    }
};

export const renderTransactions = (transactions = state.transactions) => {
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
        tr.dataset.id = t.id;
        
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
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="window.enterEditMode('${t.id}')" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete" onclick="window.deleteTransaction('${t.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
};

export const renderAll = () => {
    renderTransactions();
    renderSummary();
    renderStatistics();
    renderOverview();
};

export { formatMoney };