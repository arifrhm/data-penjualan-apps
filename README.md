# 🛍️ Aplikasi Data Penjualan — Monorepo DDD Modular Monolith

Aplikasi Data Penjualan full-stack yang dikembangkan dengan arsitektur **Monorepo (`pnpm workspaces`)**, **Backend Node.js + Express + TypeORM (Domain-Driven Design Modular Monolith)**, **Frontend Next.js (Dark Mode Glassmorphic Dashboard)**, dan **Database PostgreSQL (Third Normal Form - 3NF)**.

---

## 🌟 Fitur Utama & Jawaban Soal

1. **Normalisasi Database (3NF)**: Data penjualan dari soal dipisah secara rapi menjadi 3 tabel (`product_categories`, `products`, `transactions`) untuk mengeliminasi redundansi data.
2. **Backend & Frontend CRUD**: Manajemen Master Kategori, Master Produk (Stok), dan Transaksi Penjualan.
3. **Pencarian (Search) & Pengurutan (Sorting)**: Fitur cari berdasarkan nama barang, dan pengurutan dinamis berdasarkan **Nama Barang** & **Tanggal Transaksi** (Ascending / Descending) serta Pagination.
4. **Komparasi Penjualan Jenis Barang**: Halaman perbandingan grafik & tabel untuk jenis barang **Terbanyak Terjual vs Terendah Terjual**.
5. **Filter Rentang Waktu**: Filter tanggal awal (`startDate`) dan tanggal akhir (`endDate`) pada halaman komparasi.
6. **Automation & Regression Testing (Blast Radius Guard)**: Unit testing dengan Vitest dan script deteksi dampak perubahan kodingan (*blast radius guard*).
7. **REST API Standard**: Respon JSON terstruktur dan konsisten (`ApiResponse<T>`) untuk integrasi program inter-aplikasi.

---

## 📐 Arsitektur Sistem

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

## 🗄️ Normalisasi Database (3NF Schema)

```
[product_categories] 1 --- * [products] 1 --- * [transactions]
```

- **`product_categories`**: `id` (PK), `name` (UNIQUE), `created_at`, `updated_at`
- **`products`**: `id` (PK), `name`, `stock`, `category_id` (FK), `created_at`, `updated_at`
- **`transactions`**: `id` (PK), `product_id` (FK), `quantity_sold`, `transaction_date`, `stock_at_transaction`, `created_at`, `updated_at`

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat System
- **Node.js**: `>= 18.x`
- **Package Manager**: `pnpm` (`npm i -g pnpm`)
- **Database**: PostgreSQL (berjalan di `localhost:5432` atau cloud)

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd data-penjualan-apps

# Install seluruh dependensi monorepo
pnpm install
```

### 2. Konfigurasi Environment Variables

Salin `.env.example` menjadi `.env` di root direktori (atau sesuaikan parameter PostgreSQL):

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

### 3. Build & Seed Database Initial Data

Jalankan perintah berikut untuk membuat database schema dan mengisi 7 data awal dari soal:

```bash
# Build shared package & aplikasi
pnpm build

# Jalankan seeder data awal
pnpm seed
```

### 4. Jalankan Aplikasi (Development Mode)

```bash
pnpm dev
```

Aplikasi akan berjalan di:
- **Frontend Dashboard (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API (Express)**: [http://localhost:3001](http://localhost:3001)

---

## 🔗 Dokumentasi REST API

Semua endpoint mengembalikan format JSON standar:

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

| Method | Endpoint | Query Parameters | Deskripsi |
|---|---|---|---|
| `GET` | `/api/categories` | - | Mengambil daftar semua kategori |
| `POST` | `/api/categories` | - | Membuat kategori baru |
| `PUT` | `/api/categories/:id` | - | Memperbarui data kategori |
| `DELETE` | `/api/categories/:id` | - | Menghapus kategori |
| `GET` | `/api/products` | `?search=Kopi` | Mengambil daftar produk (dukungan pencarian) |
| `POST` | `/api/products` | - | Membuat produk baru |
| `PUT` | `/api/products/:id` | - | Memperbarui data produk |
| `DELETE` | `/api/products/:id` | - | Menghapus produk |
| `GET` | `/api/transactions` | `?search=Kopi&sortBy=name\|date&sortOrder=asc\|desc&page=1&limit=10` | Mengambil data transaksi dengan filter **Pencarian, Pengurutan, dan Pagination** |
| `POST` | `/api/transactions` | - | Menambah transaksi baru (stok produk berkurang otomatis) |
| `PUT` | `/api/transactions/:id` | - | Memperbarui transaksi (stok menyesuaikan) |
| `DELETE` | `/api/transactions/:id` | - | Menghapus transaksi (stok dikembalikan) |
| `GET` | `/api/sales/comparison` | `?type=highest\|lowest&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | **Komparasi Penjualan Jenis Barang** dengan filter rentang waktu |

---

## 🧪 Automation & Regression Testing

Aplikasi ini menggunakan **Vitest** untuk pengujian otomatis pada layer domain & application.

```bash
# 1. Jalankan semua unit test suite
pnpm test

# 2. Smart Blast Radius Test (hanya menguji berkas yang berubah via git diff)
pnpm test:changed

# 3. Running Pre-commit Guard script
./scripts/blast-radius-check.sh
```

---

## 📄 Lisensi

MIT License.
