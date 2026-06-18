export const validateDescription = (description) => {
    return description && description.trim().length > 0;
};

export const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num !== 0;
};

export const validateTransaction = (description, amount, type) => {
    const errors = {};
    
    if (!validateDescription(description)) {
        errors.description = 'Description cannot be empty';
    }
    
    if (!validateAmount(amount)) {
        errors.amount = 'Please enter a valid non-zero amount';
    }
    
    if (!type) {
        errors.type = 'Please select a transaction type';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};