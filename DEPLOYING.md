# Deployment Guide

This guide covers deploying the Image Compressor application to production with security, performance, and reliability best practices.

## 🚀 Prerequisites

- Node.js 18+ 
- npm 9+ or yarn 1.22+
- SSL/TLS certificate (required for HSTS headers)
- Environment variables configured
- Database connection established

## 🔧 Environment Setup

Create a `.env` file in your production environment:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Database
DATABASE_URL=your_database_connection_string

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourdomain.com
CONTACT_TO_EMAIL=contact@yourdomain.com

# Security
SESSION_SECRET=your_very_long_random_session_secret
```

## 🏗️ Build Process

### 1. Install Dependencies
```bash
npm ci --only=production
npm run build:prod
```

### 2. Verify Build
```bash
npm run verify:build
```

### 3. Analyze Bundle (Optional)
```bash
npm run analyze
# Open dist/public/bundle-report.html for analysis
```

## 🚀 Deployment Options

### Option 1: Direct Server Deployment

1. **Upload Files**
   ```bash
   scp -r dist/ user@your-server:/var/www/imagecompressor/
   scp package.json user@your-server:/var/www/imagecompressor/
   ```

2. **Install Production Dependencies**
   ```bash
   ssh user@your-server
   cd /var/www/imagecompressor
   npm ci --only=production
   ```

3. **Start Application**
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY dist/ ./
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t imagecompressor .
   docker run -p 3000:3000 --env-file .env imagecompressor
   ```

### Option 3: Platform-as-a-Service

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🔒 Security Headers Configuration

The application automatically sets the following security headers:

- **Content Security Policy**: Restricts script sources and inline content
- **Strict Transport Security**: Enforces HTTPS with 2-year max-age
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Additional XSS protection
- **Referrer Policy**: Controls referrer information

### Customizing CSP (if needed)
Modify the helmet configuration in `server/index.ts`:

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-cdn.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "blob:", "https://trusted-cdn.com"],
    // Add more directives as needed
  },
}
```

## 📡 CORS Configuration

**Important**: CORS behavior differs between development and production:

- **Development**: All origins are allowed for easier testing and development
- **Production**: Only specified origins in `CORS_ORIGIN` are allowed

Configure allowed origins in your environment:

```bash
# Single domain
CORS_ORIGIN=https://yourdomain.com

# Multiple domains
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

**Note**: In development mode (`NODE_ENV=development`), the application automatically allows all origins to facilitate local development and testing. This setting is automatically disabled in production for security.

## 🗄️ Database Setup

1. **Run Migrations**
   ```bash
   npm run db:push
   ```

2. **Verify Connection**
   ```bash
   curl https://yourdomain.com/api/health
   ```

## 🚦 Rate Limiting

The application implements rate limiting:

- **General API**: 200 requests per 15 minutes per IP
- **Contact Form**: 20 submissions per 10 minutes per IP
- **File Uploads**: 50 uploads per 15 minutes per IP

Adjust limits in `server/routes.ts` if needed.

## 📊 Performance Monitoring

### 1. Bundle Analysis
```bash
npm run analyze
# Check dist/public/bundle-report.html
```

### 2. Lighthouse Audit
```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --output=json --output-path=./lighthouse-report.json
lighthouse https://yourdomain.com --output=html --output-path=./lighthouse-report.html
```

### 3. Performance Targets
- **Lighthouse Performance**: ≥ 95
- **Main JS Bundle**: ≤ 200 KB gzipped
- **First Interaction**: < 2.5s
- **TTFB**: < 1s on simple pages

## 🗂️ CDN Configuration

### Cloudflare
1. **Enable HTTPS**: Force SSL/TLS encryption
2. **Enable HSTS**: Set max-age to 63072000 (2 years)
3. **Configure Caching**:
   - Static assets: Cache-Control: public, max-age=31536000
   - HTML: Cache-Control: public, max-age=3600
   - API responses: Cache-Control: no-cache

### AWS CloudFront
```json
{
  "CacheBehaviors": {
    "StaticAssets": {
      "PathPattern": "/assets/*",
      "TTL": 31536000
    },
    "HTML": {
      "PathPattern": "/*.html",
      "TTL": 3600
    }
  }
}
```

## 🔄 Caching Strategy

### Static Assets
- **JavaScript/CSS**: 1 year (31536000 seconds)
- **Images**: 1 month (2592000 seconds)
- **Fonts**: 1 year (31536000 seconds)

### HTML Pages
- **Homepage**: 1 hour (3600 seconds)
- **Other pages**: 30 minutes (1800 seconds)

### API Responses
- **GET requests**: 5 minutes (300 seconds)
- **POST requests**: No caching

## 📝 Server Configuration

### Nginx (Recommended)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/imagecompressor/dist/public
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    # Security headers
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    
    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
    </Location>
    
    # Proxy to Node.js
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</VirtualHost>
```

## 🔍 Health Checks

### Application Health
```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-22T10:00:00.000Z",
  "version": "1.1.0",
  "environment": "production"
}
```

### Database Health
```bash
# Check if database migrations are up to date
npm run db:push --dry-run
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify `CORS_ORIGIN` environment variable
   - Check if domain is in allowed origins list

2. **Security Header Issues**
   - Ensure SSL/TLS is properly configured
   - Check if reverse proxy is stripping headers

3. **Performance Issues**
   - Run bundle analysis: `npm run analyze`
   - Check Lighthouse scores
   - Verify CDN configuration

4. **Database Connection Issues**
   - Verify `DATABASE_URL` environment variable
   - Check database server accessibility
   - Run `npm run db:push` to verify connection

### Logs
```bash
# Application logs
tail -f /var/log/imagecompressor/app.log

# Error logs
tail -f /var/log/imagecompressor/error.log

# Access logs
tail -f /var/log/imagecompressor/access.log
```

## 🔄 Rollback Plan

### Quick Rollback
```bash
# Stop current version
pm2 stop imagecompressor

# Restore previous version
cd /var/www/imagecompressor
git checkout HEAD~1
npm ci --only=production
npm run build:prod

# Start previous version
pm2 start imagecompressor
```

### Database Rollback
```bash
# If using Drizzle migrations
npm run db:push --force
```

## 📚 Additional Resources

- [Security Headers Best Practices](https://owasp.org/www-project-secure-headers/)
- [CORS Configuration Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Performance Optimization](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

## 🆘 Support

For deployment issues:
1. Check the logs for error messages
2. Verify environment variables
3. Test endpoints individually
4. Review security header configuration
5. Contact the development team with specific error details
