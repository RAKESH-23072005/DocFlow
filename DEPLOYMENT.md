# Deployment Guide

## Project Structure

This project uses a monorepo structure with both frontend and backend in a single repository:

```
DocFlow/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express + TypeScript)
├── shared/          # Shared types and schemas
└── package.json     # Root package.json (monorepo)
```

## Deployment Options

### Option 1: Monorepo Deployment (Recommended)

The project is already configured for monorepo deployment with the root `package.json`:

```bash
# Install dependencies
npm install

# Build both frontend and backend
npm run build

# Start production server
npm run start
```

**Build Process:**
- Frontend: `vite build` → `client/dist/`
- Backend: `esbuild` → `dist/index.js`

**Scripts:**
- `npm run dev` - Development mode with hot reload
- `npm run build` - Build both frontend and backend
- `npm run start` - Start production server
- `npm run preview` - Preview frontend build

### Option 2: Separate Server Deployment

If you prefer to deploy the server separately, use the new `server/package.json`:

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Build server
npm run build

# Start server
npm run start
```

**Server Scripts:**
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run compiled server
- `npm run dev` - Development mode with tsx

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5137
NODE_ENV=production

# Database
DATABASE_URL=your_database_url_here

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email (if using contact form)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## Production Deployment

### 1. Build the Application

```bash
# Option 1: Monorepo
npm run build

# Option 2: Separate
cd client && npm run build
cd ../server && npm run build
```

### 2. Start the Server

```bash
# Option 1: Monorepo
npm run start

# Option 2: Separate
cd server && npm run start
```

### 3. Verify Deployment

- Frontend: `http://localhost:5137`
- API endpoints: `http://localhost:5137/api/*`

## Platform-Specific Deployment

### Vercel
- Use the monorepo approach
- Set build command: `npm run build`
- Set output directory: `dist`
- Set install command: `npm install`

### Railway
- Use the monorepo approach
- Set start command: `npm run start`
- Set build command: `npm run build`

### Heroku
- Use the monorepo approach
- Set build command: `npm run build`
- Set start command: `npm run start`

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5137
CMD ["npm", "run", "start"]
```

## Security Considerations

The server includes several security features:

- **Helmet.js**: Security headers
- **Rate limiting**: 200 requests per 15 minutes per IP
- **CORS**: Configurable origin restrictions
- **Input validation**: Request size limits and content type validation
- **Error handling**: Safe error messages in production

## Monitoring and Logging

The server includes comprehensive logging:
- Request/response logging with timing
- Error logging with stack traces (development only)
- PII redaction in logs
- Security event logging

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `PORT` environment variable
2. **CORS errors**: Configure `CORS_ORIGIN` environment variable
3. **Database connection**: Ensure `DATABASE_URL` is set correctly
4. **Build failures**: Check TypeScript compilation errors

### Debug Mode

For debugging, set `NODE_ENV=development`:
```bash
NODE_ENV=development npm run dev
```

This enables:
- Detailed error messages
- Vite development server
- Hot reloading
- Source maps
