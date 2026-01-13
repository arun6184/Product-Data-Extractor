# Deployment Guide

## Frontend Deployment (Vercel)

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Option 2: Vercel GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

---

## Backend Deployment

### Option 1: Render.com

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

4. Add environment variables:
```
NODE_ENV=production
PORT=3001
DATABASE_HOST=<db-host>
DATABASE_PORT=5432
DATABASE_USER=<db-user>
DATABASE_PASSWORD=<db-password>
DATABASE_NAME=worldofbooks_scraper
SCRAPER_BASE_URL=https://www.worldofbooks.com
CORS_ORIGIN=https://your-frontend.vercel.app
```

5. Deploy

### Option 2: Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login and initialize:
```bash
cd backend
fly auth login
fly launch
```

3. Set secrets:
```bash
fly secrets set DATABASE_URL=postgresql://user:password@host:5432/db
fly secrets set NODE_ENV=production
fly secrets set CORS_ORIGIN=https://your-frontend.vercel.app
```

4. Deploy:
```bash
fly deploy
```

---

## Database Deployment

### Option 1: Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update backend environment: `DATABASE_URL=postgresql://...`

### Option 2: Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string (use connection pooling)
4. Update backend environment variables

### Option 3: Railway

1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Copy connection details
4. Set individual DB env vars in backend

---

## Post-Deployment Checklist

✅ Backend is accessible via HTTPS
✅ Frontend can connect to backend API
✅ Database migrations run successfully
✅ CORS is configured correctly
✅ Environment variables are set
✅ Swagger docs accessible (optional for production)
✅ Test scraping endpoints
✅ Verify caching works

---

## Environment Variables Summary

### Backend (.env)
```bash
NODE_ENV=production
PORT=3001
DATABASE_HOST=<host>
DATABASE_PORT=5432
DATABASE_USER=<user>
DATABASE_PASSWORD=<password>
DATABASE_NAME=worldofbooks_scraper
SCRAPER_BASE_URL=https://www.worldofbooks.com
SCRAPER_HEADLESS=true
SCRAPER_RATE_LIMIT_MS=2000
SCRAPER_MAX_RETRIES=3
CACHE_TTL_NAVIGATION=86400
CACHE_TTL_CATEGORY=43200
CACHE_TTL_PRODUCT=21600
CACHE_TTL_PRODUCT_DETAIL=10800
CACHE_TTL_REVIEW=3600
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_APP_NAME=World of Books Explorer
```

---

## Monitoring & Maintenance

1. **Logs:** Check platform logs for errors
2. **Database:** Monitor connection pool usage
3. **Scraper:** Check scrape job success rates
4. **Cache:** Monitor cache hit rates
5. **Performance:** Use platform analytics

---

## Scaling Considerations

- **Database:** Use connection pooling (PgBouncer)
- **Backend:** Enable horizontal scaling on platform
- **Scraper:** Implement job queue (BullMQ) for heavy scraping
- **Caching:** Add Redis for better performance
- **CDN:** Use Vercel Edge Network for frontend

---

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS settings in backend
- Ensure backend is deployed and accessible

### Database connection errors
- Verify connection string format
- Check firewall/IP whitelist settings
- Ensure SSL/TLS is properly configured

### Scraper failing
- Check target website hasn't changed structure
- Verify Playwright can run in deployment environment
- Monitor rate limits and adjust delays

### Build failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs for specific errors
