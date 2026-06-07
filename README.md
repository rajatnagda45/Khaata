# Invoice Management Dashboard

Production-grade full-stack invoice dashboard built with React, Tailwind CSS, Node.js, Express, MongoDB, and Docker Compose. The app supports invoice list management, server-side filtering/sorting, create/edit flows, customer analytics, and portfolio-level billing insights powered entirely by the provided dataset.

## Tech Stack

- Frontend: React 18, Vite, React Router v6
- Styling: Tailwind CSS v3
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- State: React Context + `useReducer`
- Charts: Recharts
- HTTP Client: Axios
- Containerization: Docker Compose

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB locally or MongoDB Atlas
- Docker Desktop (for containerized setup)

## Setup (Local Development)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd invoice-dashboard
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `MONGO_URI` in `.env` if you are using Atlas or a non-default local instance.

### 3. Seed the database

```bash
node scripts/seed.js
```

Expected output includes:

- `Seeded 61 customers`
- `Seeded 2000 invoices`

### 4. Start backend

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

### 5. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

### 6. Open the app

Visit `http://localhost:5173`.

## Docker Setup (recommended)

From the project root:

```bash
docker compose up --build
```

Then seed the database in a second terminal:

```bash
docker exec invoice-backend node scripts/seed.js
```

Open `http://localhost:3000`.

## Data Modeling Rationale

### Two-collection design

The app uses two collections:

- `customers`
- `invoices`

Each customer has exactly one company, so customer identity data is normalized into the `customers` collection. This prevents repeating the same customer/company strings across 2,000 invoice documents and makes customer profile queries cleaner and more maintainable.

### Why invoices are not embedded in customers

Invoices are stored as separate top-level documents instead of being embedded into customer documents because:

- server-side pagination is straightforward on the `invoices` collection
- invoice-level filtering and sorting stays efficient
- customer profiles can aggregate against invoices without loading large embedded arrays
- the design scales cleanly if invoice volume grows beyond the seed dataset

### Why `customer` and `company` are denormalized on invoices

Invoices also keep `customer` and `company` as denormalized string fields. This avoids a join for every row on the invoice list page and keeps list queries fast while preserving the authoritative relationship through `customerId`.

### Index strategy

The `Invoice` model includes indexes for the supported query patterns:

- `{ customerId: 1, status: 1 }`
  Used for customer profile and status-based customer metrics.
- `{ status: 1 }`
  Used for server-side status filtering.
- `{ issueDate: -1 }`
  Used for the default invoice sort.
- `{ dueDate: 1 }`
  Used for due-date sorting and filtering.
- `{ amount: 1 }`
  Used for amount sorting and range filtering.
- `{ customer: 'text', invoiceId: 'text' }`
  Supports search-oriented workloads, even though the API currently uses regex search for broader matching across `customer`, `company`, and `invoiceId`.

## API Reference

### Invoices

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/invoices` | Paginated, filterable, sortable invoice list |
| `GET` | `/api/invoices/summary` | Global metrics, top customers, status breakdown |
| `GET` | `/api/invoices/:id` | Fetch a single invoice by Mongo `_id` |
| `POST` | `/api/invoices` | Create an invoice and auto-compute `invoiceId`, `tax`, and `total` |
| `PUT` | `/api/invoices/:id` | Update an invoice and recompute `tax` and `total` |
| `DELETE` | `/api/invoices/:id` | Delete an invoice |

Supported query params for `GET /api/invoices`:

- `page`
- `limit`
- `sortBy` = `amount | dueDate | issueDate`
- `sortOrder` = `asc | desc`
- `status`
- `taxRate`
- `customer`
- `search`
- `issueDateFrom`
- `issueDateTo`
- `dueDateFrom`
- `dueDateTo`
- `amountMin`
- `amountMax`

List response shape:

```json
{
  "data": [],
  "pagination": {
    "total": 2000,
    "page": 1,
    "limit": 20,
    "totalPages": 100
  }
}
```

### Customers

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/customers` | List all customers |
| `GET` | `/api/customers/:id` | Customer profile plus aggregated metrics |
| `GET` | `/api/customers/:id/invoices` | Paginated invoice history for a customer |

Customer profile response shape:

```json
{
  "customer": {
    "_id": "...",
    "name": "Ramesh Pillai",
    "company": "Cipla Pharma",
    "initials": "RP"
  },
  "metrics": {
    "totalBilled": 133213.07,
    "totalTax": 12450.3,
    "outstanding": 45230.5,
    "invoiceCount": 41,
    "statusBreakdown": {
      "Paid": 12,
      "Unpaid": 8,
      "Overdue": 7,
      "Draft": 6,
      "Sent": 5,
      "Void": 3
    }
  }
}
```

## Assumptions

- Tax and total are always recomputed from `amount × taxRate` on create and update.
- `Outstanding` means the sum of invoice totals where status is one of `Unpaid`, `Overdue`, or `Sent`.
- `invoiceId` is auto-generated on create and cannot be manually set from the client.
- All currency values are stored and presented in INR.
- `GET /customers` is rendered through the named `CustomersListPage` export from `src/pages/CustomerPage.jsx` to preserve the requested page inventory while still supporting the `/customers` route.
- `frontend/postcss.config.js` and `frontend/nginx.conf` were added because they are required for Tailwind CSS v3 and the production Docker setup to run correctly.

## Features Implemented

- Server-side invoice filters, sorting, and pagination
- Create and edit invoice modal with live tax and total preview
- Searchable customer combobox without external UI dependencies
- Customer profile analytics with status breakdown and invoice history
- Summary dashboard with portfolio metrics and top-customer bar chart
- Sticky invoice table header with frosted glass treatment
- Keyboard shortcuts: `N`, `Escape`, `?`
- Empty, loading, and error states throughout the app
- Docker Compose environment for MongoDB, backend, and frontend
