import cors from "cors";
import express from "express";
import { env } from "./config/env";
import settingsRoutes from "./routes/settingsRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

const localhostPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;
const allowedOriginSet = new Set([
  ...env.clientUrls,
  "https://focusdock-web.onrender.com",
  "tauri://localhost",
  "http://tauri.localhost",
  "https://tauri.localhost",
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
  "https://localhost"
]);

const isAllowedOrigin = (origin: string) =>
  allowedOriginSet.has(origin) ||
  origin.startsWith("chrome-extension://") ||
  localhostPattern.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/settings", settingsRoutes);

app.use(errorHandler);
