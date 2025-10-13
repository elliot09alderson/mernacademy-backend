import { LogModel } from "../models/logModel.js";


export const auditMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  console.log(`📝 [${new Date().toISOString()}] ${req.method} ${req.path}`, {
    userId: req.headers["user-id"] || "anonymous",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Log response time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`✅ Response: ${res.statusCode} - ${duration}ms`);
  });

  next();
};

export const logRequest = async (req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end;

  res.end = function (...args) {
    const end = Date.now();
    const duration = end - start;

    // Get the effected entity from the URL
    const effectedEntity = getEffectedEntity(req.originalUrl);

    const logData = {
      level: res.statusCode >= 400 ? "error" : "info",
      message: `Request: ${req.method} ${req.originalUrl} finished in ${duration}ms`,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      userId: req.user ? req.user.id : null,
      userEmail: req.user ? req.user.email : null,
      userRole: req.user ? req.user.role : null,
      effectedEntity: effectedEntity,
      ip:
        req.ip ||
        req.connection.remoteAddress ||
        req.headers["x-forwarded-for"] ||
        "unknown",
      userAgent: req.get("User-Agent") || "unknown",
    };

    LogModel.create(logData).catch((err) => {
      console.error("Failed to save log to database:", err);
    });

    originalEnd.apply(res, args);
  };

  next();
};
