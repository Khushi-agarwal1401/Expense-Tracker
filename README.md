# Expense Tracker

A fully-responsive Expense Tracker web application built with pure HTML5, CSS3, and Vanilla JavaScript (ES6) as part of the Capstone Project under Track A (Dev Agency Distributed Workflow).

## Features

### Core CRUD Operations
- **Create**: Add income, expense, borrow, or lend transactions with description, category, amount, type, and date
- **Read**: Display transactions in a table with transaction count
- **Update**: Edit existing transactions in-place
- **Delete**: Remove individual transactions or clear all

### Storage
- All data persists in localStorage using JSON serialization
- Transactions restored on page reload

### Calculations
- Income total using `filter()` and `reduce()`
- Expense total using `filter()` and `reduce()`
- Borrow and Lend totals using `filter()` and `reduce()`
- Balance calculation (income + borrow - expenses - lend)
- Transaction count
- Statistics: Highest Income, Highest Expense, Average Transaction
- Income and Expense grouped by categories with progress bars

### UI Features
- Responsive design (320px mobile, 768px tablet, desktop)
- Clean theme with light/dark mode toggle
- Real-time form validation with error messages
- Dedicated **Preview All** page for full-screen transaction viewing
- Income and Expense Category visualization graphs
- Export transactions to Excel (CSV format)
- Empty state handling
- Sort by amount or date
- Filter by income/expense/borrow/lend/all
- Search by description

## Project Structure

```
expense-tracker/
├── index.html          # Main dashboard
├── preview.html        # Preview all transactions page
├── css/
│   ├── styles.css      # Base styles (light/dark theme)
│   └── responsive.css  # Media queries
├── js/
│   ├── app.js          # Main entry point, form handlers, event listeners
│   ├── preview.js      # Logic for the preview page and charts
│   ├── render.js       # DOM rendering functions
│   ├── state/
│   │   └── transactions.js  # State management (CRUD operations)
│   └── storage/
│       └── localStorage.js    # Storage operations
└── README.md
```

## Usage

Simply open `index.html` in a browser. No build step required.

## Git Workflow (Track A)

```bash
git checkout -b feature/expense-tracker
# ... make changes ...
git push origin feature/expense-tracker
# Create Pull Request for peer review
```

## License

MIT