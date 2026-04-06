import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skyvoyage";
const SESSION_SECRET = process.env.SESSION_SECRET || "skyvoyage-dev-secret-change-me";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

await mongoose.connect(MONGODB_URI);
console.log("MongoDB connected");

app.use(
  session({
    name: "skyvoyage.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

const dataDir = path.join(__dirname, "data");

function readJsonFile(filename) {
  const full = path.join(dataDir, filename);
  const raw = fs.readFileSync(full, "utf8");
  return JSON.parse(raw);
}

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/flights", (req, res) => {
  try {
    const flights = readJsonFile("flights.json");
    const withNumber = flights.map((f) => ({
      ...f,
      flightNumber: f.flightNumber || f.id,
    }));
    res.json(withNumber);
  } catch (e) {
    res.status(500).json({ error: "Failed to load flights" });
  }
});

app.get("/api/airports", (req, res) => {
  try {
    res.json(readJsonFile("airports.json"));
  } catch (e) {
    res.status(500).json({ error: "Failed to load airports" });
  }
});

app.get("/api/promos", (req, res) => {
  try {
    res.json(readJsonFile("promos.json"));
  } catch (e) {
    res.status(500).json({ error: "Failed to load promos" });
  }
});

app.get("/api/seat-maps", (req, res) => {
  try {
    res.json(readJsonFile("seat-maps.json"));
  } catch (e) {
    res.status(500).json({ error: "Failed to load seat maps" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`SkyVoyage API at http://localhost:${PORT}`);
});
