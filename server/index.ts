import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();

// Environment check
const isDevelopment = process.env.NODE_ENV === "development";

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
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

// --- CORS ---
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(cors({
  origin: (origin, callback) => {
    if (isDevelopment || !origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// --- Rate Limiting ---
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
}));

// --- Body Parsing ---
app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    if (req.headers["content-type"] && 
        !req.headers["content-type"].includes("application/json")) {
      throw new Error("Invalid content type");
    }
  },
}));
app.use(express.urlencoded({
  extended: false,
  limit: "10mb",
  parameterLimit: 100,
}));

// --- Utility: Redact PII ---
function redactPII(obj: any): any {
  if (obj == null || typeof obj !== "object") return obj;
  const PII_FIELDS = ["email", "name", "token", "password", "pass", "secret", "session", "id", "phone", "address"];
  if (Array.isArray(obj)) return obj.map(redactPII);
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      PII_FIELDS.includes(key.toLowerCase())
        ? "[REDACTED]"
        : typeof value === "object"
        ? redactPII(value)
        : value,
    ])
  );
}

// --- Logging Middleware ---
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const userAgent = req.get("User-Agent") || "Unknown";
  const ip = req.ip || req.socket.remoteAddress || "Unknown";

  let capturedJsonResponse: any;
  const originalResJson = res.json;
  res.json = function (body: any) {
    capturedJsonResponse = body;
    return originalResJson.call(this, body);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms - IP: ${ip} - UA: ${userAgent}`;
      if (capturedJsonResponse) {
        const safeJson = redactPII(capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(safeJson)}`;
      }
      if (logLine.length > 200) logLine = logLine.slice(0, 199) + "…";
      log(logLine);
    }
  });

  next();
});

// --- Server Setup ---
export async function createServer() {
  const server = await registerRoutes(app);

  if (isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Error handling (after routes/middleware)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const safeMessage =
      process.env.NODE_ENV === "production" && status >= 500
        ? "Internal Server Error"
        : err.message || "Error";

    res.status(status).json({
      message: safeMessage,
      ...(isDevelopment && { stack: err.stack }),
    });

    log(`Error ${status}: ${err.message}`, "error");
  });

  return server;
}

// --- Bootstrapping ---
(async () => {
  try {
    const server = await createServer();
    const port = process.env.PORT || 5137;
    server.listen(port, () => {
      log(`🚀 Server running on port ${port}`);
      if (isDevelopment) {
        log(`Dev server: http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
