# SpendWise — Expense Tracker

A modern, production-ready personal finance tracker built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Dashboard** — Summary cards, 6-month spending bar chart, category pie chart, and recent expenses at a glance
- **Expense Management** — Add, edit, and delete expenses with full form validation
- **Smart Filtering** — Search by keyword, filter by category and date range
- **Sortable Table** — Click any column header to sort expenses
- **Analytics** — 12-month trend chart, category breakdown with progress bars, and month-over-month comparison
- **CSV Export** — Export your current filtered view to a CSV file
- **Persistent Storage** — All data saved to localStorage (no backend required)
- **Responsive Design** — Sidebar layout on desktop, hamburger menu on mobile

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> If port 3000 is taken, Next.js will pick the next available port (check your terminal output).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── expenses/page.tsx     # Expense list & CRUD
│   └── analytics/page.tsx    # Charts & analytics
├── components/
│   ├── ui/                   # Button, Input, Modal, Badge, Toast
│   ├── layout/               # AppShell, Sidebar
│   ├── dashboard/            # SummaryCard, MonthlyChart, CategoryChart, RecentExpenses
│   ├── expenses/             # ExpenseForm, ExpenseList, ExpenseFilters
│   └── analytics/            # MonthlyTrend, CategoryBreakdown
├── hooks/
│   ├── useExpenses.ts        # CRUD state + localStorage sync
│   └── useToast.ts           # Toast notification state
└── lib/
    ├── types.ts              # TypeScript types
    ├── constants.ts          # Categories, colors, icons
    ├── storage.ts            # localStorage read/write
    └── utils.ts              # Formatting, calculations, CSV export
```

## Categories

Food · Transportation · Entertainment · Shopping · Bills · Other

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
