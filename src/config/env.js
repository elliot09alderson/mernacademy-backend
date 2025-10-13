import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 5002;
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt-secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 7;

export const DB_URL = process.env.MONGO_URI || "mongodb://localhost:27017";
export const DB_NAME = process.env.DB_NAME || "mernacademy";
