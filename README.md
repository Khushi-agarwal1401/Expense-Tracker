# Expense Tracker

A fully-responsive Expense Tracker web application built with pure HTML5, CSS3, and Vanilla JavaScript (ES6) as part of the Capstone Project under Track A (Dev Agency Distributed Workflow).

## Features

### Core CRUD Operations
- **Create**: Add income or expense transactions with description, amount, and type
- **Read**: Display transactions with search/filter capabilities
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

### UI Features
- Responsive design (320px mobile to desktop)
- Clean dark theme with glassmorphism
- Real-time form validation with error messages
- Empty state handling
- Sort by amount or date
- Filter by income/expense/all

## Project Structure

```
expense-tracker/
├── index.html
├── css/
│   ├── styles.css      # Base styles
│   └── responsive.css  # Media queries
├── js/
│   ├── main.js         # Entry point
│   ├── state/
│   │   └── transactions.js  # State management
│   ├── storage/
│   │   └── localStorage.js    # Storage operations
│   ├── utils/
│   │   ├── calculations.js    # Calculation functions
│   │   └── validators.js      # Form validation
│   └── ui/
│       ├── render.js      # DOM rendering
│       └── formHandler.js # Form and event handlers
└── assets/
```

## Usage

Simply open `index.html` in a browser. No build step required.

## Local Development

```bash
# Start a local server (optional, for localStorage support)
npx serve .
# or
python -m http.server 8000
```

## Git Workflow

This project follows Track A Dev Agency workflow:

```bash
git checkout develop
git checkout -b feature/expense-tracker-[feature-name]
# ... make changes ...
git push origin feature/expense-tracker-[feature-name]
# Create Pull Request for peer review
```

## License

MIT