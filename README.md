# WorkLog Payment Dashboard

A frontend admin interface for reviewing freelancer time logs and processing payments. Built with Next.js 16, React 19, TypeScript, and TailwindCSS 4.

## Features

- View all worklogs with calculated total earnings per task
- Drill down into individual time entries for any worklog
- Filter worklogs by date range to identify work eligible for a payment cycle
- Select multiple worklogs and create a payment batch
- Exclude specific worklogs or freelancers from a batch before confirming
- All data is served from local mock data — no backend required

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TailwindCSS 4
- **Language**: TypeScript 5 (strict mode)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint 9
- **Formatting**: Prettier

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm test` | Run tests (single pass) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |

## Running Tests

```bash
npx vitest --run
```

## Project Structure

```
app/
  page.tsx              # Main dashboard page (root route)
  layout.tsx            # Root layout
  globals.css           # Global styles + TailwindCSS

components/
  WorklogList.tsx        # Filterable list of worklogs with selection
  TimeEntryDetails.tsx   # Drill-down view for a single worklog
  PaymentBatchReview.tsx # Batch review with exclusion controls
  DateRangeFilter.tsx    # Reusable date range input
  __tests__/             # Component unit tests

lib/
  types.ts              # TypeScript interfaces
  mock-data.ts          # Mock freelancers, worklogs, and time entries
  data-utils.ts         # Data transformation utilities
  __tests__/            # Utility unit tests
```

## Workflow

1. **Worklog List** — browse all worklogs, filter by date range, select worklogs for payment
2. **Time Entry Details** — click any worklog row to inspect individual time entries
3. **Payment Batch Review** — click "Create Payment Batch" to review selected worklogs, exclude items, and confirm payment
