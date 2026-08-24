# 🛍️ Sales Data Application — Monorepo DDD Modular Monolith

A full-stack Sales Data Application built with a **Monorepo (`pnpm workspaces`)**, **Backend Node.js + Express + TypeORM (Domain-Driven Design Modular Monolith)**, **Frontend Next.js (Dark Mode Glassmorphic Dashboard)**, and **PostgreSQL Database (Third Normal Form - 3NF)**.

---

## 🌟 Key Features & Problem Requirements

1. **Database Normalization (3NF)**: Original sales transaction data is cleanly normalized into 3 tables (`product_categories`, `products`, `transactions`) to eliminate data redundancy.
2. **Backend & Frontend CRUD**: Comprehensive CRUD operations for Category Master, Product Master (Stock), and Sales Transactions.
3. **Search & Sorting**: Product search by name, dynamic sorting by **Product Name** & **Transaction Date** (Ascending / Descending), with pagination.
4. **Category Sales Comparison**: Graphical & tabular comparison page for product categories (**Highest Sales vs Lowest Sales**).
5. **Date Range Filter**: Filter transactions and comparison data by start date (`startDate`) and end date (`endDate`).
6. **Automation & Regression Testing (Blast Radius Guard)**: Unit testing setup with Vitest and automated change-impact detection (*blast radius guard script*).
7. **Programmatic REST API Interface**: Standardized JSON response format (`ApiResponse<T>`) for clean integration with external applications.

---

## 📐 System Architecture

```
data-penjualan-apps/
├── packages/
│   └── shared/                 # Contract DTOs, Zod Validation, API Interfaces
├── apps/
│   ├── api/                    # Express Backend (DDD Bounded Contexts)
│   │   ├── src/
│   │   │   ├── core/           # Config, Database, Custom Errors, Middleware
│   │   │   └── modules/        # Domain Modules (Catalog & Sales)
│   │   │       ├── catalog/    # Product & Category Bounded Context
│   │   │       └── sales/      # Transaction & Comparison Bounded Context
│   └── web/                    # Next.js 14 Frontend Dashboard
│       ├── src/
│       │   ├── app/            # App Router Pages (Dashboard, CRUD, Comparison)
│       │   ├── components/     # UI & Layout Glassmorphism Components
│       │   └── hooks/          # React Custom Hooks for API consumption
├── .github/
│   └── workflows/ci.yml        # GitHub Actions Automated CI & Regression Testing
└── scripts/
    └── blast-radius-check.sh   # Smart Regression Test Guard Script
```

---

## 🗄️ Database Normalization (3NF Schema)

```
[product_categories] 1 --- * [products] 1 --- * [transactions]
```

- **`product_categories`**: `id` (PK), `name` (UNIQUE), `created_at`, `updated_at`
- **`products`**: `id` (PK), `name`, `stock`, `category_id` (FK), `created_at`, `updated_at`
- **`transactions`**: `id` (PK), `product_id` (FK), `quantity_sold`, `transaction_date`, `stock_at_transaction`, `created_at`, `updated_at`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 18.x`
- **Package Manager**: `pnpm` (`npm i -g pnpm`)
- **Database**: PostgreSQL (running on `localhost:5432` or remote server)

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd data-penjualan-apps

# Install all workspace dependencies
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the root directory and update your PostgreSQL credentials:

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=data_penjualan_db

NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Build & Seed Initial Database Data

Run the following commands to build packages and populate the 7 initial transaction records from the problem statement:

```bash
# Build shared package & applications
pnpm build

# Run database seeder
pnpm seed
```

### 4. Run Application (Development Mode)

```bash
pnpm dev
```

The application will start on:
- **Frontend Dashboard (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API (Express)**: [http://localhost:3001](http://localhost:3001)

---

## 🔗 REST API Documentation

All API endpoints return a standardized JSON format:

```json
{
  "success": true,
  "data": [...],
  "message": "Success message",
  "meta": {
    "total": 7,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Endpoints List

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/categories` | - | Retrieve all categories |
| `POST` | `/api/categories` | - | Create a new category |
| `PUT` | `/api/categories/:id` | - | Update a category |
| `DELETE` | `/api/categories/:id` | - | Delete a category |
| `GET` | `/api/products` | `?search=Kopi` | Retrieve products (supports search by name) |
| `POST` | `/api/products` | - | Create a new product |
| `PUT` | `/api/products/:id` | - | Update a product |
| `DELETE` | `/api/products/:id` | - | Delete a product |
| `GET` | `/api/transactions` | `?search=Kopi&sortBy=name\|date&sortOrder=asc\|desc&page=1&limit=10` | Retrieve sales transactions with **Search, Sorting, & Pagination** |
| `POST` | `/api/transactions` | - | Add a new transaction (automatically reduces product stock) |
| `PUT` | `/api/transactions/:id` | - | Update a transaction (adjusts stock accordingly) |
| `DELETE` | `/api/transactions/:id` | - | Delete a transaction (reverts stock) |
| `GET` | `/api/sales/comparison` | `?type=highest\|lowest&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | **Category Sales Comparison** with date range filter |

---

## 🧪 Automation & Regression Testing

This repository uses **Vitest** for unit & application service testing.

```bash
# 1. Run all unit test suites
pnpm test

# 2. Smart Blast Radius Test (runs tests only for files modified in git diff)
pnpm test:changed

# 3. Pre-commit Guard script
./scripts/blast-radius-check.sh
```

---

## 📄 License

MIT License.
