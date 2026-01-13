# Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Swagger Documentation
Interactive API documentation available at:
```
http://localhost:3001/api/docs
```

---

## Endpoints

### Navigation

#### Get All Navigation Items
```http
GET /navigation
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Books",
    "url": "https://www.worldofbooks.com/en-gb/books",
    "position": 0,
    "isActive": true,
    "lastScrapedAt": "2024-01-13T10:00:00Z"
  }
]
```

#### Trigger Navigation Scraping
```http
POST /navigation/scrape
```

**Response:**
```json
{
  "jobId": "uuid",
  "message": "Navigation scraping job started"
}
```

---

### Categories

#### Get Categories
```http
GET /categories?navigationId={uuid}&parentId={uuid}
```

**Query Parameters:**
- `navigationId` (optional) – Filter by navigation
- `parentId` (optional) – Filter by parent category

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Fiction",
    "slug": "fiction",
    "url": "https://www.worldofbooks.com/en-gb/books/fiction",
    "description": "Fiction books",
    "imageUrl": "https://...",
    "productCount": 1250,
    "children": []
  }
]
```

#### Trigger Category Scraping
```http
POST /categories/scrape?navigationUrl={url}&navigationId={uuid}
```

---

### Products

#### List Products (Paginated)
```http
GET /products?categoryId={uuid}&page=1&limit=20&search={query}&sortBy=createdAt&sortOrder=DESC
```

**Query Parameters:**
- `categoryId` (optional) – Filter by category
- `page` (default: 1) – Page number
- `limit` (default: 20) – Items per page
- `search` (optional) – Search query
- `sortBy` (default: createdAt) – Sort field
- `sortOrder` (default: DESC) – ASC or DESC

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "sku": "WOB-123",
      "title": "The Great Gatsby",
      "url": "https://...",
      "imageUrl": "https://...",
      "price": 5.99,
      "originalPrice": 9.99,
      "condition": "Used - Very Good",
      "inStock": true,
      "author": "F. Scott Fitzgerald",
      "isbn": "9780141182636",
      "rating": 4.5,
      "reviewCount": 12
    }
  ],
  "total": 1250,
  "page": 1,
  "limit": 20,
  "totalPages": 63
}
```

#### Get Product by ID
```http
GET /products/{id}
```

#### Get Product Details
```http
GET /products/{id}/details
```

**Response:**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "description": "A classic American novel...",
  "publisher": "Penguin Books",
  "publicationDate": "2000",
  "language": "English",
  "pages": 180,
  "format": "Paperback",
  "images": ["url1", "url2"],
  "specifications": {},
  "relatedProducts": []
}
```

#### Get Product Reviews
```http
GET /products/{id}/reviews
```

#### Trigger Product Scraping
```http
POST /products/scrape
Content-Type: application/json

{
  "categoryUrl": "https://www.worldofbooks.com/en-gb/books/fiction",
  "categoryId": "uuid",
  "maxPages": 5
}
```

#### Trigger Product Detail Scraping
```http
POST /products/{id}/scrape-details
```

---

### History

#### Get Browsing History
```http
GET /history?sessionId={sessionId}&limit=50
```

**Response:**
```json
[
  {
    "id": "uuid",
    "sessionId": "session-123",
    "entityType": "product",
    "entityId": "uuid",
    "title": "The Great Gatsby",
    "url": "https://...",
    "imageUrl": "https://...",
    "createdAt": "2024-01-13T10:00:00Z"
  }
]
```

#### Add History Entry
```http
POST /history
Content-Type: application/json

{
  "sessionId": "session-123",
  "entityType": "product",
  "entityId": "uuid",
  "title": "The Great Gatsby",
  "url": "https://...",
  "imageUrl": "https://..."
}
```

#### Delete History Entry
```http
DELETE /history/{id}
```

#### Clear Session History
```http
DELETE /history/session/{sessionId}
```

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200` – Success
- `201` – Created
- `204` – No Content
- `400` – Bad Request
- `404` – Not Found
- `500` – Internal Server Error

**Error Format:**
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

---

## Rate Limiting

Scraper endpoints include built-in rate limiting:
- 2-3 second delays between requests
- Maximum 3 retry attempts with exponential backoff
- Configurable via environment variables

---

## Cache TTL

- Navigation: 24 hours
- Categories: 12 hours  
- Products: 6 hours
- Product Details: 3 hours
- Reviews: 1 hour
