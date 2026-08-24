# 🛍️ Sales Data Application — Monorepo DDD Modular Monolith

A full-stack Sales Data Application built with a **Monorepo (`pnpm workspaces`)**, **Backend Node.js + Express + TypeORM (Domain-Driven Design Modular Monolith)**, **Frontend Next.js (Dark Mode Glassmorphic Dashboard)**, and **PostgreSQL Database (Third Normal Form - 3NF)**.

---

## 🌟 Key Features & Problem Requirements

1. **Database Normalization (3NF)**: Original sales transaction data is cleanly normalized into 3 tables (`product_categories`, `products`, `transactions`) to eliminate data redundancy.
2. **Backend & Frontend CRUD**: Comprehensive CRUD operations for Category Master, Product Master (Stock), and Sales Transactions.
3. **Search & Sorting**: Product search by name, dynamic sorting by **Product Name** & **Transaction Date** (Ascending / Descending), with pagination.
4. **Category Sales Comparison**: Graphical & tabular comparison page for product categories (**Highest Sales vs Lowest Sales**).
5. **Date Range Filter**: Filter transactions and comparison data by start date (`startDate`) and end date (`endDate`).
6. **Automation & E2E Testing Workspace**: Unit testing with Vitest and End-to-End browser testing with **Playwright**.
7. **Programmatic REST API Interface**: Standardized JSON response format (`ApiResponse<T>`) for clean integration with external applications.

---

## 📐 System Architecture

```
data-penjualan-apps/
├── packages/
│   └── shared/                 # Contract DTOs, Zod Validation, API Interfaces
├── apps/
│   ├── api/                    # Express Backend (DDD Bounded Contexts)
│   ├── web/                    # Next.js 14 Frontend Dashboard
│   └── e2e/                    # Playwright E2E Testing Workspace 🎭
├── .github/
│   └── workflows/ci.yml        # GitHub Actions CI for Unit & E2E Testing
└── scripts/
    └── blast-radius-check.sh   # Smart Regression Test Guard Script
```

---

## 🎭 E2E Testing Workspace & Test Coverage Matrix

The `apps/e2e` workspace contains automated browser tests using **Playwright** covering all possible user flows and edge cases:

| Test Suite | Spec File | Possibility Coverage |
|---|---|---|
| **Dashboard** | `01_dashboard.spec.ts` | Stat cards rendering, Recent transaction table, Navigation |
| **Category CRUD** | `02_categories.spec.ts` | List default categories, Create new category, Form validations |
| **Product CRUD** | `03_products.spec.ts` | List products, Create product with stock, Search product by name |
| **Transactions** | `04_transactions.spec.ts` | Create transaction (auto stock reduction), **Search by Product Name**, **Sort by Name**, **Sort by Date**, Pagination |
| **Comparison & Filters** | `05_comparison.spec.ts` | **Highest vs Lowest Sales Toggle**, **Date Range Filter (`startDate` & `endDate`)**, Filter Reset |

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

## 🧪 Running Tests

```bash
# 1. Run Unit Tests (Vitest)
pnpm test

# 2. Run Smart Regression Test (affected files only via git diff)
pnpm test:changed

# 3. Run Playwright E2E Tests
pnpm test:e2e

# 4. Pre-commit Guard script
./scripts/blast-radius-check.sh

# 5. Run GitHub Actions CI/CD pipeline locally via nektos/act
./scripts/run-local-ci.sh   # or pnpm test:ci-local
```

---

## 📄 License

MIT License.
