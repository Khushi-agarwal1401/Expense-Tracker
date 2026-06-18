export const calculateIncome = (transactions) => {
    return transactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
};

export const calculateExpense = (transactions) => {
    return transactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
};

export const calculateBalance = (transactions) => {
    const income = calculateIncome(transactions);
    const expense = calculateExpense(transactions);
    return income - expense;
};

export const getTransactionCount = (transactions) => {
    return transactions.length;
};