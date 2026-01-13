# Database Schema

## Overview
This document describes the complete PostgreSQL database schema for the World of Books scraper platform.

---

## Tables

### 1. navigation
Stores top-level navigation menu items from the website.

```sql
CREATE TABLE navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL UNIQUE,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_scraped_at TIMESTAMP
);

CREATE INDEX idx_navigation_url ON navigation(url);
```

### 2. category
Stores product categories and subcategories with hierarchical structure.

```sql
CREATE TABLE category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id UUID REFERENCES category(id) ON DELETE CASCADE,
  navigation_id UUID REFERENCES navigation(id) ON DELETE SET NULL,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_scraped_at TIMESTAMP
);

CREATE INDEX idx_category_slug ON category(slug);
CREATE INDEX idx_category_parent_id ON category(parent_id);
CREATE INDEX idx_category_navigation_id ON category(navigation_id);
```

### 3. product
Stores product listings with basic information.

```sql
CREATE TABLE product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  image_url VARCHAR(500),
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  condition VARCHAR(50),
  in_stock BOOLEAN DEFAULT true,
  author VARCHAR(255),
  isbn VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category_id UUID REFERENCES category(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_scraped_at TIMESTAMP
);

CREATE INDEX idx_product_sku ON product(sku);
CREATE INDEX idx_product_category_id ON product(category_id);
CREATE INDEX idx_product_title ON product USING gin(to_tsvector('english', title));
```

### 4. product_detail
Stores detailed product information (one-to-one with product).

```sql
CREATE TABLE product_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL UNIQUE REFERENCES product(id) ON DELETE CASCADE,
  description TEXT,
  publisher VARCHAR(255),
  publication_date VARCHAR(50),
  language VARCHAR(100),
  pages INTEGER,
  format VARCHAR(100),
  dimensions VARCHAR(100),
  weight VARCHAR(50),
  images JSONB,
  specifications JSONB,
  related_products JSONB,
  detailed_condition_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_scraped_at TIMESTAMP
);

CREATE INDEX idx_product_detail_product_id ON product_detail(product_id);
```

### 5. review
Stores customer reviews for products.

```sql
CREATE TABLE review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(255),
  rating DECIMAL(3, 2) NOT NULL,
  title VARCHAR(500),
  content TEXT,
  review_date VARCHAR(50),
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_product_id ON review(product_id);
CREATE INDEX idx_review_rating ON review(rating);
```

### 6. scrape_job
Tracks scraping jobs and their status.

```sql
CREATE TYPE scrape_job_type AS ENUM ('navigation', 'category', 'product', 'product_detail');
CREATE TYPE scrape_job_status AS ENUM ('pending', 'running', 'completed', 'failed');

CREATE TABLE scrape_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type scrape_job_type NOT NULL,
  status scrape_job_status DEFAULT 'pending',
  url VARCHAR(500) NOT NULL,
  params JSONB,
  items_processed INTEGER DEFAULT 0,
  items_total INTEGER DEFAULT 0,
  error_message TEXT,
  result JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_scrape_job_status ON scrape_job(status);
CREATE INDEX idx_scrape_job_type ON scrape_job(type);
```

### 7. view_history
Stores user browsing history.

```sql
CREATE TABLE view_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(500),
  image_url VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_view_history_session_id ON view_history(session_id);
CREATE INDEX idx_view_history_created_at ON view_history(created_at DESC);
```

---

## Relationships

```
navigation (1) ──< (many) category
category (1) ──< (many) category (self-referencing: parent_id)
category (1) ──< (many) product
product (1) ──── (1) product_detail
product (1) ──< (many) review
```

---

## TypeORM Auto-Generation

TypeORM will automatically create these tables when the NestJS application starts in development mode (`synchronize: true`). For production, use migrations:

```bash
# Generate migration
npm run migration:generate -- src/database/migrations/InitialSchema

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

---

## Sample Data

### Insert sample navigation
```sql
INSERT INTO navigation (name, url, position) VALUES
('Books', 'https://www.worldofbooks.com/en-gb/books', 0),
('DVDs', 'https://www.worldofbooks.com/en-gb/dvds', 1),
('CDs', 'https://www.worldofbooks.com/en-gb/cds', 2);
```

### Insert sample category
```sql
INSERT INTO category (name, slug, url, navigation_id) VALUES
('Fiction', 'fiction', 'https://www.worldofbooks.com/en-gb/books/fiction', '<navigation-uuid>'),
('Non-Fiction', 'non-fiction', 'https://www.worldofbooks.com/en-gb/books/non-fiction', '<navigation-uuid>');
```

---

## Performance Optimization

- **Indexes:** All foreign keys and frequently queried fields have indexes
- **JSONB:** Used for flexible schema fields (images, specifications, metadata)
- **Full-text Search:** GIN index on product title for search functionality
- **Cascading Deletes:** Configured to maintain referential integrity
- **Timestamps:** All tables include created_at/updated_at for auditing

---

## Maintenance

### Cleanup old scrape jobs
```sql
DELETE FROM scrape_job 
WHERE completed_at < NOW() - INTERVAL '30 days';
```

### Cleanup old history
```sql
DELETE FROM view_history 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Vacuum and analyze
```sql
VACUUM ANALYZE;
```
