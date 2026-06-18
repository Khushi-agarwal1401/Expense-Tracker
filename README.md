# Expense Tracker

A fully-responsive Expense Tracker web application built with pure HTML5, CSS3, and Vanilla JavaScript (ES6) as part of the Capstone Project under Track A (Dev Agency Distributed Workflow).

## Features

### Core CRUD Operations
- **Create**: Add income or expense transactions with description, amount, type, and date
- **Read**: Display transactions in a table with transaction count
- **Update**: Edit existing transactions in-place
- **Delete**: Remove individual transactions or clear all

### Storage
- All data persists in localStorage using JSON serialization
- Transactions restored on page reload

### Calculations
- Income total using `filter()` and `reduce()`
- Expense total using `filter()` and `reduce()`
- Balance calculation (income - expenses)
- Transaction count
- Statistics: Highest Income, Highest Expense, Average Transaction

### UI Features
- Responsive design (320px mobile, 768px tablet, desktop)
- Clean theme with light/dark mode toggle
- Real-time form validation with error messages
- Empty state handling
- Sort by amount or date
- Filter by income/expense/all
- Search by description

## Project Structure

```
expense-tracker/
├── index.html
├── css/
│   ├── styles.css      # Base styles (light/dark theme)
│   └── responsive.css  # Media queries
├── js/
│   ├── app.js          # Main entry point, form handlers, event listeners
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