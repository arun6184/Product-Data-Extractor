# World of Books Scraper - Product Data Explorer

A full-stack web scraping platform for exploring and discovering books from [World of Books](https://www.worldofbooks.com/). Built with **Next.js**, **NestJS**, **Crawlee**, and **Playwright** for on-demand scraping, intelligent caching, and a modern browsing experience.

---

## 🚀 Features

- **On-Demand Web Scraping** – Scrape navigation, categories, products, and product details using Crawlee + Playwright
- **Intelligent Caching** – Database-based TTL caching (24h navigation, 12h categories, 6h products)
- **Full REST API** – NestJS backend with Swagger documentation
- **Modern Frontend** – Next.js 14 App Router with SWR for data fetching
- **Browsing History** – Track user browsing with session management
- **Responsive Design** – Mobile-first Tailwind CSS styling
- **Production-Ready** – Error handling, retry logic, rate limiting, and logging

---

## 📁 Project Structure

```
Data Explorer/
├── backend/               # NestJS API + Scraper
│   ├── src/
│   │   ├── modules/
│   │   │   ├── navigation/
│   │   │   ├── category/
│   │   │   ├── product/
│   │   │   ├── product-detail/
│   │   │   ├── review/
│   │   │   ├── scraper/
│   │   │   └── history/
│   │   └── config/
│   └── package.json
│
└── frontend/             # Next.js Application
    ├── src/
    │   ├── app/          # App Router pages
    │   ├── components/   # React components
    │   ├── hooks/        # SWR data fetching hooks
    │   ├── lib/          # API client & utilities
    │   └── types/        # TypeScript types
    └── package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS 10
- **Database:** PostgreSQL (TypeORM)
- **Scraping:** Crawlee 3.7 + Playwright 1.40
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** SWR
- **HTTP Client:** Axios

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### 1. Clone Repository
```bash
cd "D:/Projects/Data Explorer"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=your_password
# DATABASE_NAME=worldofbooks_scraper

# Start development server
npm run start:dev
```

Backend will run on **http://localhost:3001**
Swagger docs: **http://localhost:3001/api/docs**

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
copy .env.local.example .env.local

# Edit .env.local (default values should work)
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

---

## 📖 Usage

### 1. Scrape Navigation
```bash
curl -X POST http://localhost:3001/api/navigation/scrape
```

### 2. Scrape Categories
```bash
curl -X POST "http://localhost:3001/api/categories/scrape?navigationUrl=https://www.worldofbooks.com/en-gb/books&navigationId=<nav-id>"
```

### 3. Scrape Products
```bash
curl -X POST http://localhost:3001/api/products/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "categoryUrl": "https://www.worldofbooks.com/en-gb/books/fiction",
    "categoryId": "<category-id>",
    "maxPages": 5
  }'
```

### 4. Browse Frontend
Visit **http://localhost:3000** and explore:
- Home page with hero and features
- Categories listing
- Products with search and pagination
- Product detail pages with reviews
- Browsing history

---

## 🌐 API Endpoints

### Navigation
- `GET /api/navigation` – Get all navigation items
- `POST /api/navigation/scrape` – Trigger scraping

### Categories
- `GET /api/categories` – Get categories (filter by `navigationId`, `parentId`)
- `GET /api/categories/:id` – Get single category
- `GET /api/categories/:id/subcategories` – Get subcategories
- `POST /api/categories/scrape` – Trigger scraping

### Products
- `GET /api/products` – List products (pagination, search, filters)
- `GET /api/products/:id` – Get product by ID
- `GET /api/products/:id/details` – Get product details
- `GET /api/products/:id/reviews` – Get product reviews
- `POST /api/products/scrape` – Scrape products
- `POST /api/products/:id/scrape-details` – Scrape product details

### History
- `GET /api/history?sessionId=<id>` – Get browsing history
- `POST /api/history` – Add history entry
- `DELETE /api/history/:id` – Remove entry
- `DELETE /api/history/session/:sessionId` – Clear session

---

## 🗄️ Database Schema

```sql
-- Core entities
navigation (id, name, url, position, isActive, lastScrapedAt)
category (id, name, slug, url, description, imageUrl, parentId, navigationId, lastScrapedAt)
product (id, sku, title, url, imageUrl, price, originalPrice, condition, inStock, author, isbn, rating, reviewCount, categoryId, lastScrapedAt)
product_detail (id, productId, description, publisher, publicationDate, language, pages, format, images, specifications, relatedProducts, lastScrapedAt)
review (id, productId, reviewerName, rating, title, content, reviewDate, isVerifiedPurchase, helpfulCount)
scrape_job (id, type, status, url, params, itemsProcessed, itemsTotal, errorMessage, result, startedAt, completedAt)
view_history (id, sessionId, entityType, entityId, title, url, imageUrl, metadata, createdAt)
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Set environment variable:
- `NEXT_PUBLIC_API_URL=<your-backend-url>/api`

### Backend (Render / Fly.io)
```bash
cd backend
# Deploy to Render or Fly.io
# Set environment variables in platform dashboard
```

Environment variables needed:
- `DATABASE_URL` or individual DB config
- `NODE_ENV=production`
- `CORS_ORIGIN=<frontend-url>`

### Database (Neon / Supabase)
- Create PostgreSQL instance
- Copy connection string
- Update backend environment

---

## 📝 License

MIT

---

## 👤 Author

@arun6184

---

## 🌟 Architecture Highlights

- **Modular Design** – Separate modules for each entity
- **Retry Logic** – Exponential backoff on scraper failures
- **Rate Limiting** – 2-3 second delays between requests
- **Cache Strategy** – TTL-based database caching
- **Type Safety** – Full TypeScript coverage
- **Responsive UI** – Mobile-first design
- **Session Tracking** – LocalStorage-based history
