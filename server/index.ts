import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();

// Environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Tailwind
      imgSrc: ["'self'", "data:", "blob:"], // Allow data URLs for image compression
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow image compression
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow image processing
  referrerPolicy: { policy: "no-referrer" },
  strictTransportSecurity: isDevelopment ? false : {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  },
  xContentTypeOptions: true,
  xFrameOptions: true,
  xXssProtection: true,
}));

// Enhanced CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // In development, allow all origins for easier testing
    if (isDevelopment) {
      return callback(null, true);
    }
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Enhanced rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
}));

// Enhanced body parsing with stricter limits
app.use(express.json({ 
  limit: "10mb", // Increased for image uploads
  verify: (req, res, buf) => {
    // Basic content type validation
    if (req.headers['content-type'] && !req.headers['content-type'].includes('application/json')) {
      throw new Error('Invalid content type');
    }
  }
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: "10mb",
  parameterLimit: 100 // Limit number of parameters
}));

// Utility to redact common PII fields in logs
function redactPII(obj: any): any {
  if (obj == null || typeof obj !== 'object') return obj;
  const PII_FIELDS = ['email', 'name', 'token', 'password', 'pass', 'secret', 'session', 'id', 'phone', 'address'];
  if (Array.isArray(obj)) return obj.map(redactPII);
  const redacted: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (PII_FIELDS.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object') {
      redacted[key] = redactPII(obj[key]);
    } else {
      redacted[key] = obj[key];
    }
  }
  return redacted;
}

// Enhanced logging middleware with security
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  // Security logging
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';
  
  let capturedJsonResponse: Record<string, any> | undefined = undefined;
  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]): any {
    capturedJsonResponse = bodyJson;
    // Only pass the first argument to match the expected signature
    return originalResJson.apply(res, [bodyJson]);
  } as any;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms - IP: ${ip} - UA: ${userAgent}`;
      if (capturedJsonResponse) {
        // Redact PII fields before logging
        const safeJson = redactPII(capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(safeJson)}`;
      }
      if (logLine.length > 200) {
        logLine = logLine.slice(0, 199) + "…";
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Enhanced error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Don't expose internal errors in production
    const safeMessage = process.env.NODE_ENV === 'production' && status >= 500 
      ? 'Internal Server Error' 
      : message;
    
    res.status(status).json({ 
      message: safeMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    
    log(`Error ${status}: ${message}`, "error");
  });
  
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  const port = process.env.PORT || 5137;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`Server running at http://localhost:${port}`);
  });
})();
