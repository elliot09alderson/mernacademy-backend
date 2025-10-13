import express from "express";
const app = express();
import { port } from "./config/env.js";
import errorHandler from "./middleware/errorHandler.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

import dotenv from "dotenv";

import cors from "cors";
dotenv.config({ path: "./src/.env" });
import { connectDB } from "./db/db.js";

// import adminRouter from "./routes/adminRoute.js";
// import authRouter from "./routes/authRoute.js";

import CookieParser from "cookie-parser";
import studentRoutes from "./student/studentRoutes.js";
import facultyRoutes from "./faculity/facultyRoutes.js";

connectDB("mernacademy");

// ______  CSP HEADERS   _______
const setSecureHeaders = (req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  next();
};
app.use(setSecureHeaders);

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://preview--cdmo.lovable.app",
  "https://preview--cdmo.lovable.app",
  "https://preview--cdmo-48.lovable.app",
  "http://20.55.30.42",
  "http://localhost:5173", // for local dev
  "http://localhost:8080", // for local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // <-- allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use(CookieParser());
app.get("/", (req, res) => {
  res.send("hello");
});

// Test route directly in server
app.get("/api/v1/direct-test", (req, res) => {
  res.json({ message: "Direct route working!" });
});

// Routes enabled (rate limiting temporarily disabled)
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);

// Handle 404 for unmatched routes
// app.all('*', handleNotFound);

// Global error handling middleware
app.use(errorHandler);
app.use(globalErrorHandler);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
