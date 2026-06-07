# 🚀 Invoice Management Dashboard

<div align="center">

### 💼 Production-Grade Full-Stack Invoice Management Platform

Built with **React, Node.js, Express, MongoDB, Docker, and Recharts** to deliver a modern invoicing experience with powerful analytics, customer insights, and high-performance data operations.

![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![License](https://img.shields.io/badge/Status-Assignment-success)

</div>

---

# ✨ Overview

This project is a full-stack invoice management system built as part of the **Powerplay Full Stack Internship Assignment**.

The application ingests **2,000 invoice records**, supports **61 unique customers**, and provides a complete workflow for:

✅ Invoice Management  
✅ Customer Analytics  
✅ Revenue Insights  
✅ Server-Side Filtering & Sorting  
✅ Dashboard Visualizations  
✅ Dockerized Deployment  

The architecture is designed with scalability, maintainability, and production-readiness in mind.

---

# 🎯 Key Features

### 📄 Invoice Management

- Create invoices
- Edit invoices
- Delete invoices
- View invoice details
- Auto-generated invoice IDs
- Automatic tax and total calculation

### 🔍 Powerful Search & Filtering

- Search by Invoice ID
- Search by Customer Name
- Status Filters
- Tax Rate Filters
- Issue Date Range Filters
- Due Date Range Filters
- Amount Range Filters

### ⚡ High Performance

- Server-side Pagination
- Server-side Sorting
- Optimized MongoDB Queries
- Indexed Collections
- Aggregation Pipelines

### 👥 Customer Analytics

- Customer Profile Dashboard
- Invoice History
- Outstanding Amount Tracking
- Status Breakdown
- Total Billed Metrics
- Tax Contribution Analysis

### 📊 Business Insights

- Revenue Dashboard
- Top Customers Analysis
- Invoice Status Distribution
- Portfolio-Level Metrics
- Tax Collection Summary

### 🎨 User Experience

- Responsive Design
- Modern Dashboard UI
- Loading States
- Empty States
- Error Handling
- Keyboard Shortcuts
- Sticky Table Headers
- Glassmorphism Effects

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| React 18 | UI Library |
| Vite | Build Tool |
| React Router v6 | Routing |
| Tailwind CSS | Styling |
| Axios | API Communication |
| Recharts | Analytics & Visualization |
| Context API + useReducer | State Management |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| Mongo Aggregation | Analytics Queries |

---

## Infrastructure

| Technology | Purpose |
|------------|----------|
| Docker | Containerization |
| Docker Compose | Multi-Service Orchestration |

---

# 🏗️ Architecture

```txt
┌─────────────────────┐
│      React App      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Express API      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      MongoDB        │
└─────────────────────┘
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd invoice-dashboard
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update your `.env`:

```env
MONGO_URI=mongodb://localhost:27017/invoice_dashboard
PORT=5000
```

---

## 3️⃣ Seed Database

```bash
node scripts/seed.js
```

Expected Output:

```txt
✅ Seeded 61 customers
✅ Seeded 2000 invoices
```

---

## 4️⃣ Start Backend

```bash
npm run dev
```

Backend:

```txt
http://localhost:5000
```

---

## 5️⃣ Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

---

# 🐳 Docker Setup (Recommended)

Start all services:

```bash
docker compose up --build
```

Seed database:

```bash
docker exec invoice-backend node scripts/seed.js
```

Application:

```txt
Frontend → http://localhost:3000
Backend  → http://localhost:5000
MongoDB  → localhost:27017
```

---

# 🧠 Data Modeling Rationale

The system follows a **two-collection architecture**:

## Customers Collection

```js
{
  _id,
  name,
  company
}
```

## Invoices Collection

```js
{
  _id,
  invoiceId,
  customerId,
  customer,
  company,
  amount,
  taxRate,
  tax,
  total,
  status,
  issueDate,
  dueDate
}
```

---

## Why Separate Collections?

### ✅ Normalization

A customer belongs to exactly one company.

Instead of repeating customer-company relationships across thousands of invoice records, customer identity is stored once.

Benefits:

- Reduced duplication
- Cleaner schema
- Easier maintenance
- Better scalability

---

## Why Not Embed Invoices?

Invoices are independent documents because:

- Server-side pagination remains efficient
- Sorting stays fast
- Filtering scales better
- Customer profiles can aggregate invoices dynamically
- Prevents oversized customer documents

---

## Strategic Denormalization

Invoices also store:

```js
customer
company
```

This avoids expensive joins for invoice-list views while maintaining a normalized source of truth via `customerId`.

---

# ⚡ Database Index Strategy

Optimized for real-world query patterns.

```js
{ customerId: 1, status: 1 }
```

Used for:

- Customer dashboards
- Status analytics

```js
{ status: 1 }
```

Used for:

- Status filtering

```js
{ issueDate: -1 }
```

Used for:

- Default sorting

```js
{ dueDate: 1 }
```

Used for:

- Due date filters
- Due date sorting

```js
{ amount: 1 }
```

Used for:

- Amount range queries

```js
{ customer: "text", invoiceId: "text" }
```

Used for:

- Search workloads

---

# 📡 API Reference

## 📄 Invoice APIs

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/invoices` | Paginated invoice list |
| GET | `/api/invoices/summary` | Dashboard analytics |
| GET | `/api/invoices/:id` | Single invoice |
| POST | `/api/invoices` | Create invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

---

### Supported Query Parameters

```txt
page
limit
sortBy
sortOrder
status
taxRate
customer
search
issueDateFrom
issueDateTo
dueDateFrom
dueDateTo
amountMin
amountMax
```

---

## 👥 Customer APIs

| Method | Endpoint |
|----------|----------|
| GET | `/api/customers` |
| GET | `/api/customers/:id` |
| GET | `/api/customers/:id/invoices` |

---

# 📈 Analytics Delivered

### Global Dashboard Metrics

- Total Revenue
- Total Tax
- Outstanding Amount
- Total Customers
- Total Invoices

### Customer Metrics

- Total Billed
- Total Tax
- Outstanding Amount
- Invoice Count
- Status Breakdown

### Revenue Insights

- Top Customers
- Revenue Distribution
- Status Distribution
- Collection Tracking

---

# ⌨️ Productivity Features

### Keyboard Shortcuts

| Shortcut | Action |
|-----------|---------|
| N | Create Invoice |
| ESC | Close Modal |
| ? | Open Shortcuts Help |

---

# 📋 Assumptions

- Tax is always recalculated from `amount × taxRate`
- Outstanding = Sent + Unpaid + Overdue invoices
- Invoice IDs are auto-generated by the backend
- Currency is represented in INR (₹)
- Customer-company relationship is immutable
- Analytics are computed directly from invoice records

---

# 🌟 Highlights

✅ Full Stack Architecture  
✅ Production-Ready API Design  
✅ MongoDB Aggregation Pipelines  
✅ Optimized Query Performance  
✅ Responsive UI  
✅ Dockerized Deployment  
✅ Customer Analytics Dashboard  
✅ Advanced Filtering & Search  
✅ Clean Data Modeling  
✅ Scalable Foundation

---

# 👨‍💻 Developed For

### Powerplay — Full Stack Developer Internship Assignment

Built with a focus on:

- Software Engineering Best Practices
- Clean Architecture
- Scalability
- Performance
- Developer Experience
- Production Readiness

---

<div align="center">

### ⭐ Thank you for reviewing this submission!

Built with ❤️, ☕ and lots of MongoDB aggregations.

</div>
