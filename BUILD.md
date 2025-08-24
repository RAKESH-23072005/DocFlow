# Build Documentation

This document describes how to build the ImageCompressor project reproducibly.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 8+

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ImageCompressor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Development Build

```bash
npm run dev
```

This command:
- Starts the Express server on port 5137
- Sets up Vite dev server for hot reloading
- Enables development logging and error handling

## Production Build

```bash
npm run build
```

This command:
- Builds the React frontend using Vite
- Bundles the Express server using esbuild
- Outputs production files to `dist/` directory

## Production Start

```bash
npm run start
```

This command:
- Starts the production server from the `dist/` directory
- Serves static files from the built frontend
- Disables development features

## Build Process Details

### Frontend Build (Vite)
- Entry point: `client/src/main.tsx`
- Output: `dist/` (static assets)
- Features: React 18, TypeScript, Tailwind CSS, SCSS

### Backend Build (esbuild)
- Entry point: `server/index.ts`
- Output: `dist/index.js`
- Features: Express server, TypeScript compilation, external packages excluded

### Build Artifacts
- `dist/` - Production server and static files
- `client/dist/` - Frontend build output (if using separate build)

## Testing

### Smoke Tests
```bash
# Backend tests only
npm run test:smoke

# Frontend tests only  
npm run test:frontend

# All tests
npm run test:all
```

**Note:** Tests require the server to be running (`npm run dev`)

### Test Coverage
- Backend: Health endpoint (`/api/health`)
- Frontend: Homepage loading and key elements

## Environment Variables

Create a `.env` file for production:
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=your_database_connection_string
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=your_from_email
CONTACT_TO_EMAIL=your_contact_email
```

## Troubleshooting

### Common Issues

1. **SASS Compilation Errors**
   - May occur due to version conflicts
   - Try: `npm install sass@latest --force`

2. **Port Already in Use**
   - Change port in `server/index.ts` line 66
   - Update tests accordingly

3. **Build Failures**
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript compilation: `npm run check`

### Dependency Conflicts
- Use `npm install --legacy-peer-deps` if needed
- Consider updating conflicting packages to compatible versions

## Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` directory**
   - Contains production server and static files
   - Ensure environment variables are set

3. **Start the server**
   ```bash
   npm run start
   ```

## Performance Considerations

- Static assets are cached aggressively (1 year)
- HTML files are not cached for SPA routing
- Server includes rate limiting and security headers
- Images are processed client-side for privacy

## Security Features

- Helmet.js for security headers
- Rate limiting on API endpoints
- CORS configuration
- Input sanitization
- PII redaction in logs

## Monitoring

- Health endpoint: `/api/health`
- Request logging with timing
- Error logging with stack traces
- Performance metrics in development mode
